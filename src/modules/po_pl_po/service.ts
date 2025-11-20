import { Op, Sequelize, type WhereOptions, col, fn } from "sequelize";
import type { PaginatedResult, PaginationMeta } from "../../utils/response";
import { Po_Pl_Po } from "./model";

type PoPlPoInstance = InstanceType<typeof Po_Pl_Po>;

export interface PoPlPoFilters {
    division?: string;
    arrivalDate?: string;
    itemDesc?: string;
}

export interface DivisionSummary {
    division: string | null;
    totalOrders: number;
}

type DivisionSummaryRow = {
    division: string | null;
    totalOrders: string | number | null;
};

export interface CalendarFilters {
    month: number;
    year: number;
    division?: string;
}

export interface CalendarEntry {
    po_no: string;
    po_date: string | null;
    division: string | null;
    status: number | null;
}

type CalendarRow = CalendarEntry;

const formatDateOnly = (date: Date) => date.toISOString().slice(0, 10);

export const PlPoPlService = {
    findAll: async (
        page = 1,
        perPage = 10,
        filters: PoPlPoFilters = {}
    ): Promise<PaginatedResult<PoPlPoInstance>> => {
        const shouldPaginate = perPage > 0;
        const effectivePage = shouldPaginate ? page : 1;
        const offset = shouldPaginate ? (effectivePage - 1) * perPage : undefined;
        const limit = shouldPaginate ? perPage : undefined;
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
            limit,
            offset,
            where,
            order: [
                ["po_date", "DESC"],

            ],
        });

        const pagination: PaginationMeta = {
            total: result.count,
            currentPage: effectivePage,
            perPage,
            totalPages: shouldPaginate ? Math.ceil(result.count / perPage) : 1,
        };

        console.log("wasuchok jainam")

        return {
            data: result.rows,
            pagination,
        };
    },

    listDivisions: async (): Promise<DivisionSummary[]> => {
        const rows = (await Po_Pl_Po.findAll({
            attributes: [
                "division",
                [fn("COUNT", col("po_no")), "totalOrders"],
            ],
            group: ["division"],
            order: [["division", "ASC"]],
            raw: true,
        })) as unknown as DivisionSummaryRow[];

        return rows.map(
            (row): DivisionSummary => ({
                division: row.division ?? null,
                totalOrders: Number(row.totalOrders ?? 0),
            })
        );
    },

    getCalendarEntries: async (
        page = 1,
        perPage = 10,
        filters: CalendarFilters
    ): Promise<PaginatedResult<CalendarEntry>> => {

        const sanitizedMonth = Math.min(Math.max(filters.month, 1), 12);
        const sanitizedYear = filters.year;
        const shouldPaginate = perPage > 0;
        const effectivePage = shouldPaginate ? page : 1;
        const offset = shouldPaginate ? (effectivePage - 1) * perPage : undefined;
        const limit = shouldPaginate ? perPage : undefined;

        const startOfMonth = new Date(Date.UTC(sanitizedYear, sanitizedMonth - 1, 1));
        const endOfMonth = new Date(Date.UTC(sanitizedYear, sanitizedMonth, 0));

        const where: WhereOptions = {
            arrival_date: {
                [Op.between]: [formatDateOnly(startOfMonth), formatDateOnly(endOfMonth)],
            },
        };

        if (filters.division) {
            where.division = filters.division;
        }

        const result = await Po_Pl_Po.findAndCountAll({
            attributes: [
                "po_no",
                [Sequelize.fn("MIN", Sequelize.col("PO_DATE")), "po_date"],
                [Sequelize.fn("MIN", Sequelize.col("Division")), "division"],
                [Sequelize.fn("MIN", Sequelize.col("Status")), "status"],
                [Sequelize.fn("MIN", Sequelize.col("ArrvDate")), "arrival_date"],
            ],

            where,

            group: ["po_no"],

            order: [
                [Sequelize.literal("MIN(PO_DATE)"), "ASC"],
                ["po_no", "ASC"],
            ],

            limit,
            offset,
            raw: true,
            distinct: true,
        });



        const totalGroups = Array.isArray(result.count) ? result.count.length : result.count;

        const pagination: PaginationMeta = {
            total: totalGroups,
            currentPage: effectivePage,
            perPage,
            totalPages: shouldPaginate ? Math.ceil(totalGroups / perPage) : 1,
        };

        return {
            data: result.rows as unknown as CalendarRow[],
            pagination,
        };
    },


    findOneByPoNo: async (poNo: string) => {
        return Po_Pl_Po.findAll({
            where: {
                po_no: poNo,
            },
        });
    },
};
