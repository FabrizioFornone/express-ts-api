import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class Token extends Model {
  public token_id!: number;
  public token!: string;
  public access_level!: "read" | "read_write";
  public used!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Token.init(
  {
    token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: new DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    access_level: {
      type: DataTypes.ENUM("read", "read_write"),
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "authorization_tokens",
    sequelize,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Token;
