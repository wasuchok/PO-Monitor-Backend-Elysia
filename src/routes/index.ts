import { Elysia } from "elysia";
import {
  PlPoPlController,
  PoCalendarController,
} from "../modules/po_pl_po/controller";

export const routes = new Elysia({ prefix: "/api/v1" })
  .use(PlPoPlController)
  .use(PoCalendarController);
