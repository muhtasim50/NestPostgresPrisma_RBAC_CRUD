import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway(80, {namespace: 'newMessages'})
export class MyGateway{
    @SubscribeMessage('newMessages')
    onNewMessage(@MessageBody() body: string): string{
        return body;
    }
}