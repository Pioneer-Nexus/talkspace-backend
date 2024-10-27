import { CacheInterceptor } from "@/infrastructures/cache";
import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Cat, CatDto } from "./cat.schema";
import { CatsService } from "./cat.service";

@Resolver()
export class CatResolver {
	constructor(private readonly catService: CatsService) {}

	@Mutation(() => Cat)
	@UseInterceptors(CacheInterceptor)
	async createNewCat(@Args({ name: "cat", type: () => CatDto }) catDto: CatDto) {
		const newCat = await this.catService.create(catDto);
		return newCat;
	}
}
