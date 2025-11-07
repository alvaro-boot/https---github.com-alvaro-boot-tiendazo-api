import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class AddElectronicInvoices1730610000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "electronic_invoices",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "invoiceNumber",
            type: "varchar",
            length: "50",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "storeId",
            type: "int",
            isNullable: false,
          },
          {
            name: "saleId",
            type: "int",
            isNullable: true,
          },
          {
            name: "orderId",
            type: "int",
            isNullable: true,
          },
          {
            name: "userId",
            type: "int",
            isNullable: true,
          },
          {
            name: "customerName",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "customerIdType",
            type: "varchar",
            length: "10",
            isNullable: false,
          },
          {
            name: "customerIdNumber",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "customerEmail",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "customerAddress",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "customerPhone",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "subtotal",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "tax",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: "total",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "invoiceDate",
            type: "date",
            isNullable: false,
          },
          {
            name: "dueDate",
            type: "date",
            isNullable: false,
          },
          {
            name: "provider",
            type: "enum",
            enum: ["ALEGRA", "SIIGO", "FACTURATECH", "GOSOCKET", "DIAN_API"],
            isNullable: true,
          },
          {
            name: "status",
            type: "enum",
            enum: ["PENDING", "GENERATED", "SENT", "ACCEPTED", "REJECTED", "CANCELLED"],
            default: "'PENDING'",
          },
          {
            name: "cufe",
            type: "varchar",
            length: "255",
            isNullable: true,
            isUnique: true,
          },
          {
            name: "qrCode",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "xmlContent",
            type: "text",
            isNullable: true,
          },
          {
            name: "xmlUrl",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "pdfUrl",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "providerResponse",
            type: "text",
            isNullable: true,
          },
          {
            name: "providerInvoiceId",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "rejectionReason",
            type: "text",
            isNullable: true,
          },
          {
            name: "sentAt",
            type: "datetime",
            isNullable: true,
          },
          {
            name: "acceptedAt",
            type: "datetime",
            isNullable: true,
          },
          {
            name: "rejectedAt",
            type: "datetime",
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

    // Crear índices
    await queryRunner.createIndex(
      "electronic_invoices",
      new TableIndex({
        name: "IDX_electronic_invoices_storeId_status",
        columnNames: ["storeId", "status"],
      }),
    );

    await queryRunner.createIndex(
      "electronic_invoices",
      new TableIndex({
        name: "IDX_electronic_invoices_invoiceNumber",
        columnNames: ["invoiceNumber"],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      "electronic_invoices",
      new TableIndex({
        name: "IDX_electronic_invoices_cufe",
        columnNames: ["cufe"],
      }),
    );

    // Crear foreign keys
    await queryRunner.createForeignKey(
      "electronic_invoices",
      new TableForeignKey({
        columnNames: ["storeId"],
        referencedColumnNames: ["id"],
        referencedTableName: "stores",
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "electronic_invoices",
      new TableForeignKey({
        columnNames: ["saleId"],
        referencedColumnNames: ["id"],
        referencedTableName: "sales",
        onDelete: "SET NULL",
      }),
    );

    await queryRunner.createForeignKey(
      "electronic_invoices",
      new TableForeignKey({
        columnNames: ["orderId"],
        referencedColumnNames: ["id"],
        referencedTableName: "orders",
        onDelete: "SET NULL",
      }),
    );

    await queryRunner.createForeignKey(
      "electronic_invoices",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("electronic_invoices");
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey("electronic_invoices", foreignKey);
      }
    }

    await queryRunner.dropTable("electronic_invoices");
  }
}

