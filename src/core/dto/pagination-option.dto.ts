import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PaginationOptionDto {
	@Field(() => Number, { defaultValue: 0 })
	page: number;

	@Field(() => Number, { defaultValue: 10 })
	pageSize: number;
}
