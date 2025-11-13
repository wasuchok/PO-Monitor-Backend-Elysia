import { Po_Pl_Po } from "./model";
import type { PaginatedResult, PaginationMeta } from "../../utils/response";

type PoPlPoInstance = InstanceType<typeof Po_Pl_Po>;

export const PlPoPlService = {
  findAll: async (
    page = 1,
    perPage = 10
  ): Promise<PaginatedResult<PoPlPoInstance>> => {
    const offset = (page - 1) * perPage;
    const result = await Po_Pl_Po.findAndCountAll({
      limit: perPage,
      offset,
    });

    const pagination: PaginationMeta = {
      total: result.count,
      currentPage: page,
      perPage,
      totalPages: perPage ? Math.ceil(result.count / perPage) : 0,
    };

    return {
      data: result.rows,
      pagination,
    };
  },
};
