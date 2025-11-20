import { PoUser } from "./model";

export type UserRole = "ADMIN" | "EMPLOYEE";

export interface LoginPayload {
    userId: string;
    password: string;
}

export interface LoginResult {
    userId: string;
    dept: string | null;
    role: UserRole;
    division: any
}

type UserLoginAttributes = {
    userId: string;
    password: string | null;
    dept: string | null;
    division: string | null
};

const mapDeptToRole = (dept: string | null | undefined): UserRole => {
    const normalized = (dept ?? "").trim().toUpperCase();
    return normalized === "PUD" || normalized === "ADMIN" ? "ADMIN" : "EMPLOYEE";
};

export const UserService = {
    login: async ({ userId, password }: LoginPayload): Promise<LoginResult | null> => {
        const userRecord = (await PoUser.findOne({
            attributes: ["userId", "password", "dept", "division"],
            where: { userId },
            raw: true,
        })) as UserLoginAttributes | null;

        if (!userRecord || !userRecord.password || userRecord.password !== password) {
            return null;
        }

        return {
            userId: userRecord.userId,
            dept: userRecord.dept,
            division: userRecord.division,
            role: mapDeptToRole(userRecord.dept),
        };
    },
};
