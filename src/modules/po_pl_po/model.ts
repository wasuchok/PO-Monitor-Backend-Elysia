import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export const Po_Pl_Po = sequelize.define(
  "po_pl_po",
  {
    po_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: "PO_No",
    },
    po_row: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: "POROW",
    },
    po_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "PO_DATE",
    },
    arrival_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "ArrvDate",
    },
    pr_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "PR_Number",
    },
    vendor_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "Vendor_ID",
    },
    vendor_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "Vendor_Name",
    },
    request_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "Request_By",
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "Location",
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "Description",
    },
    reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "Reference",
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "Comment",
    },
    tax_group: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "TaxGroup",
    },
    tax_group_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "TaxG_Name",
    },
    tax_base: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      field: "Taxbase",
    },
    tax: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      field: "Tax",
    },
    total: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      field: "Total",
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Currency",
    },
    rate_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "Ratetype",
    },
    rate_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "RateDate",
    },
    rate: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: true,
      field: "Rate",
    },
    row_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ROWNO",
    },
    item_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ITEMNO",
    },
    item_desc: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "ITEMDESC",
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "Model",
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "Brand",
    },
    qty_order: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: true,
      field: "QTY_Order",
    },
    oq_outstanding: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: true,
      field: "OQOUTSTPO",
    },
    oq_ordered: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: true,
      field: "OQORDERED",
    },
    order_unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "ORDERUNIT",
    },
    discount: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: true,
      field: "Discount",
    },
    unit_cost: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: true,
      field: "UNITCOST",
    },
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      field: "AMOUNT",
    },
    after_discount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      field: "After_Discount",
    },
    non_stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "NonStock",
    },
    lot_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "LOTNO",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "Status",
    },
    term_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "TermCode",
    },
    term_desc: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "TermDesc",
    },
    division: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "Division",
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "Create_Date",
    },
    user_create: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "User_Create",
    },
    edit_date: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "Edit_Date",
    },
    user_edit: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "User_Edit",
    },
    per_discount: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: true,
      field: "PerDiscount",
    },
  },
  {
    tableName: "Z_PO_PL_PO",
    timestamps: false,
  }
);
