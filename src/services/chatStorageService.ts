import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
}

interface ChatDB extends DBSchema {
  sessions: {
    key: string;
    value: ChatSession;
    indexes: { 'by-updated': number };
  };
}

const DB_NAME = 'querycamp-chat-db';
const STORE_NAME = 'sessions';
const MAX_SESSIONS = 50;
const MAX_MESSAGES = 100;

class ChatStorageService {
  private dbPromise: Promise<IDBPDatabase<ChatDB>>;

  constructor() {
    this.dbPromise = openDB<ChatDB>(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
        store.createIndex('by-updated', 'updatedAt');
      },
    });
  }

  async getSessions(): Promise<ChatSession[]> {
    const db = await this.dbPromise;
    // Get all sessions, sort by descending updatedAt
    const sessions = await db.getAllFromIndex(STORE_NAME, 'by-updated');
    return sessions.reverse(); // newest first
  }

  async getSession(id: string): Promise<ChatSession | undefined> {
    const db = await this.dbPromise;
    return db.get(STORE_NAME, id);
  }

  async createSession(title: string = 'New Chat'): Promise<ChatSession> {
    const db = await this.dbPromise;
    const session: ChatSession = {
      id: crypto.randomUUID(),
      title,
      updatedAt: Date.now(),
      messages: [],
    };
    await db.put(STORE_NAME, session);
    await this.enforceSessionLimit();
    return session;
  }

  async updateSession(session: ChatSession): Promise<void> {
    const db = await this.dbPromise;
    
    // Enforce message limit
    if (session.messages.length > MAX_MESSAGES) {
      session.messages = session.messages.slice(-MAX_MESSAGES);
    }
    
    session.updatedAt = Date.now();
    await db.put(STORE_NAME, session);
  }

  async deleteSession(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, id);
  }

  async clearAll(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(STORE_NAME);
  }

  private async enforceSessionLimit(): Promise<void> {
    const db = await this.dbPromise;
    const sessions = await db.getAllFromIndex(STORE_NAME, 'by-updated');
    
    if (sessions.length > MAX_SESSIONS) {
      // Sort oldest first
      const oldestFirst = sessions.sort((a, b) => a.updatedAt - b.updatedAt);
      const toDelete = oldestFirst.slice(0, sessions.length - MAX_SESSIONS);
      
      const tx = db.transaction(STORE_NAME, 'readwrite');
      for (const session of toDelete) {
        tx.store.delete(session.id);
      }
      await tx.done;
    }
  }
}

export const chatStorage = new ChatStorageService();
