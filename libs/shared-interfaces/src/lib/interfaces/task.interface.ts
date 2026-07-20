export interface Task {
  // היה: id: number — הוחלף ב-_id שמונגו מייצר בשרת.
  // אופציונלי (?) כי משימה חדשה, לפני השמירה, עוד לא קיבלה _id.
 userId:string;
  _id?: string;
  taskname: string;
  description: string;
  completed: boolean;
}
