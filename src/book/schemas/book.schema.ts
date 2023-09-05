import { Schema,Prop,SchemaFactory } from "@nestjs/mongoose";

export enum Category{
    ADVENTURE = 'Adventure',
    CLASSIC = 'Classic',
    FANTASY = 'Fantasy',
    CRIME = 'Crime'
}

@Schema({
    timestamps: true // use timestamps(createdAt, updatedAt)
})
export class Book{

    @Prop()
    title : string

    @Prop()
    description : string

    @Prop()
    author : string

    @Prop()
    price : number

    @Prop()
    category : Category // enum type
} 


// creates the book schema
export const BookSchema = SchemaFactory.createForClass(Book)