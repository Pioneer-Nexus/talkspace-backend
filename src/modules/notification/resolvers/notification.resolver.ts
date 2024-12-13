import { UseGuards } from "@nestjs/common";
import { Resolver } from "@nestjs/graphql";
import { JwtAuthGuard } from "../../auth";
import { NotificationDto } from "../dtos/notification.dto";
import { NotificationService } from "../services/notification.service";

@Resolver(() => NotificationDto)
@UseGuards(JwtAuthGuard)
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}
}
