import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeletedAtToStoreThemes1730620000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna ya existe
    const table = await queryRunner.getTable('store_themes');
    const hasDeletedAt = table?.findColumnByName('deletedAt');

    if (!hasDeletedAt) {
      await queryRunner.addColumn(
        'store_themes',
        new TableColumn({
          name: 'deletedAt',
          type: 'datetime',
          isNullable: true,
          default: null,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la columna si existe
    const table = await queryRunner.getTable('store_themes');
    const hasDeletedAt = table?.findColumnByName('deletedAt');

    if (hasDeletedAt) {
      await queryRunner.dropColumn('store_themes', 'deletedAt');
    }
  }
}

