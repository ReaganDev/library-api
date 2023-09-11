import { IsNotEmpty,IsString,IsNumber,IsEnum, IsEmpty } from "class-validator"
import { Category } from "../schemas/book.schema"
import { User } from "../../auth/schemas/user.schema"

export class CreateBookDto{
    @IsNotEmpty()
    @IsString()
    readonly title : string

    @IsNotEmpty()
    @IsString()
    readonly description : string

    @IsNotEmpty()
    @IsString()
    readonly author : string

    @IsNotEmpty()
    @IsEnum(Category, {message : 'Please provide a valid category'})
    readonly category : Category

    @IsNotEmpty()
    @IsNumber()
    readonly price : number

    @IsEmpty({message: 'User must be logged in'})
    readonly user : User
}