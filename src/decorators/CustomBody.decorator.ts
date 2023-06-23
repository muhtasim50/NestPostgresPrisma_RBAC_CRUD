import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import {Request} from "express"

export const CustomBody = createParamDecorator( (data: any, executionContext: ExecutionContext) =>{
    const context = executionContext.switchToHttp();
    const request = context.getRequest<Request>();

    return request.body ? request.body : request.body;
});