import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateSessionTokensTable1730260000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "session_tokens",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "token",
            type: "text",
            isUnique: true,
          },
          {
            name: "userId",
            type: "int",
          },
          {
            name: "expiresAt",
            type: "timestamp",
          },
          {
            name: "ipAddress",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "userAgent",
            type: "text",
            isNullable: true,
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
          },
          {
            name: "lastUsedAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "deviceName",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "deviceType",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Crear índices
    await queryRunner.createIndex(
      "session_tokens",
      new TableIndex({
        name: "IDX_SESSION_TOKENS_TOKEN",
        columnNames: ["token"],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      "session_tokens",
      new TableIndex({
        name: "IDX_SESSION_TOKENS_USER_ID",
        columnNames: ["userId"],
      })
    );

    await queryRunner.createIndex(
      "session_tokens",
      new TableIndex({
        name: "IDX_SESSION_TOKENS_EXPIRES_AT",
        columnNames: ["expiresAt"],
      })
    );

    // Agregar foreign key constraint
    await queryRunner.query(`
      ALTER TABLE session_tokens 
      ADD CONSTRAINT FK_SESSION_TOKENS_USER_ID 
      FOREIGN KEY (userId) REFERENCES users(id) 
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("session_tokens");
  }
}
