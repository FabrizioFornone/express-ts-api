import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class Investment extends Model {
  public investment_id!: number;
  public creation_date!: Date;
  public confirmation_date!: Date | null;
  public value!: number;
  public annual_rate!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

Investment.init(
  {
    investment_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    confirmation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    annual_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updated_at: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    tableName: "investments",
    sequelize,
    timestamps: false,
  }
);

export default Investment;
