import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

/**
 * Abstract interface for Firebase Realtime Database operations.
 *
 * @abstract
 * @class IRealTimeDatabase
 *
 * @description
 * Defines the contract for Firebase Realtime Database operations.
 * Provides methods for CRUD operations and specialized queries on Firebase data.
 */
export abstract class IRealTimeDatabase {
  /**
   * Retrieves data from the specified Firebase path.
   *
   * @param {string} path - The Firebase database path
   * @returns {Promise<any>} The data at the specified path
   */
  abstract getData(path: string): Promise<any>;

  /**
   * Retrieves data with keys greater than or equal to the specified timestamp.
   *
   * @param {string} path - The Firebase database path
   * @param {number} limit - The minimum timestamp in milliseconds
   * @returns {Promise<any>} The filtered data
   */
  abstract getDataBiggerThan(path: string, limit: number);

  /**
   * Sets data at the specified Firebase path, replacing existing data.
   *
   * @param {string} path - The Firebase database path
   * @param {any} data - The data to set
   * @returns {Promise<void>}
   */
  abstract setData(path: string, data: any): Promise<void>;

  /**
   * Updates data at the specified Firebase path, merging with existing data.
   *
   * @param {string} path - The Firebase database path
   * @param {any} data - The data to update
   * @returns {Promise<void>}
   */
  abstract updateData(path: string, data: any): Promise<void>;

  /**
   * Deletes data at the specified Firebase path.
   *
   * @param {string} path - The Firebase database path
   * @returns {Promise<void>}
   */
  abstract deleteData(path: string): Promise<void>;

  /**
   * Pushes new data to the specified Firebase path with an auto-generated key.
   *
   * @param {string} path - The Firebase database path
   * @param {any} data - The data to push
   * @returns {Promise<void>}
   */
  abstract pushData(path: string, data: any): Promise<void>;

  /**
   * Retrieves the last (most recent) entry at the specified Firebase path.
   *
   * @param {string} path - The Firebase database path
   * @returns {Promise<any>} The most recent entry
   */
  abstract getLast(path: string): Promise<any>;
}

/**
 * Concrete implementation of Firebase Realtime Database operations.
 *
 * @class FirebaseRealTimeDatabase
 * @implements {IRealTimeDatabase}
 *
 * @description
 * Provides a NestJS-injectable service for interacting with Firebase Realtime Database.
 * Implements all CRUD operations and specialized queries defined in IRealTimeDatabase.
 *
 * @example
 * ```typescript
 * const db = new FirebaseRealTimeDatabase(firebaseAdmin);
 * const data = await db.getData('/ambiente');
 * ```
 */
@Injectable()
export class FirebaseRealTimeDatabase implements IRealTimeDatabase {
  /**
   * Creates an instance of FirebaseRealTimeDatabase.
   *
   * @param {FirebaseAdmin} firebase - The Firebase Admin SDK instance injected by NestJS
   */
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  /**
   * Retrieves all data from the specified Firebase path.
   *
   * @param {string} path - The Firebase database path (e.g., '/ambiente')
   * @returns {Promise<any>} The data at the specified path, or null if path doesn't exist
   *
   * @example
   * ```typescript
   * const allData = await db.getData('/ambiente');
   * ```
   */
  async getData(path: string) {
    const db = this.firebase.database;
    const snapshot = await db?.ref(path).once('value');
    return snapshot?.val();
  }

  /**
   * Retrieves data with keys greater than or equal to the specified timestamp.
   *
   * @param {string} path - The Firebase database path
   * @param {number} limit - The minimum timestamp in milliseconds
   * @returns {Promise<any>} The filtered data with keys >= the timestamp
   *
   * @description
   * Converts the millisecond timestamp to seconds (Firebase key format) and queries
   * all entries with keys at or after that timestamp. Assumes keys are stored as
   * Unix timestamps in seconds.
   *
   * @example
   * ```typescript
   * const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
   * const recentData = await db.getDataBiggerThan('/ambiente', fiveMinutesAgo);
   * ```
   */
  async getDataBiggerThan(path: string, limit: number) {
    const db = this.firebase.database;
    const initialKey = (limit / 1000).toString().split('.')[0];
    const snapshot = await db
      ?.ref(path)
      .orderByKey()
      .startAt(initialKey)
      .once('value');
    return snapshot?.val();
  }

  /**
   * Retrieves the last (most recent) entry at the specified Firebase path.
   *
   * @param {string} path - The Firebase database path
   * @returns {Promise<any>} The most recent entry, or null if no data exists
   *
   * @description
   * Orders entries by key and retrieves only the last one. Assumes keys are
   * ordered chronologically (e.g., timestamps).
   *
   * @example
   * ```typescript
   * const lastMeasurement = await db.getLast('/ambiente');
   * ```
   */
  async getLast(path: string) {
    const db = this.firebase.database;
    const snapshot = await db
      ?.ref(path)
      .orderByKey()
      .limitToLast(1)
      .once('value');
    const data = snapshot?.val();
    if (!data) return null;
    const lastKey = Object.keys(data)[0];
    return data[lastKey];
  }

  /**
   * Sets data at the specified Firebase path, replacing any existing data.
   *
   * @param {string} path - The Firebase database path
   * @param {any} data - The data to set
   * @returns {Promise<void>}
   *
   * @description
   * Completely replaces the data at the specified path. Use updateData() to merge instead.
   *
   * @example
   * ```typescript
   * await db.setData('/media', { temperature: 25, humidity: 60 });
   * ```
   */
  async setData(path: string, data: any): Promise<void> {
    const db = this.firebase.database;
    await db?.ref(path).set(data);
  }

  /**
   * Updates data at the specified Firebase path, merging with existing data.
   *
   * @param {string} path - The Firebase database path
   * @param {any} data - The data to update/merge
   * @returns {Promise<void>}
   *
   * @description
   * Merges the provided data with existing data at the path. Only updates the
   * specified fields without affecting other fields.
   *
   * @example
   * ```typescript
   * await db.updateData('/media', { temperature: 26 }); // Only updates temperature
   * ```
   */
  async updateData(path: string, data: any): Promise<void> {
    const db = this.firebase.database;
    await db?.ref(path).update(data);
  }

  /**
   * Deletes data at the specified Firebase path.
   *
   * @param {string} path - The Firebase database path
   * @returns {Promise<void>}
   *
   * @description
   * Removes all data at the specified path. This operation is permanent.
   *
   * @example
   * ```typescript
   * await db.deleteData('/temp-data');
   * ```
   */
  async deleteData(path: string): Promise<void> {
    const db = this.firebase.database;
    await db?.ref(path).remove();
  }

  /**
   * Pushes new data to the specified Firebase path with an auto-generated key.
   *
   * @param {string} path - The Firebase database path
   * @param {any} data - The data to push
   * @returns {Promise<void>}
   *
   * @description
   * Adds new data with a unique, chronologically-ordered key generated by Firebase.
   * Useful for creating lists or collections of items.
   *
   * @example
   * ```typescript
   * await db.pushData('/logs', { message: 'New log entry', timestamp: Date.now() });
   * ```
   */
  async pushData(path: string, data: any): Promise<void> {
    const db = this.firebase.database;
    await db?.ref(path).push(data);
  }
}
