import { PaginatedDto } from "@/core/repository";
import { Field, ObjectType } from "@nestjs/graphql";
import { UserRoomDto } from "./user-room.dto";

@ObjectType()
export class PaginatedUserRoomDto extends PaginatedDto<UserRoomDto> {
	@Field(() => [UserRoomDto])
	data: UserRoomDto[];
}
