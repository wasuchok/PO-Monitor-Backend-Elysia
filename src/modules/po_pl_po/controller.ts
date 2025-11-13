import { Elysia } from "elysia";
import { PlPoPlService, type PoPlPoFilters } from "./service";
import { buildResponse } from "../../utils/response";

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const parseString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;

export const PlPoPlController = new Elysia({ prefix: "/z_po_pl_po" })
  .get(
    "/",
    async ({ query }) => {
      const startedAt = Date.now();
      const page = parsePositiveInt(query?.page, 1);
      const perPage = parsePositiveInt(query?.perPage, 10);
      const filters: PoPlPoFilters = {
        division: parseString(query?.division),
        arrivalDate: parseString(query?.arrivalDate ?? query?.arrDate),
        itemDesc: parseString(query?.itemDesc ?? query?.ITEMDESC),
      };
      const result = await PlPoPlService.findAll(page, perPage, filters);

      return buildResponse(result.data, {
        startTime: startedAt,
        pagination: result.pagination,
      });
    },
    {
      detail: {
        tags: ["Z_PO_PL_PO"],
        summary: "List purchase orders with pagination",
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number (1-indexed)",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "perPage",
            in: "query",
            description: "Number of records returned per page",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
          {
            name: "division",
            in: "query",
            description: "Filter by Division exact match",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "arrivalDate",
            in: "query",
            description: "Filter by arrival date (YYYY-MM-DD)",
            required: false,
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            name: "itemDesc",
            in: "query",
            description: "Filter by item description (partial match)",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
      },
    }
  )
  .get(
    "/divisions",
    async () => {
      const startedAt = Date.now();
      const divisions = await PlPoPlService.listDivisions();
      return buildResponse(divisions, { startTime: startedAt });
    },
    {
      detail: {
        tags: ["Z_PO_PL_PO"],
        summary: "Group purchase orders by division",
        responses: {
          200: {
            description: "Division list with aggregated counts",
          },
        },
      },
    }
  );
