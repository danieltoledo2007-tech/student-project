import{IsBoolean, IsNumber, IsString} from 'class-validator';

export class CreateTaskDto{
    @IsNumber()
    id!:number;

    @IsString()
    taskname!:string;

    @IsString()
    description!:string;

    @IsBoolean()
    completed!:boolean;

}