import { ForbiddenException, Injectable } from '@nestjs/common'
import { User, Bookmark } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { stringify } from 'querystring'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

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
    signin() {
        return 'SIGNINHERE'
    }
}