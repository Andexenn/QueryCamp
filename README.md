# 🚀 GraphQL Sandbox & Local AI Studio

A modern, high-performance static web application built with React and TypeScript. This project serves as an interactive GraphQL sandbox featuring real-time subscriptions, coupled with a fully local, in-browser AI assistant powered by WebLLM.



## ✨ Key Features

* **Local AI Engine (WebLLM):** Runs Large Language Models entirely in the browser using Web Workers and WebGPU, optimize user experience.
* **Real-Time GraphQL:** Fully supports Queries, Mutations, and Subscriptions over WebSockets using Apollo Server.
* **Persistent Storage:** Utilizes `IndexedDB` for fast, offline-capable chat session and state management.
* **Modern React Architecture:** Built with strict TypeScript, custom hooks, and context providers for clean state management.

## 🛠 Tech Stack

**Frontend:**
* React 18 + TypeScript
* WebLLM (In-browser AI)
* IndexedDB (Local Storage)
* Apollo Client (HTTP & WebSocket Split Link)

**Backend (Sandbox API):**
* Node.js + Express
* Apollo Server v5
* `graphql-ws` & `graphql-subscriptions` (PubSub)

---

## 🚦 Getting Started

### 1. Backend Setup (GraphQL API)

The backend provides a mock database of users and real-time subscription events to test the sandbox capabilities.

**Step 1: Navigate to your backend directory**
Make sure all provided backend files are in the same folder:
* `package.json`
* `server.js`
* `schema.js`
* `_db.js`

**Step 2: Install dependencies**
Run the following command to install Express, Apollo Server, and the required WebSocket packages:
```bash
npm install
```
**Step 3: Start the server**

Because the project uses ES Modules ("type": "module" in package.json), you can run the server directly with Node:

```Bash
node server.js
```
Success! You should see the following in your terminal:

```
HTTP Server ready at http://localhost:4000/graphql
WebSocket Subscriptions ready at ws://localhost:4000/graphql
```

Source code for BE:
```
// _db.js
export const users = [
    { id: '1', name: 'Alice', age: 30, isMarried: true },
    { id: '2', name: 'Bob', age: 25, isMarried: false },
    { id: '3', name: 'Charlie', age: 35, isMarried: true }
];

// schema.js
const typeDefs = `#graphql
    type Query {
        getUsers: [User!]
        getUserById(id: ID!): User 
    }

    type Mutation {
        createUser(user: AddUserInput!): User
    }

    # Add the Subscription type here
    type Subscription {
        userCreated: User!
    }

    type User {
        id: ID!
        name: String!
        age: Int
        isMarried: Boolean
    }

    input AddUserInput {
        name: String!
        age: Int!
        isMarried: Boolean!
    }
`;

export default typeDefs;

// server.js
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { PubSub } from 'graphql-subscriptions';
import cors from 'cors';
import typeDefs from './schema.js';
import users from './_db.js';

// 1. Initialize PubSub
const pubsub = new PubSub();
const USER_CREATED = 'USER_CREATED';

const resolvers = {
    Query: {
        getUsers() {
            return users;
        },
        getUserById(_, args) {
            return users.find(usr => usr.id === args.id);
        }
    },
    Mutation: {
        createUser(_, args) {
            const newUser = {
                id: (users.length + 1).toString(),
                ...args.user
            };
            users.push(newUser);
            
            // 2. Publish the event! Tell the server a user was created.
            pubsub.publish(USER_CREATED, { userCreated: newUser });

            return newUser;
        }
    },
    // 3. Add the Subscription resolver
    Subscription: {
        userCreated: {
            subscribe: () => pubsub.asyncIterableIterator([USER_CREATED]),
        },
    },
};

// 4. Set up Express and WebSockets
const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

await server.start();

app.use('/graphql', cors(), express.json(), expressMiddleware(server));

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`HTTP Server ready at http://localhost:${PORT}/graphql`);
    console.log(`WebSocket Subscriptions ready at ws://localhost:${PORT}/graphql`);
});
```