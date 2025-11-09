import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddGeneratedMarkupToStoreThemes1730630000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("store_themes", [
      new TableColumn({
        name: "generatedHtml",
        type: "longtext",
        isNullable: true,
      }),
      new TableColumn({
        name: "generatedCss",
        type: "longtext",
        isNullable: true,
      }),
      new TableColumn({
        name: "sitePath",
        type: "varchar",
        length: "500",
        isNullable: true,
      }),
      new TableColumn({
        name: "indexPath",
        type: "varchar",
        length: "500",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns("store_themes", ["indexPath", "sitePath", "generatedCss", "generatedHtml"]);
  }
}
