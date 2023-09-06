import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as  mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './DTOS/register.Dto';
import { LoginDto } from './DTOS/login.dto';
import { use } from 'passport';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private jwtService: JwtService
    ) {}


    async register(registerDto: RegisterDto) : Promise<{token : string}>{
        const {name, email, password} = registerDto

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await this.userModel.create({name, email, password: hashedPassword})
        const token  = await this.jwtService.signAsync({id : user._id, name: user.name})

        return {token}

    }   
    

    async login (loginDto: LoginDto): Promise<{token : string}>
    {    
        const {email,password} = loginDto
        const user = await this.userModel.findOne({email})
        if (!user) {
            throw new UnauthorizedException('Invalid email')
        }
     
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            throw new UnauthorizedException('Invalid password')
        }

        const token  = await this.jwtService.signAsync({id : user._id, name: user.name})

        return {token}
    }
    
   

}
