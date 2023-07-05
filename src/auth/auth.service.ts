import { ForbiddenException, Injectable } from '@nestjs/common'
import { User, Bookmark } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto, AuthinDto } from './dto'
import * as argon from 'argon2'
import { stringify } from 'querystring'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { request } from 'http'
import { JwtService } from '@nestjs/jwt/dist'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { Tokens } from './types'

@Injectable()

export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }
 
    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password)

        try {
            const data = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                }
            });
            if(data) return ({ msg: "email already do exist" })

            const user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    guardName: dto.guardName,
                    deptName: dto.deptName,
                    role: 0,
                    email: dto.email,
                    password: hash
                }
            });
            // delete user.password;

            // return user;
            return this.signToken(user.id, user.email);
        }catch(error) {
            return ({ msg: "email exists" })

        }
    }
    async signin(dto: AuthinDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })
        if(!user) return ({ msg: "the user does not exist" })

        const passwordmatch = await argon.verify(user.password, dto.password)
        if(!passwordmatch) return ({ msg: "Incorrect password..." })

        // delete user.password;
        return this.signToken(user.id, user.email);
    }

    signout(){}


    async refreshTokens(userId: number, rt: string){
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        })
        if(!user) return ({ msg: "Access Denied" })

        const tokens = await this.signToken(user.id, user.email)

        const rtMatches = await argon.verify(rt, tokens.refresh_token)
        if(!rtMatches) return ({msg: "Access denied two"})

        return tokens
    }


    async signToken(
        userId: number,
        email: string,
    ): Promise<Tokens> {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_SECRET')
        const secret2 = this.config.get('JWT_SECRETRT')

        const accesstoken = await this.jwt.signAsync(payload, {
            expiresIn: '30m',
            secret: secret,
        },);

        const refreshtoken = await this.jwt.signAsync(payload, {
            expiresIn: '7d',
            secret: secret,
        },);

        return {
            access_token: accesstoken,
            refresh_token: refreshtoken,
        };
    }
}