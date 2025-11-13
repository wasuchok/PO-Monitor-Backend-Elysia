import { Op, type WhereOptions } from "sequelize";
import { Po_Pl_Po } from "./model";
import type { PaginatedResult, PaginationMeta } from "../../utils/response";

type PoPlPoInstance = InstanceType<typeof Po_Pl_Po>;
export interface PoPlPoFilters {
  division?: string;
  arrivalDate?: string;
  itemDesc?: string;
}

export const PlPoPlService = {
  findAll: async (
    page = 1,
    perPage = 10,
    filters: PoPlPoFilters = {}
  ): Promise<PaginatedResult<PoPlPoInstance>> => {
    const offset = (page - 1) * perPage;
    const where: WhereOptions = {};

    if (filters.division) {
      where.division = filters.division;
    }

    if (filters.arrivalDate) {
      where.arrival_date = filters.arrivalDate;
    }

    if (filters.itemDesc) {
      where.item_desc = {
        [Op.like]: `%${filters.itemDesc}%`,
      };
    }

    const result = await Po_Pl_Po.findAndCountAll({
      limit: perPage,
      offset,
      where,
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
