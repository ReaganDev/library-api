import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/mongoose"
import mongoose, { Model } from 'mongoose';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { AuthService } from "./auth.service";
import * as bcrypt from 'bcryptjs'
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./DTOS/register.Dto";
import { LoginDto } from "./DTOS/login.dto";


describe('AuthService',() => {

    let authService : AuthService
    let jwtService : JwtService
    let model : Model<User>
    const mockAuthService = {
        findOne: jest.fn(),
        create: jest.fn(),
    }
    let token = 'jwtToken'

    const mockUser = {
        _id : '64f8b0315d807f59d3f9cdda',
        name: 'Reuben',
        email:'Chinonso@gmail.com'
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers : [
                AuthService,
                JwtService,
                {
                    provide : getModelToken(User.name),
                    useValue : mockAuthService
                }
            ]
        }).compile()

        authService = module.get<AuthService>(AuthService)
        jwtService = module.get<JwtService>(JwtService)
        model = module.get<Model<User>>(getModelToken(User.name))
    })

    describe('Register', () =>{
        const data = {
            name: 'Reuben',
            email:'Chinonso@gmail.com',
            password: 'Reagan95'
        }

        it('should register a user',async () => {
            
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword')
            jest.spyOn(model, 'create').mockImplementationOnce(() => 
                Promise.resolve<User | any>(mockUser)
            )
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwtToken')

            const result = await authService.register(data as RegisterDto)

            expect(bcrypt.hash).toHaveBeenCalled()
            expect(result).toEqual({token})
        })

        it('should not register a user',async () => {
            
            jest.spyOn(model, 'create').mockImplementationOnce(() => 
                Promise.reject({code: 11000})
            )
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwtToken')

            await expect(authService.register(data)).rejects.toThrow(ConflictException)
        })

    
    })

    describe('Login', () =>{
        const data = {
            email:'Chinonso@gmail.com',
            password: 'Reagan95'
        }

        it('should login a user',async () => {
            
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser)
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwtToken')

            const result = await authService.login(data as LoginDto)

            expect(bcrypt.compare).toHaveBeenCalled()
            expect(result).toEqual({token})
        })

        it('should throw unauthorized when user is not found',async () => {
            
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(null)

            await expect(authService.login(data as LoginDto)).rejects.toThrow(UnauthorizedException,)
        })

        it('should throw unauthorized when wrong password is passed',async () => {
            
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser)

            expect(bcrypt.compare).toHaveBeenCalled()
            await expect(authService.login(data as LoginDto)).rejects.toThrow(UnauthorizedException,)
        })
    })

})