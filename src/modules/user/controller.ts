import { Elysia } from "elysia";
import { buildResponse } from "../../utils/response";
import { UserService } from "./service";

const parseBodyString = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;

interface LoginRequestBody {
    userId?: string;
    password?: string;
}

export const AuthController = new Elysia({ prefix: "/auth" }).post(
    "/login",
    async ({ body, set }) => {
        const startedAt = Date.now();
        const payload = (body ?? {}) as LoginRequestBody;
        const userId = parseBodyString(payload.userId);
        const password = parseBodyString(payload.password);

        if (!userId || !password) {
            set.status = 400;
            return buildResponse(null, {
                message: "userId and password are required",
                startTime: startedAt,
            });
        }

        const loginResult = await UserService.login({ userId, password });

        if (!loginResult) {
            set.status = 401;
            return buildResponse(null, {
                message: "Invalid credentials",
                startTime: startedAt,
            });
        }

        return buildResponse(loginResult, { startTime: startedAt });
    },
    {
        detail: {
            tags: ["Auth"],
            summary: "Authenticate by USERID and PASSWORD",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userId", "password"],
                            properties: {
                                userId: {
                                    type: "string",
                                    description: "USERID from Z_PO_PL_USER",
                                },
                                password: {
                                    type: "string",
                                    description: "PASSWORD from Z_PO_PL_USER",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Authenticated user with derived role",
                },
                400: {
                    description: "Missing credentials",
                },
                401: {
                    description: "Invalid credentials",
                },
            },
        },
    }
);
