import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CatsService } from "./cat.service";
import { Cat, CatDto } from "./cat.schema";

@Resolver()
export class CatResolver {
	constructor(private readonly catService: CatsService) {}

	@Mutation(() => Cat)
	async createNewCat(@Args({ name: "cat", type: () => CatDto }) catDto: CatDto) {
		const newCat = await this.catService.create(catDto);
		return newCat;
	}
}
