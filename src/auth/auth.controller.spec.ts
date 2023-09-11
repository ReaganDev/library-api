import { Test, TestingModule } from "@nestjs/testing"
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import exp from "constants";


describe('BookController',() => {

    let authService : AuthService
    let authController : AuthController

    const mockUser = {
        _id : '64f8b0315d807f59d3f9cdda',
        name: 'Reuben',
        email:'Chinonso@gmail.com'
    }
    const mockAuthService = {
        login : jest.fn().mockResolvedValueOnce('jwtToken'),
        register : jest.fn().mockResolvedValueOnce('jwtToken')
    }


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({defaultStrategy : 'jwt'})],
            controllers: [AuthController],
            providers : [
                {
                    provide : AuthService,
                    useValue : mockAuthService
                }
            ]
        }).compile()

        authService = module.get<AuthService>(AuthService)
        authController = module.get<AuthController>(AuthController)
    })

    it('should be defined', () => {
        expect(authController).toBeDefined()
    })

    describe('Sign up', () => {
        it('should register a user', async() => {
            const data = {
                name: 'Reuben',
                email:'Chinonso@gmail.com',
                password: 'Reagan95'
            }

            const result = await authController.register(data)
            expect(authService.register).toHaveBeenCalled()
            expect(result).toEqual('jwtToken')
        })
    })

    describe('Sign in', () => {
        it('should login a user', async() => {
            const data = {
                email:'Chinonso@gmail.com',
                password: 'Reagan95'
            }

            const result = await authController.login(data)
            expect(authService.login).toHaveBeenCalled()
            expect(result).toEqual('jwtToken')
        })
    })
})