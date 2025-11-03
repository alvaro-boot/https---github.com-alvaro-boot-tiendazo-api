import { MigrationInterface, QueryRunner } from "typeorm";

export class FixClientsStoreIdForeignKeys1730340000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero, verificar si hay clientes con storeId inválidos
    const orphanClients = await queryRunner.query(`
      SELECT c.id, c.storeId
      FROM clients c
      LEFT JOIN stores s ON c.storeId = s.id
      WHERE c.storeId IS NOT NULL AND s.id IS NULL
    `);

    if (orphanClients.length > 0) {
      // Buscar la primera tienda válida existente
      const firstStore = await queryRunner.query(`
        SELECT id FROM stores ORDER BY id ASC LIMIT 1
      `);

      if (firstStore.length > 0) {
        const defaultStoreId = firstStore[0].id;

        // Asignar los clientes huérfanos a la primera tienda válida
        await queryRunner.query(
          `
          UPDATE clients c
          LEFT JOIN stores s ON c.storeId = s.id
          SET c.storeId = ?
          WHERE c.storeId IS NOT NULL AND s.id IS NULL
        `,
          [defaultStoreId]
        );

        console.log(
          `✅ ${orphanClients.length} clientes huérfanos asignados a la tienda ${defaultStoreId}`
        );
      } else {
        // Si no hay tiendas, crear una tienda por defecto
        const defaultStoreResult = await queryRunner.query(`
          INSERT INTO stores (name, description, address, isActive, balance, currency, createdAt, updatedAt)
          VALUES ('Tienda Por Defecto', 'Tienda creada automáticamente para clientes sin asignar', 'N/A', true, 0, 'COP', NOW(), NOW())
        `);

        const defaultStoreId =
          defaultStoreResult.insertId || defaultStoreResult[0]?.insertId;

        if (defaultStoreId) {
          await queryRunner.query(
            `
            UPDATE clients c
            LEFT JOIN stores s ON c.storeId = s.id
            SET c.storeId = ?
            WHERE c.storeId IS NOT NULL AND s.id IS NULL
          `,
            [defaultStoreId]
          );

          console.log(
            `✅ Tienda por defecto creada (ID: ${defaultStoreId}) y ${orphanClients.length} clientes asignados a ella`
          );
        }
      }
    }

    // Ahora agregar la foreign key constraint
    // Verificar si la constraint ya existe antes de crearla
    const existingConstraints = await queryRunner.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'clients' 
      AND CONSTRAINT_NAME = 'FK_8cbf4f8a5d500f99c15bd327a9e'
    `);

    if (existingConstraints.length === 0) {
      await queryRunner.query(`
        ALTER TABLE \`clients\`
        ADD CONSTRAINT \`FK_8cbf4f8a5d500f99c15bd327a9e\`
        FOREIGN KEY (\`storeId\`) REFERENCES \`stores\`(\`id\`)
        ON DELETE SET NULL ON UPDATE NO ACTION
      `);
      console.log("✅ Foreign key constraint creada exitosamente");
    } else {
      console.log("ℹ️ La foreign key constraint ya existe, omitiendo creación");
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la constraint existe antes de eliminarla
    const existingConstraints = await queryRunner.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'clients' 
      AND CONSTRAINT_NAME = 'FK_8cbf4f8a5d500f99c15bd327a9e'
    `);

    if (existingConstraints.length > 0) {
      await queryRunner.query(`
        ALTER TABLE \`clients\`
        DROP FOREIGN KEY \`FK_8cbf4f8a5d500f99c15bd327a9e\`
      `);
      console.log("✅ Foreign key constraint eliminada");
    }
  }
}
