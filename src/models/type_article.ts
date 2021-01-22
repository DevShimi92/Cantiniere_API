import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface TypeArticleInterface {
    code_type: number;
    name: string;
  }
  
  
export class TypeArticle extends Model {
    public code_type!: number;
    public name!: string;
  }

  TypeArticle.init(
    {
      code_type: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "type_article",
      sequelize: sequelize , 
      timestamps: false
    }
  );


