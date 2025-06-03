
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    const db = mongoose.connection;

    db.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    db.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    db.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  }
}
