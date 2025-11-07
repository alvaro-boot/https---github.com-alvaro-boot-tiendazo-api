import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class AddStoreThemes1730600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "store_themes",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "storeId",
            type: "int",
            isNullable: false,
          },
          {
            name: "template",
            type: "enum",
            enum: ["MODERN", "MINIMALIST", "ELEGANT"],
            default: "'MODERN'",
          },
          {
            name: "primaryColor",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "secondaryColor",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "accentColor",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "backgroundColor",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "textColor",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "fontFamily",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "headingFont",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "bodyFont",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "favicon",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "customBanner",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "showReviews",
            type: "boolean",
            default: true,
          },
          {
            name: "showFeatured",
            type: "boolean",
            default: true,
          },
          {
            name: "showCategories",
            type: "boolean",
            default: true,
          },
          {
            name: "showContact",
            type: "boolean",
            default: true,
          },
          {
            name: "showBlog",
            type: "boolean",
            default: false,
          },
          {
            name: "layoutConfig",
            type: "text",
            isNullable: true,
          },
          {
            name: "customDomain",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "subdomain",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "domainVerified",
            type: "boolean",
            default: false,
          },
          {
            name: "domainConfig",
            type: "text",
            isNullable: true,
          },
          {
            name: "googleAnalyticsId",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "facebookPixelId",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "mailchimpListId",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Crear índice único para storeId (una tienda, un tema)
    await queryRunner.createIndex(
      "store_themes",
      new TableIndex({
        name: "IDX_store_themes_storeId",
        columnNames: ["storeId"],
        isUnique: true,
      }),
    );

    // Crear foreign key
    await queryRunner.createForeignKey(
      "store_themes",
      new TableForeignKey({
        columnNames: ["storeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "stores",
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("store_themes");
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("storeId") !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey("store_themes", foreignKey);
      }
    }

    await queryRunner.dropTable("store_themes");
  }
}

