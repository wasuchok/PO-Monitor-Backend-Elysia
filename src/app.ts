import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { routes } from "./routes";

export const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        tags: [
          {
            name: "Z_PO_PL_PO",
            description: "Z_PO_PL_PO",
          },
        ],
      },
    })
  )
  .use(routes);
