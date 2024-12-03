import { Module } from "@nestjs/common";
import { BaseGateway } from "./base.gateway";
import { AppLoggerModule } from "../logger";
import { AuthModule } from "@/modules/auth";
import { AuthService } from "@/modules/auth/auth.service";
import { SocketService } from "./socket.service";

@Module({
	imports: [AppLoggerModule,AuthModule],
    providers:[BaseGateway,SocketService],
    exports  :[]
})
export class SocketModule {}
