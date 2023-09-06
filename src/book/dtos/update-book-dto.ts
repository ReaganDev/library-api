import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { Category } from "../schemas/book.schema"
import { User } from "src/auth/schemas/user.schema"

export class UpdateBookDto{

    @IsOptional()
    @IsString()
    readonly title : string

    @IsOptional()
    @IsString()
    readonly description : string

    @IsOptional()
    @IsString()
    readonly author : string

    @IsOptional()
    @IsEnum(Category, {message: 'Please provide a valid category'})
    readonly category : Category

    @IsOptional()
    @IsNumber()
    readonly price : number

    @IsEmpty({message: 'User must be logged in'})
    readonly user : User
}