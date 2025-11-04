import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex, TableForeignKey } from "typeorm";

export class AddExpansionFields1730500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // Agregar columnas a la tabla stores
    // ============================================
    const storesTable = await queryRunner.getTable("stores");
    
    if (storesTable) {
      // Agregar columnas usando queries SQL directas para mejor compatibilidad con MySQL
      const storesColumnsSQL = [
        { name: "banner", sql: "ALTER TABLE stores ADD COLUMN banner VARCHAR(255) NULL" },
        { name: "type", sql: "ALTER TABLE stores ADD COLUMN type ENUM('INTERNAL', 'PUBLIC') NOT NULL DEFAULT 'INTERNAL'" },
        { name: "slug", sql: "ALTER TABLE stores ADD COLUMN slug VARCHAR(255) NULL UNIQUE" },
        { name: "isPublic", sql: "ALTER TABLE stores ADD COLUMN isPublic BOOLEAN NOT NULL DEFAULT true" },
        { name: "electronicInvoiceEnabled", sql: "ALTER TABLE stores ADD COLUMN electronicInvoiceEnabled BOOLEAN NOT NULL DEFAULT false" },
        { name: "electronicInvoiceProvider", sql: "ALTER TABLE stores ADD COLUMN electronicInvoiceProvider VARCHAR(100) NULL" },
        { name: "electronicInvoiceConfig", sql: "ALTER TABLE stores ADD COLUMN electronicInvoiceConfig TEXT NULL" },
        { name: "paymentGateway", sql: "ALTER TABLE stores ADD COLUMN paymentGateway VARCHAR(100) NULL" },
        { name: "paymentGatewayConfig", sql: "ALTER TABLE stores ADD COLUMN paymentGatewayConfig TEXT NULL" },
        { name: "shippingEnabled", sql: "ALTER TABLE stores ADD COLUMN shippingEnabled BOOLEAN NOT NULL DEFAULT false" },
        { name: "shippingProvider", sql: "ALTER TABLE stores ADD COLUMN shippingProvider VARCHAR(100) NULL" },
        { name: "shippingConfig", sql: "ALTER TABLE stores ADD COLUMN shippingConfig TEXT NULL" },
        { name: "latitude", sql: "ALTER TABLE stores ADD COLUMN latitude DECIMAL(10,8) NULL" },
        { name: "longitude", sql: "ALTER TABLE stores ADD COLUMN longitude DECIMAL(11,8) NULL" },
        { name: "metaTitle", sql: "ALTER TABLE stores ADD COLUMN metaTitle VARCHAR(255) NULL" },
        { name: "metaDescription", sql: "ALTER TABLE stores ADD COLUMN metaDescription TEXT NULL" },
        { name: "metaKeywords", sql: "ALTER TABLE stores ADD COLUMN metaKeywords VARCHAR(255) NULL" },
      ];

      for (const column of storesColumnsSQL) {
        const existingColumn = storesTable.findColumnByName(column.name);
        if (!existingColumn) {
          try {
            await queryRunner.query(column.sql);
          } catch (error: any) {
            // Si la columna ya existe (por ejemplo, si synchronize la creó), ignorar el error
            if (!error.message.includes("Duplicate column name")) {
              console.warn(`Warning adding column ${column.name}:`, error.message);
            }
          }
        }
      }

      // Crear índices para stores
      const storesIndexes = [
        { name: "IDX_stores_slug", columnNames: ["slug"], isUnique: true },
        { name: "IDX_stores_type_isActive", columnNames: ["type", "isActive"] },
      ];

      for (const index of storesIndexes) {
        const existingIndex = storesTable.indices.find(i => i.name === index.name);
        if (!existingIndex) {
          await queryRunner.createIndex("stores", new TableIndex(index));
        }
      }
    }

    // ============================================
    // Agregar columnas a la tabla products
    // ============================================
    const productsTable = await queryRunner.getTable("products");
    
    if (productsTable) {
      // Agregar columnas usando queries SQL directas
      const productsColumnsSQL = [
        { name: "images", sql: "ALTER TABLE products ADD COLUMN images TEXT NULL" },
        { name: "isPublic", sql: "ALTER TABLE products ADD COLUMN isPublic BOOLEAN NOT NULL DEFAULT false" },
        { name: "slug", sql: "ALTER TABLE products ADD COLUMN slug VARCHAR(255) NULL" },
        { name: "views", sql: "ALTER TABLE products ADD COLUMN views INT NOT NULL DEFAULT 0" },
        { name: "salesCount", sql: "ALTER TABLE products ADD COLUMN salesCount INT NOT NULL DEFAULT 0" },
        { name: "metaDescription", sql: "ALTER TABLE products ADD COLUMN metaDescription TEXT NULL" },
        { name: "metaKeywords", sql: "ALTER TABLE products ADD COLUMN metaKeywords VARCHAR(255) NULL" },
        { name: "allowShipping", sql: "ALTER TABLE products ADD COLUMN allowShipping BOOLEAN NOT NULL DEFAULT true" },
        { name: "isDigital", sql: "ALTER TABLE products ADD COLUMN isDigital BOOLEAN NOT NULL DEFAULT false" },
      ];

      for (const column of productsColumnsSQL) {
        const existingColumn = productsTable.findColumnByName(column.name);
        if (!existingColumn) {
          try {
            await queryRunner.query(column.sql);
          } catch (error: any) {
            // Si la columna ya existe, ignorar el error
            if (!error.message.includes("Duplicate column name")) {
              console.warn(`Warning adding column ${column.name}:`, error.message);
            }
          }
        }
      }
    }

    // ============================================
    // Crear tabla password_reset_tokens
    // ============================================
    const passwordResetTokensTable = await queryRunner.getTable("password_reset_tokens");
    if (!passwordResetTokensTable) {
      await queryRunner.createTable(
        new Table({
          name: "password_reset_tokens",
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            {
              name: "userId",
              type: "int",
            },
            {
              name: "token",
              type: "varchar",
              length: "255",
              isUnique: true,
            },
            {
              name: "expiresAt",
              type: "timestamp",
            },
            {
              name: "used",
              type: "boolean",
              default: false,
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
            {
              name: "deletedAt",
              type: "timestamp",
              isNullable: true,
            },
          ],
        }),
        true
      );

      await queryRunner.createIndex(
        "password_reset_tokens",
        new TableIndex({
          name: "IDX_password_reset_tokens_token",
          columnNames: ["token"],
          isUnique: true,
        })
      );

      await queryRunner.createIndex(
        "password_reset_tokens",
        new TableIndex({
          name: "IDX_password_reset_tokens_userId_expiresAt",
          columnNames: ["userId", "expiresAt"],
        })
      );

      await queryRunner.createForeignKey(
        "password_reset_tokens",
        new TableForeignKey({
          columnNames: ["userId"],
          referencedTableName: "users",
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        })
      );
    }

    // ============================================
    // Crear tabla orders
    // ============================================
    const ordersTable = await queryRunner.getTable("orders");
    if (!ordersTable) {
      await queryRunner.createTable(
        new Table({
          name: "orders",
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            {
              name: "orderNumber",
              type: "varchar",
              length: "255",
              isUnique: true,
            },
            {
              name: "storeId",
              type: "int",
            },
            {
              name: "userId",
              type: "int",
              isNullable: true,
            },
            {
              name: "clientId",
              type: "int",
              isNullable: true,
            },
            {
              name: "status",
              type: "enum",
              enum: ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
              default: "'PENDING'",
            },
            {
              name: "paymentStatus",
              type: "enum",
              enum: ["PENDING", "PROCESSING", "APPROVED", "REJECTED", "REFUNDED"],
              default: "'PENDING'",
            },
            {
              name: "paymentMethod",
              type: "enum",
              enum: ["CASH", "CARD", "TRANSFER", "ONLINE", "OTHER"],
              isNullable: true,
            },
            {
              name: "subtotal",
              type: "decimal",
              precision: 10,
              scale: 2,
            },
            {
              name: "tax",
              type: "decimal",
              precision: 10,
              scale: 2,
              default: 0,
            },
            {
              name: "shipping",
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
            },
            {
              name: "currency",
              type: "varchar",
              length: "10",
              isNullable: true,
            },
            {
              name: "shippingAddress",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "shippingCity",
              type: "varchar",
              length: "100",
              isNullable: true,
            },
            {
              name: "shippingState",
              type: "varchar",
              length: "100",
              isNullable: true,
            },
            {
              name: "shippingZipCode",
              type: "varchar",
              length: "20",
              isNullable: true,
            },
            {
              name: "shippingCountry",
              type: "varchar",
              length: "100",
              isNullable: true,
            },
            {
              name: "shippingPhone",
              type: "varchar",
              length: "50",
              isNullable: true,
            },
            {
              name: "shippingName",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "paymentGatewayTransactionId",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "paymentGatewayResponse",
              type: "text",
              isNullable: true,
            },
            {
              name: "paymentGatewaySessionUrl",
              type: "varchar",
              length: "500",
              isNullable: true,
            },
            {
              name: "invoiceNumber",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "invoiceXml",
              type: "varchar",
              length: "500",
              isNullable: true,
            },
            {
              name: "invoicePdf",
              type: "varchar",
              length: "500",
              isNullable: true,
            },
            {
              name: "invoiceCufe",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "trackingNumber",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "trackingUrl",
              type: "varchar",
              length: "500",
              isNullable: true,
            },
            {
              name: "notes",
              type: "text",
              isNullable: true,
            },
            {
              name: "internalNotes",
              type: "text",
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
            {
              name: "deletedAt",
              type: "timestamp",
              isNullable: true,
            },
          ],
        }),
        true
      );

      await queryRunner.createIndex(
        "orders",
        new TableIndex({
          name: "IDX_orders_storeId_status",
          columnNames: ["storeId", "status"],
        })
      );

      await queryRunner.createIndex(
        "orders",
        new TableIndex({
          name: "IDX_orders_clientId",
          columnNames: ["clientId"],
        })
      );

      await queryRunner.createIndex(
        "orders",
        new TableIndex({
          name: "IDX_orders_orderNumber",
          columnNames: ["orderNumber"],
          isUnique: true,
        })
      );

      await queryRunner.createForeignKey(
        "orders",
        new TableForeignKey({
          columnNames: ["storeId"],
          referencedTableName: "stores",
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        })
      );

      await queryRunner.createForeignKey(
        "orders",
        new TableForeignKey({
          columnNames: ["userId"],
          referencedTableName: "users",
          referencedColumnNames: ["id"],
          onDelete: "SET NULL",
        })
      );

      await queryRunner.createForeignKey(
        "orders",
        new TableForeignKey({
          columnNames: ["clientId"],
          referencedTableName: "clients",
          referencedColumnNames: ["id"],
          onDelete: "SET NULL",
        })
      );
    }

    // ============================================
    // Crear tabla order_items
    // ============================================
    const orderItemsTable = await queryRunner.getTable("order_items");
    if (!orderItemsTable) {
      await queryRunner.createTable(
        new Table({
          name: "order_items",
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            {
              name: "orderId",
              type: "int",
            },
            {
              name: "productId",
              type: "int",
            },
            {
              name: "productName",
              type: "varchar",
              length: "255",
            },
            {
              name: "unitPrice",
              type: "decimal",
              precision: 10,
              scale: 2,
            },
            {
              name: "purchasePrice",
              type: "decimal",
              precision: 10,
              scale: 2,
              isNullable: true,
            },
            {
              name: "quantity",
              type: "int",
            },
            {
              name: "subtotal",
              type: "decimal",
              precision: 10,
              scale: 2,
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
            {
              name: "deletedAt",
              type: "timestamp",
              isNullable: true,
            },
          ],
        }),
        true
      );

      await queryRunner.createIndex(
        "order_items",
        new TableIndex({
          name: "IDX_order_items_orderId",
          columnNames: ["orderId"],
        })
      );

      await queryRunner.createIndex(
        "order_items",
        new TableIndex({
          name: "IDX_order_items_productId",
          columnNames: ["productId"],
        })
      );

      await queryRunner.createForeignKey(
        "order_items",
        new TableForeignKey({
          columnNames: ["orderId"],
          referencedTableName: "orders",
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        })
      );

      await queryRunner.createForeignKey(
        "order_items",
        new TableForeignKey({
          columnNames: ["productId"],
          referencedTableName: "products",
          referencedColumnNames: ["id"],
        })
      );
    }

    // ============================================
    // Crear tabla accounting_entries
    // ============================================
    const accountingEntriesTable = await queryRunner.getTable("accounting_entries");
    if (!accountingEntriesTable) {
      await queryRunner.createTable(
        new Table({
          name: "accounting_entries",
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
            },
            {
              name: "type",
              type: "enum",
              enum: ["INCOME", "EXPENSE"],
            },
            {
              name: "category",
              type: "enum",
              enum: [
                "SALES",
                "ONLINE_SALES",
                "OTHER_INCOME",
                "PURCHASES",
                "RENT",
                "SERVICES",
                "SUPPLIERS",
                "SALARIES",
                "TAXES",
                "SHIPPING",
                "OTHER_EXPENSE",
              ],
            },
            {
              name: "date",
              type: "date",
            },
            {
              name: "description",
              type: "varchar",
              length: "255",
            },
            {
              name: "amount",
              type: "decimal",
              precision: 10,
              scale: 2,
            },
            {
              name: "tax",
              type: "decimal",
              precision: 10,
              scale: 2,
              default: 0,
            },
            {
              name: "netAmount",
              type: "decimal",
              precision: 10,
              scale: 2,
              default: 0,
            },
            {
              name: "currency",
              type: "varchar",
              length: "10",
              isNullable: true,
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
              name: "notes",
              type: "text",
              isNullable: true,
            },
            {
              name: "invoiceNumber",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "receiptNumber",
              type: "varchar",
              length: "255",
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
            {
              name: "deletedAt",
              type: "timestamp",
              isNullable: true,
            },
          ],
        }),
        true
      );

      await queryRunner.createIndex(
        "accounting_entries",
        new TableIndex({
          name: "IDX_accounting_entries_storeId_date",
          columnNames: ["storeId", "date"],
        })
      );

      await queryRunner.createIndex(
        "accounting_entries",
        new TableIndex({
          name: "IDX_accounting_entries_type_category",
          columnNames: ["type", "category"],
        })
      );

      await queryRunner.createForeignKey(
        "accounting_entries",
        new TableForeignKey({
          columnNames: ["storeId"],
          referencedTableName: "stores",
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        })
      );

      await queryRunner.createForeignKey(
        "accounting_entries",
        new TableForeignKey({
          columnNames: ["saleId"],
          referencedTableName: "sales",
          referencedColumnNames: ["id"],
          onDelete: "SET NULL",
        })
      );

      await queryRunner.createForeignKey(
        "accounting_entries",
        new TableForeignKey({
          columnNames: ["orderId"],
          referencedTableName: "orders",
          referencedColumnNames: ["id"],
          onDelete: "SET NULL",
        })
      );

      await queryRunner.createForeignKey(
        "accounting_entries",
        new TableForeignKey({
          columnNames: ["userId"],
          referencedTableName: "users",
          referencedColumnNames: ["id"],
          onDelete: "SET NULL",
        })
      );
    }

    // ============================================
    // Crear tabla accounting_reports
    // ============================================
    const accountingReportsTable = await queryRunner.getTable("accounting_reports");
    if (!accountingReportsTable) {
      await queryRunner.createTable(
        new Table({
          name: "accounting_reports",
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
            },
            {
              name: "period",
              type: "enum",
              enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
            },
            {
              name: "startDate",
              type: "date",
            },
            {
              name: "endDate",
              type: "date",
            },
            {
              name: "totalIncome",
              type: "decimal",
              precision: 10,
              scale: 2,
              default: 0,
            },
            {
              name: "totalExpenses",
              type: "decimal",
              precision: 10,
              scale: 2,
              default: 0,
            },
            {
              name: "netProfit",
              type: "decimal",
              precision: 10,
              scale: 2,
              default: 0,
            },
            {
              name: "totalTax",
              type: "decimal",
              precision: 10,
              scale: 2,
              default: 0,
            },
            {
              name: "cashFlow",
              type: "decimal",
              precision: 10,
              scale: 2,
              default: 0,
            },
            {
              name: "salesCount",
              type: "int",
              default: 0,
            },
            {
              name: "expensesCount",
              type: "int",
              default: 0,
            },
            {
              name: "pdfUrl",
              type: "varchar",
              length: "500",
              isNullable: true,
            },
            {
              name: "excelUrl",
              type: "varchar",
              length: "500",
              isNullable: true,
            },
            {
              name: "metadata",
              type: "text",
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
            {
              name: "deletedAt",
              type: "timestamp",
              isNullable: true,
            },
          ],
        }),
        true
      );

      await queryRunner.createIndex(
        "accounting_reports",
        new TableIndex({
          name: "IDX_accounting_reports_storeId_period_startDate",
          columnNames: ["storeId", "period", "startDate"],
        })
      );

      await queryRunner.createForeignKey(
        "accounting_reports",
        new TableForeignKey({
          columnNames: ["storeId"],
          referencedTableName: "stores",
          referencedColumnNames: ["id"],
          onDelete: "CASCADE",
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tablas en orden inverso (primero las que dependen de otras)
    const tablesToDrop = [
      "accounting_reports",
      "accounting_entries",
      "order_items",
      "orders",
      "password_reset_tokens",
    ];

    for (const tableName of tablesToDrop) {
      const table = await queryRunner.getTable(tableName);
      if (table) {
        await queryRunner.dropTable(tableName);
      }
    }

    // Eliminar columnas de products
    const productsColumnsToRemove = [
      "images",
      "isPublic",
      "slug",
      "views",
      "salesCount",
      "metaDescription",
      "metaKeywords",
      "allowShipping",
      "isDigital",
    ];

    for (const columnName of productsColumnsToRemove) {
      const productsTable = await queryRunner.getTable("products");
      if (productsTable) {
        const column = productsTable.findColumnByName(columnName);
        if (column) {
          await queryRunner.dropColumn("products", columnName);
        }
      }
    }

    // Eliminar columnas de stores
    const storesColumnsToRemove = [
      "banner",
      "type",
      "slug",
      "isPublic",
      "electronicInvoiceEnabled",
      "electronicInvoiceProvider",
      "electronicInvoiceConfig",
      "paymentGateway",
      "paymentGatewayConfig",
      "shippingEnabled",
      "shippingProvider",
      "shippingConfig",
      "latitude",
      "longitude",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
    ];

    for (const columnName of storesColumnsToRemove) {
      const storesTable = await queryRunner.getTable("stores");
      if (storesTable) {
        const column = storesTable.findColumnByName(columnName);
        if (column) {
          await queryRunner.dropColumn("stores", columnName);
        }
      }
    }
  }
}

