import { InputType, PickType } from "@nestjs/graphql";
import { Webhook } from "../schemas/webhook.schema";

@InputType()
export class WebhookInputDTO extends PickType(Webhook, ["id", "name"], InputType) {}
