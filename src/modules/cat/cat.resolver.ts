import { Resolver } from "@nestjs/graphql";
import { CatsService } from "./cat.service";

@Resolver()
export class CatResolver {
	constructor(private readonly catService: CatsService) {}

	// @Mutation(() => Cat)
	// @UseInterceptors(CacheInterceptor)
	// async createNewCat(@Args({ name: "cat", type: () => CatDto }) catDto: CatDto) {
	// 	const newCat = await this.catService.create(catDto);
	// 	return newCat;
	// }
}
