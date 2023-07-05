import { Body, Controller, HttpCode, HttpStatus, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthinDto } from './dto';
import { CustomBody } from 'src/decorators/CustomBody.decorator';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
// import { Request} from 'express'
import { JwtrtGuard } from './guard/jwtrt.guard';


@Controller('auth')

export class AuthController{
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@CustomBody() dto: AuthinDto) {
        return this.authService.signin(dto)
    }

    // @Post('signout')
    // signout(){}

    @UseGuards(JwtrtGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    refreshTokens(@Request() req){
        const users = req.user;
        return this.authService.refreshTokens(users['sub'], users['refreshToken'])
    }
}