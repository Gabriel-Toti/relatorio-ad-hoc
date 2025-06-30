-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "estado" (
	"id" smallint PRIMARY KEY NOT NULL,
	"uf" char(2) NOT NULL,
	"nome_estado" text NOT NULL,
	CONSTRAINT "estado_uf_key" UNIQUE("uf"),
	CONSTRAINT "estado_nome_estado_key" UNIQUE("nome_estado")
);
--> statement-breakpoint
CREATE TABLE "caracteristica" (
	"id" smallint PRIMARY KEY NOT NULL,
	"nome_caracteristica" varchar(100) NOT NULL,
	"categoria" varchar(13) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "desmatamento_bioma" (
	"id" serial PRIMARY KEY NOT NULL,
	"area_desmatada" numeric(20, 2) NOT NULL,
	"ano" smallint NOT NULL,
	"bioma_id" smallint NOT NULL,
	CONSTRAINT "desmatamento_bioma_ano_check" CHECK ((ano >= 1900) AND (ano <= 2100)),
	CONSTRAINT "desmatamento_bioma_area_desmatada_check" CHECK (area_desmatada >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "desmatamento_estado" (
	"id" serial PRIMARY KEY NOT NULL,
	"area_desmatada" numeric(20, 2) NOT NULL,
	"ano" smallint NOT NULL,
	"estado_id" smallint NOT NULL,
	"bioma_id" smallint NOT NULL,
	CONSTRAINT "desmatamento_estado_ano_check" CHECK ((ano >= 1900) AND (ano <= 2100)),
	CONSTRAINT "desmatamento_estado_area_desmatada_check" CHECK (area_desmatada >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "desmatamento_municipio" (
	"id" serial PRIMARY KEY NOT NULL,
	"area_desmatada" numeric(20, 2) NOT NULL,
	"ano" smallint NOT NULL,
	"municipio_id" integer NOT NULL,
	"bioma_id" smallint NOT NULL,
	CONSTRAINT "desmatamento_municipio_ano_check" CHECK ((ano >= 1900) AND (ano <= 2100)),
	CONSTRAINT "desmatamento_municipio_area_desmatada_check" CHECK (area_desmatada >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "bioma" (
	"id" smallint PRIMARY KEY NOT NULL,
	"nome_bioma" text NOT NULL,
	CONSTRAINT "bioma_nome_bioma_key" UNIQUE("nome_bioma")
);
--> statement-breakpoint
CREATE TABLE "municipio" (
	"id" integer PRIMARY KEY NOT NULL,
	"nome_municipio" text NOT NULL,
	"estado_id" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bioma_municipio" (
	"municipio_id" integer NOT NULL,
	"bioma_id" smallint NOT NULL,
	CONSTRAINT "bioma_municipio_pkey" PRIMARY KEY("municipio_id","bioma_id")
);
--> statement-breakpoint
CREATE TABLE "bioma_estado" (
	"bioma_id" smallint NOT NULL,
	"estado_id" smallint NOT NULL,
	CONSTRAINT "bioma_estado_pkey" PRIMARY KEY("bioma_id","estado_id")
);
--> statement-breakpoint
CREATE TABLE "caracteristica_municipio" (
	"caracteristica_id" smallint NOT NULL,
	"municipio_id" integer NOT NULL,
	"area" numeric(20, 2) NOT NULL,
	CONSTRAINT "caracteristica_municipio_pkey" PRIMARY KEY("caracteristica_id","municipio_id"),
	CONSTRAINT "caracteristica_municipio_area_check" CHECK (area >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "caracteristica_bioma" (
	"caracteristica_id" smallint NOT NULL,
	"bioma_id" smallint NOT NULL,
	"area" numeric(20, 2) NOT NULL,
	CONSTRAINT "caracteristica_bioma_pkey" PRIMARY KEY("caracteristica_id","bioma_id"),
	CONSTRAINT "caracteristica_bioma_area_check" CHECK (area >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "caracteristica_estado" (
	"caracteristica_id" smallint NOT NULL,
	"estado_id" smallint NOT NULL,
	"area" numeric(20, 2) NOT NULL,
	CONSTRAINT "caracteristica_estado_pkey" PRIMARY KEY("caracteristica_id","estado_id"),
	CONSTRAINT "caracteristica_estado_area_check" CHECK (area >= (0)::numeric)
);
--> statement-breakpoint
ALTER TABLE "desmatamento_bioma" ADD CONSTRAINT "desmatamento_bioma_bioma_id_fkey" FOREIGN KEY ("bioma_id") REFERENCES "public"."bioma"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desmatamento_estado" ADD CONSTRAINT "desmatamento_estado_bioma_id_fkey" FOREIGN KEY ("bioma_id") REFERENCES "public"."bioma"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desmatamento_estado" ADD CONSTRAINT "desmatamento_estado_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."estado"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desmatamento_municipio" ADD CONSTRAINT "desmatamento_municipio_bioma_id_fkey" FOREIGN KEY ("bioma_id") REFERENCES "public"."bioma"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desmatamento_municipio" ADD CONSTRAINT "desmatamento_municipio_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "public"."municipio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "municipio" ADD CONSTRAINT "municipio_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."estado"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bioma_municipio" ADD CONSTRAINT "bioma_municipio_bioma_id_fkey" FOREIGN KEY ("bioma_id") REFERENCES "public"."bioma"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bioma_municipio" ADD CONSTRAINT "bioma_municipio_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "public"."municipio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bioma_estado" ADD CONSTRAINT "bioma_estado_bioma_id_fkey" FOREIGN KEY ("bioma_id") REFERENCES "public"."bioma"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bioma_estado" ADD CONSTRAINT "bioma_estado_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."estado"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caracteristica_municipio" ADD CONSTRAINT "caracteristica_municipio_caracteristica_id_fkey" FOREIGN KEY ("caracteristica_id") REFERENCES "public"."caracteristica"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caracteristica_municipio" ADD CONSTRAINT "caracteristica_municipio_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "public"."municipio"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caracteristica_bioma" ADD CONSTRAINT "caracteristica_bioma_bioma_id_fkey" FOREIGN KEY ("bioma_id") REFERENCES "public"."bioma"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caracteristica_bioma" ADD CONSTRAINT "caracteristica_bioma_caracteristica_id_fkey" FOREIGN KEY ("caracteristica_id") REFERENCES "public"."caracteristica"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caracteristica_estado" ADD CONSTRAINT "caracteristica_estado_caracteristica_id_fkey" FOREIGN KEY ("caracteristica_id") REFERENCES "public"."caracteristica"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caracteristica_estado" ADD CONSTRAINT "caracteristica_estado_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."estado"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "indice_uf_estado" ON "estado" USING btree ("uf" bpchar_ops);--> statement-breakpoint
CREATE INDEX "indice_categoria_caracteristica" ON "caracteristica" USING btree ("categoria" text_ops);--> statement-breakpoint
CREATE INDEX "indice_nome_bioma" ON "bioma" USING btree ("nome_bioma" text_ops);--> statement-breakpoint
CREATE INDEX "indice_nome_municipio" ON "municipio" USING btree ("nome_municipio" text_ops);
*/