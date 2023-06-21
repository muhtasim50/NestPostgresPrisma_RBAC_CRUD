import { Injectable } from '@nestjs/common'
import { User, Bookmark } from '@prisma/client'

@Injectable({})

export class AuthService{
    signup() {return 'SIGNUPHERE'}
    signin() {return 'SIGNINHERE'}
}