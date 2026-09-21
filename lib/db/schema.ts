import { pgTable, text, timestamp, integer, decimal, varchar, pgEnum, boolean } from 'drizzle-orm/pg-core';

// Enums
export const abcClassEnum = pgEnum('abc_class', ['A', 'B', 'C']);
export const productStatusEnum = pgEnum('product_status', ['normal', 'low', 'critical', 'out_of_stock']);
export const movementTypeEnum = pgEnum('movement_type', ['inbound', 'outbound', 'transfer', 'adjustment']);
export const movementStatusEnum = pgEnum('movement_status', ['pending', 'in_transit', 'completed', 'audited']);
export const orderStatusEnum = pgEnum('order_status', ['quotation', 'approved', 'shipped', 'received', 'cancelled']);
export const supplierStatusEnum = pgEnum('supplier_status', ['active', 'suspended', 'under_review']);

// Products Table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  ean: text('ean'),
  name: text('name').notNull(),
  category: text('category').notNull(),
  location: text('location'),
  stockLevel: integer('stock_level').notNull().default(0),
  reservedStock: integer('reserved_stock').notNull().default(0),
  minStock: integer('min_stock').notNull().default(0),
  reorderPoint: integer('reorder_point').notNull().default(0),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }).notNull().default('0'),
  sellPrice: decimal('sell_price', { precision: 10, scale: 2 }).notNull().default('0'),
  abcClass: abcClassEnum('abc_class').notNull().default('C'),
  status: productStatusEnum('status').notNull().default('normal'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Movements Table
export const movements = pgTable('movements', {
  id: text('id').primaryKey(),
  protocol: text('protocol').notNull().unique(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  type: movementTypeEnum('type').notNull(),
  document: text('document'),
  sku: text('sku').notNull().references(() => products.sku),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  unit: text('unit').notNull().default('un'),
  origin: text('origin'),
  destination: text('destination'),
  operator: text('operator').notNull(),
  status: movementStatusEnum('status').notNull().default('completed'),
});

// Suppliers Table
export const suppliers = pgTable('suppliers', {
  id: text('id').primaryKey(),
  cnpj: text('cnpj').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  contactName: text('contact_name'),
  scorecard: integer('scorecard').notNull().default(0),
  punctuality: integer('punctuality').notNull().default(0),
  qualityRate: integer('quality_rate').notNull().default(0),
  status: supplierStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Orders Table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().unique(),
  date: timestamp('date').notNull().defaultNow(),
  supplierId: text('supplier_id').notNull().references(() => suppliers.id),
  supplierName: text('supplier_name').notNull(),
  itemsCount: integer('items_count').notNull().default(0),
  totalValue: decimal('total_value', { precision: 10, scale: 2 }).notNull().default('0'),
  paymentTerms: text('payment_terms'),
  expectedArrival: timestamp('expected_arrival'),
  status: orderStatusEnum('status').notNull().default('quotation'),
  isAiSuggested: boolean('is_ai_suggested').default(false),
});
