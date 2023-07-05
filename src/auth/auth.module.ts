import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { AtStrategy, JwtStrategy, RtStrategy } from "./strategy";

@Module ({
    imports: [PrismaModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, AtStrategy, RtStrategy],
})

export class AuthModule {}