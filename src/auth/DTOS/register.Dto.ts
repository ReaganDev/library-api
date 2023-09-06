import { IsEmail, IsNotEmpty,IsString, MinLength, minLength } from "class-validator"

export class RegisterDto{
    @IsNotEmpty()
    @IsString()
    readonly name : string

    @IsNotEmpty()
    @IsEmail({}, {message: 'Provide a valid email'})
    readonly email : string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password : string
}