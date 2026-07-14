import { IsBoolean, IsString } from 'class-validator';

export class CreateTaskDto {
  // השדה id הוסר: הזהות היא אחריות של מונגו (_id), הלקוח שולח רק תוכן.
  // היה כאן:
  //   @IsNumber()
  //   id!: number;

  @IsString()
  taskname!: string;

  @IsString()
  description!: string;

  @IsBoolean()
  completed!: boolean;
}
