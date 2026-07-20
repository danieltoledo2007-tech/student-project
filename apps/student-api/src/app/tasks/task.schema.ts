import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'tasks' })
export class TaskEntity {
  @Prop({required:true})
  userId!:string;
  
  @Prop({ required: true })
  taskname!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({ default: false })
  completed!: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(TaskEntity);
