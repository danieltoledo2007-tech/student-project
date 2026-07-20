import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'users' })
export class UserEntity {
  
  
  
    @Prop({ required: true, unique:true })
  username!: string;

  @Prop({ required:true })
  password!: string;


}

export const UserSchema = SchemaFactory.createForClass(UserEntity);