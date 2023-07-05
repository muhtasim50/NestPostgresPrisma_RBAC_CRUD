import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class JwtrtGuard extends AuthGuard('jwt-refresh'){
    constructor(){
        super()
    }
    
}