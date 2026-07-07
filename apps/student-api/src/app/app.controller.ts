import { Body, Controller, Get, Post } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const STUDENTS_FILE = path.join(
  process.cwd(),
  'apps',
  'student-api',
  'students.json',
);

@Controller()
export class AppController {
  
  @Get('students')
  getStudents(): Record<string, string>[] {
    return fs.existsSync(STUDENTS_FILE)
      ? JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf8'))
      : [];
  }

  @Post('students')
  register(@Body() student: Record<string, string>): { success: boolean } {
    const students: Record<string, string>[] = fs.existsSync(STUDENTS_FILE)
      ? JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf8'))
      : [];
    students.push(student);
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));
    return { success: true };
  }
}
