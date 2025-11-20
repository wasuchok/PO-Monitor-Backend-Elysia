import { Elysia } from "elysia";
import { buildResponse } from "../../utils/response";
import { PlPoPlService, type PoPlPoFilters } from "./service";

const parsePositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const parsePerPage = (value: unknown, fallback: number) => {
  if (value === undefined || value === null) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const floored = Math.floor(parsed);
  if (floored === 0) return 0;
  return floored > 0 ? floored : fallback;
};

const parseString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;

const parseMonth = (value: unknown, fallback: number) => {
  const parsed = parsePositiveInt(value, fallback);
  return parsed >= 1 && parsed <= 12 ? parsed : fallback;
};

const parseYear = (value: unknown, fallback: number) => {
  const parsed = parsePositiveInt(value, fallback);
  return parsed >= 1900 ? parsed : fallback;
};

export const PlPoPlController = new Elysia({ prefix: "/z_po_pl_po" })
  .get(
    "/",
    async ({ query }) => {
      const startedAt = Date.now();
      const page = parsePositiveInt(query?.page, 1);
      const perPage = parsePerPage(query?.perPage, 10);
      const filters: PoPlPoFilters = {
        division: parseString(query?.division),
        arrivalDateFrom: parseString(
          query?.arrivalDateFrom ?? query?.arrDateFrom
        ),
        arrivalDateTo: parseString(query?.arrivalDateTo ?? query?.arrDateTo),
        itemDesc: parseString(query?.itemDesc ?? query?.ITEMDESC),
      };
      const arrivalDate = parseString(query?.arrivalDate ?? query?.arrDate);
      if (arrivalDate) {
        filters.arrivalDateFrom ??= arrivalDate;
        filters.arrivalDateTo ??= arrivalDate;
      }
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
            description: "Number of records returned per page (set 0 to fetch all)",
            required: false,
            schema: {
              type: "integer",
              minimum: 0,
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
            name: "arrivalDateFrom",
            in: "query",
            description: "Filter arrival date from (YYYY-MM-DD, inclusive)",
            required: false,
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            name: "arrivalDateTo",
            in: "query",
            description: "Filter arrival date to (YYYY-MM-DD, inclusive)",
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
    "/today",
    async ({ query }) => {
      const startedAt = Date.now();
      const division = parseString(query?.division);
      const orders = await PlPoPlService.findTodayOrders(division);

      return buildResponse(orders, { startTime: startedAt });
    },
    {
      detail: {
        tags: ["Z_PO_PL_PO"],
        summary: "List today's purchase orders",
        parameters: [
          {
            name: "division",
            in: "query",
            description: "Filter by Division exact match; omit to get all divisions",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "All POs for today",
          },
        },
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
  )
  .get(
    "/detail/:poNo",
    async ({ params, set }) => {
      const startedAt = Date.now();
      const poNo = parseString(params?.poNo);

      if (!poNo) {
        set.status = 400;
        return buildResponse(null, {
          startTime: startedAt,
          message: "PO_No is required",
        });
      }

      const purchaseOrder = await PlPoPlService.findOneByPoNo(poNo);

      if (!purchaseOrder) {
        set.status = 404;
        return buildResponse(null, {
          startTime: startedAt,
          message: "Purchase order not found",
        });
      }

      return buildResponse(purchaseOrder, { startTime: startedAt });
    },
    {
      detail: {
        tags: ["Z_PO_PL_PO"],
        summary: "Get purchase order detail by PO_No",
        parameters: [
          {
            name: "poNo",
            in: "path",
            description: "PO number (PO_No) to lookup",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Purchase order detail",
          },
          400: {
            description: "Missing PO_No",
          },
          404: {
            description: "Purchase order not found",
          },
        },
      },
    }
  );

export const PoCalendarController = new Elysia({ prefix: "/po" }).get(
  "/calendar",
  async ({ query }) => {
    const startedAt = Date.now();
    const now = new Date();
    const month = parseMonth(query?.month, now.getMonth() + 1);
    const year = parseYear(query?.year, now.getFullYear());
    const page = parsePositiveInt(query?.page, 1);
    const perPage = parsePerPage(query?.perPage, 10);

    const result = await PlPoPlService.getCalendarEntries(page, perPage, {
      month,
      year,
      division: parseString(query?.division),
    });

    return buildResponse(result.data, {
      startTime: startedAt,
      pagination: result.pagination,
    });
  },
  {
    detail: {
      tags: ["Z_PO_PL_PO"],
      summary: "PO calendar filtered by month and year",
      parameters: [
        {
          name: "month",
          in: "query",
          description: "เดือนที่ต้องการ (1-12)",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 12,
          },
        },
        {
          name: "year",
          in: "query",
          description: "ปี (เช่น 2024)",
          required: false,
          schema: {
            type: "integer",
            minimum: 1900,
          },
        },
        {
          name: "division",
          in: "query",
          description: "รหัส Division (ถ้าไม่ส่งจะแสดงทุก Division)",
          required: false,
          schema: {
            type: "string",
          },
        },
        {
          name: "page",
          in: "query",
          description: "หมายเลขหน้า (เริ่ม 1)",
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
          description: "จำนวนรายการต่อหน้า (ใส่ 0 เพื่อแสดงทั้งหมด)",
          required: false,
          schema: {
            type: "integer",
            minimum: 0,
            maximum: 100,
            default: 10,
          },
        },
      ],
    },
  }
);
