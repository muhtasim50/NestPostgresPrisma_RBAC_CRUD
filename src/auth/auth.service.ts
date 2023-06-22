import { Injectable } from '@nestjs/common'
import { User, Bookmark } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { stringify } from 'querystring'

@Injectable()

export class AuthService{
    constructor(private prisma: PrismaService) {}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password)

        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                guardName: dto.guardName,
                deptName: dto.deptName,
                role: 0,
                email: dto.email,
                password: hash
            },
            select: {
                id: true,
                name: true,
                deptName: true,
                email: true,
                role: true
            }
        });

        return user;
        // return 'SIGNUPHERE'
    }
    signin() {
        return 'SIGNINHERE'
    }
}