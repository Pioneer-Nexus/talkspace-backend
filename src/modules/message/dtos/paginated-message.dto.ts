import { GeneratePaginatedDto } from "@/core/repository";
import { ObjectType } from "@nestjs/graphql";
import { MessageDto } from "./message.dto";

@ObjectType()
export class PaginatedMessageDto extends GeneratePaginatedDto(MessageDto) {}
