import { PaginationOption } from "./types";

export const DEFAULT_PAGINATION_SIZE = { page: 0, pageSize: 10 };

export function generatePaginationAggregation(paginationOption: PaginationOption = DEFAULT_PAGINATION_SIZE) {
	return [{ $skip: paginationOption.page * paginationOption.pageSize }, { $limit: paginationOption.pageSize }];
}
