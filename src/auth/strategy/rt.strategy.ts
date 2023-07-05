import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from 'express'

@Injectable()
export class RtStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        config: ConfigService, 
        private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRETRT'),
            // passReqToCallback: true,
        })
    }

    async validate(req: Request, payload:
        {
        sub: number,
        email: string
    }
    ) {
        // // console.log({
        // //     payload,
        // // })
        // const user = await this.prisma.user.findUnique({
        //     where: {
        //         id: payload.sub
        //     }
        // })
        // delete user.password;
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        return {
            ...payload,
            refreshToken,
        }
    }
}