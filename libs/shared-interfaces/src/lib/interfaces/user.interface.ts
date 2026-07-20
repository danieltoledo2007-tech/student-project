export interface User {
  _id?: string;
  username: string;
  // אופציונלי: נשלח ברגיסטר/לוגין, אבל אחרי לוגין הלקוח לא שומר אותו
  password?: string;
}
