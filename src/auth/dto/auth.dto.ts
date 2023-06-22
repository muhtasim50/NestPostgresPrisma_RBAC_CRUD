import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto{
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    guardName: string;

    @IsNotEmpty()
    deptName: string;


    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}