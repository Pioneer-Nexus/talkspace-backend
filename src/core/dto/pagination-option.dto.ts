import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationOptionDto {
	@Field(() => Int, { defaultValue: 0 })
	page: number;

	@Field(() => Int, { defaultValue: 10 })
	pageSize: number;
}
