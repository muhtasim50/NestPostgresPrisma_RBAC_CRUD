import { ForbiddenException, Injectable } from '@nestjs/common'
import { User, Bookmark } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto, AuthinDto } from './dto'
import * as argon from 'argon2'
import { stringify } from 'querystring'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { request } from 'http'

@Injectable()

export class AuthService {
    constructor(private prisma: PrismaService) { }

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
            delete user.password;

            return user;
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

        delete user.password;
        return user;

        // return 'SIGNINHERE'
    }
}