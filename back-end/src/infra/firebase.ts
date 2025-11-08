import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

export abstract class IRealTimeDatabase {
  abstract getData(path: string): Promise<any>;
  abstract getDataBiggerThan(path: string, limit: number);

  abstract setData(path: string, data: any): Promise<void>;

  abstract updateData(path: string, data: any): Promise<void>;

  abstract deleteData(path: string): Promise<void>;

  abstract pushData(path: string, data: any): Promise<void>;
  abstract getLast(path: string): Promise<any>;
}

@Injectable()
export class FirebaseRealTimeDatabase implements IRealTimeDatabase {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async getData(path: string) {
    const db = this.firebase.database;
    const snapshot = await db?.ref(path).once('value');
    return snapshot?.val();
  }

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

  async setData(path: string, data: any): Promise<void> {
    const db = this.firebase.database;
    await db?.ref(path).set(data);
  }

  async updateData(path: string, data: any): Promise<void> {
    const db = this.firebase.database;
    await db?.ref(path).update(data);
  }

  async deleteData(path: string): Promise<void> {
    const db = this.firebase.database;
    await db?.ref(path).remove();
  }

  async pushData(path: string, data: any): Promise<void> {
    const db = this.firebase.database;
    await db?.ref(path).push(data);
  }
}
