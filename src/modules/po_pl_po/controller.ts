import { Elysia } from "elysia";
import { PlPoPlService } from "./service";
import { buildResponse } from "../../utils/response";

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

export const PlPoPlController = new Elysia({ prefix: "/z_po_pl_po" }).get(
  "/",
  async ({ query }) => {
    const startedAt = Date.now();
    const page = parsePositiveInt(query?.page, 1);
    const perPage = parsePositiveInt(query?.perPage, 10);
    const result = await PlPoPlService.findAll(page, perPage);

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
      ],
    },
  }
);
