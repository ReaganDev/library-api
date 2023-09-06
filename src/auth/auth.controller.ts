import { Body, Controller, Post,HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTOS/register.Dto';
import { LoginDto } from './DTOS/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async register(@Body() registerDto: RegisterDto): Promise<{token : string}>{
        return await this.authService.register(registerDto)
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto): Promise<{token : string}>{
        return await this.authService.login(loginDto)
    }
}
