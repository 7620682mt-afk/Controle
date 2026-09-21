CREATE TYPE "public"."abc_class" AS ENUM('A', 'B', 'C');--> statement-breakpoint
CREATE TYPE "public"."movement_status" AS ENUM('pending', 'in_transit', 'completed', 'audited');--> statement-breakpoint
CREATE TYPE "public"."movement_type" AS ENUM('inbound', 'outbound', 'transfer', 'adjustment');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('quotation', 'approved', 'shipped', 'received', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('normal', 'low', 'critical', 'out_of_stock');--> statement-breakpoint
CREATE TYPE "public"."supplier_status" AS ENUM('active', 'suspended', 'under_review');--> statement-breakpoint
CREATE TABLE "movements" (
	"id" text PRIMARY KEY NOT NULL,
	"protocol" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"type" "movement_type" NOT NULL,
	"document" text,
	"sku" text NOT NULL,
	"product_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit" text DEFAULT 'un' NOT NULL,
	"origin" text,
	"destination" text,
	"operator" text NOT NULL,
	"status" "movement_status" DEFAULT 'completed' NOT NULL,
	CONSTRAINT "movements_protocol_unique" UNIQUE("protocol")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"supplier_id" text NOT NULL,
	"supplier_name" text NOT NULL,
	"items_count" integer DEFAULT 0 NOT NULL,
	"total_value" numeric(10, 2) DEFAULT '0' NOT NULL,
	"payment_terms" text,
	"expected_arrival" timestamp,
	"status" "order_status" DEFAULT 'quotation' NOT NULL,
	"is_ai_suggested" text DEFAULT 'false',
	CONSTRAINT "orders_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"ean" text,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"location" text,
	"stock_level" integer DEFAULT 0 NOT NULL,
	"reserved_stock" integer DEFAULT 0 NOT NULL,
	"min_stock" integer DEFAULT 0 NOT NULL,
	"reorder_point" integer DEFAULT 0 NOT NULL,
	"cost_price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"sell_price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"abc_class" "abc_class" DEFAULT 'C' NOT NULL,
	"status" "product_status" DEFAULT 'normal' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" text PRIMARY KEY NOT NULL,
	"cnpj" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"contact_name" text,
	"scorecard" integer DEFAULT 0 NOT NULL,
	"punctuality" integer DEFAULT 0 NOT NULL,
	"quality_rate" integer DEFAULT 0 NOT NULL,
	"status" "supplier_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "suppliers_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_sku_products_sku_fk" FOREIGN KEY ("sku") REFERENCES "public"."products"("sku") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;