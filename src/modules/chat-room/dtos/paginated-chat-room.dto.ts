import { PaginatedDto } from "@/core/repository";
import { Field, ObjectType } from "@nestjs/graphql";
import { ChatRoomDto } from "./chat-room.dto";

@ObjectType()
export class PaginatedChatRoomDto extends PaginatedDto<ChatRoomDto> {
	@Field(() => [ChatRoomDto])
	data: ChatRoomDto[];
}
