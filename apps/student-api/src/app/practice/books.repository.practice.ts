// ===== קובץ תרגול — לא מחובר לאפליקציה =====
// המשימה: לממש את BooksRepository לפי הדוגמה ב-users/users.repository.ts
// בלי להציץ בזמן הכתיבה! קודם נסה, ואז השווה.

import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// הסכמה נתונה לך מוכנה:
@Schema({ collection: 'books' })
export class BookEntity {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  author!: string;

  @Prop({ default: false })
  isBorrowed!: boolean;
}

export const BookSchema = SchemaFactory.createForClass(BookEntity);

// ===== התרגול שלך מתחיל כאן =====
@Injectable()
export class BooksRepository {
  // TODO 1: כתוב constructor שמזריק את המודל של BookEntity

  // TODO 2: create — מקבל title ו-author, יוצר ספר חדש ומחזיר אותו
  async create(title: string, author: string): Promise<BookEntity> {
    throw new Error('TODO: לממש');
  }

  // TODO 3: findByAuthor — מחזיר את *כל* הספרים של סופר מסוים
  // רמז: כאן צריך find ולא findOne. מה ההבדל בטיפוס ההחזרה?
  async findByAuthor(author: string): Promise<BookEntity[]> {
    throw new Error('TODO: לממש');
  }

  // TODO 4: markAsBorrowed — מקבל id של ספר ומסמן אותו כמושאל
  // רמז: תסתכל איך toggleCompleted עובד ב-tasks.mongo.service.ts
  async markAsBorrowed(id: string): Promise<{ success: boolean }> {
    throw new Error('TODO: לממש');
  }
}
