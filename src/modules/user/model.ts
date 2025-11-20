import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export const PoUser = sequelize.define(
    "po_pl_user",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            field: "ID",
        },
        userId: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "USERID",
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: "PASSWORD",
        },
        dept: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: "DEPT",
        },
    },
    {
        tableName: "Z_PO_PL_USER",
        timestamps: false,
    }
);
