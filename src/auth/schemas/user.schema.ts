import { Schema,Prop,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true // use timestamps(createdAt, updatedAt)
})
export class User extends Document{
    @Prop()
    name : string

    @Prop({unique : [true, 'Email already exists']})
    email : string

    @Prop()
    password : string
   
} 

// creates the user schema
export const UserSchema = SchemaFactory.createForClass(User)