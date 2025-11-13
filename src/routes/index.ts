import { Elysia } from "elysia";
import { PlPoPlController } from "../modules/po_pl_po/controller";

export const routes = new Elysia({ prefix: "/api/v1" }).use(PlPoPlController);
