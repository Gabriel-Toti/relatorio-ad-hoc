import { pgTable, index, unique, smallint, char, text, varchar, foreignKey, check, serial, numeric, integer, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const estado = pgTable("estado", {
	id: smallint().primaryKey().notNull(),
	uf: char({ length: 2 }).notNull(),
	nomeEstado: text("nome_estado").notNull(),
}, (table) => [
	index("indice_uf_estado").using("btree", table.uf.asc().nullsLast().op("bpchar_ops")),
	unique("estado_uf_key").on(table.uf),
	unique("estado_nome_estado_key").on(table.nomeEstado),
]);

export const caracteristica = pgTable("caracteristica", {
	id: smallint().primaryKey().notNull(),
	nomeCaracteristica: varchar("nome_caracteristica", { length: 100 }).notNull(),
	categoria: varchar({ length: 13 }).notNull(),
}, (table) => [
	index("indice_categoria_caracteristica").using("btree", table.categoria.asc().nullsLast().op("text_ops")),
]);

export const desmatamentoBioma = pgTable("desmatamento_bioma", {
	id: serial().primaryKey().notNull(),
	areaDesmatada: numeric("area_desmatada", { precision: 20, scale:  2 }).notNull(),
	ano: smallint().notNull(),
	biomaId: smallint("bioma_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.biomaId],
			foreignColumns: [bioma.id],
			name: "desmatamento_bioma_bioma_id_fkey"
		}).onDelete("cascade"),
	check("desmatamento_bioma_ano_check", sql`(ano >= 1900) AND (ano <= 2100)`),
	check("desmatamento_bioma_area_desmatada_check", sql`area_desmatada >= (0)::numeric`),
]);

export const desmatamentoEstado = pgTable("desmatamento_estado", {
	id: serial().primaryKey().notNull(),
	areaDesmatada: numeric("area_desmatada", { precision: 20, scale:  2 }).notNull(),
	ano: smallint().notNull(),
	estadoId: smallint("estado_id").notNull(),
	biomaId: smallint("bioma_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.biomaId],
			foreignColumns: [bioma.id],
			name: "desmatamento_estado_bioma_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.estadoId],
			foreignColumns: [estado.id],
			name: "desmatamento_estado_estado_id_fkey"
		}).onDelete("cascade"),
	check("desmatamento_estado_ano_check", sql`(ano >= 1900) AND (ano <= 2100)`),
	check("desmatamento_estado_area_desmatada_check", sql`area_desmatada >= (0)::numeric`),
]);

export const desmatamentoMunicipio = pgTable("desmatamento_municipio", {
	id: serial().primaryKey().notNull(),
	areaDesmatada: numeric("area_desmatada", { precision: 20, scale:  2 }).notNull(),
	ano: smallint().notNull(),
	municipioId: integer("municipio_id").notNull(),
	biomaId: smallint("bioma_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.biomaId],
			foreignColumns: [bioma.id],
			name: "desmatamento_municipio_bioma_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.municipioId],
			foreignColumns: [municipio.id],
			name: "desmatamento_municipio_municipio_id_fkey"
		}).onDelete("cascade"),
	check("desmatamento_municipio_ano_check", sql`(ano >= 1900) AND (ano <= 2100)`),
	check("desmatamento_municipio_area_desmatada_check", sql`area_desmatada >= (0)::numeric`),
]);

export const bioma = pgTable("bioma", {
	id: smallint().primaryKey().notNull(),
	nomeBioma: text("nome_bioma").notNull(),
}, (table) => [
	index("indice_nome_bioma").using("btree", table.nomeBioma.asc().nullsLast().op("text_ops")),
	unique("bioma_nome_bioma_key").on(table.nomeBioma),
]);

export const municipio = pgTable("municipio", {
	id: integer().primaryKey().notNull(),
	nomeMunicipio: text("nome_municipio").notNull(),
	estadoId: smallint("estado_id").notNull(),
}, (table) => [
	index("indice_nome_municipio").using("btree", table.nomeMunicipio.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.estadoId],
			foreignColumns: [estado.id],
			name: "municipio_estado_id_fkey"
		}).onDelete("cascade"),
]);

export const biomaMunicipio = pgTable("bioma_municipio", {
	municipioId: integer("municipio_id").notNull(),
	biomaId: smallint("bioma_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.biomaId],
			foreignColumns: [bioma.id],
			name: "bioma_municipio_bioma_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.municipioId],
			foreignColumns: [municipio.id],
			name: "bioma_municipio_municipio_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.municipioId, table.biomaId], name: "bioma_municipio_pkey"}),
]);

export const biomaEstado = pgTable("bioma_estado", {
	biomaId: smallint("bioma_id").notNull(),
	estadoId: smallint("estado_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.biomaId],
			foreignColumns: [bioma.id],
			name: "bioma_estado_bioma_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.estadoId],
			foreignColumns: [estado.id],
			name: "bioma_estado_estado_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.biomaId, table.estadoId], name: "bioma_estado_pkey"}),
]);

export const caracteristicaMunicipio = pgTable("caracteristica_municipio", {
	caracteristicaId: smallint("caracteristica_id").notNull(),
	municipioId: integer("municipio_id").notNull(),
	area: numeric({ precision: 20, scale:  2 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.caracteristicaId],
			foreignColumns: [caracteristica.id],
			name: "caracteristica_municipio_caracteristica_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.municipioId],
			foreignColumns: [municipio.id],
			name: "caracteristica_municipio_municipio_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.caracteristicaId, table.municipioId], name: "caracteristica_municipio_pkey"}),
	check("caracteristica_municipio_area_check", sql`area >= (0)::numeric`),
]);

export const caracteristicaBioma = pgTable("caracteristica_bioma", {
	caracteristicaId: smallint("caracteristica_id").notNull(),
	biomaId: smallint("bioma_id").notNull(),
	area: numeric({ precision: 20, scale:  2 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.biomaId],
			foreignColumns: [bioma.id],
			name: "caracteristica_bioma_bioma_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.caracteristicaId],
			foreignColumns: [caracteristica.id],
			name: "caracteristica_bioma_caracteristica_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.caracteristicaId, table.biomaId], name: "caracteristica_bioma_pkey"}),
	check("caracteristica_bioma_area_check", sql`area >= (0)::numeric`),
]);

export const caracteristicaEstado = pgTable("caracteristica_estado", {
	caracteristicaId: smallint("caracteristica_id").notNull(),
	estadoId: smallint("estado_id").notNull(),
	area: numeric({ precision: 20, scale:  2 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.caracteristicaId],
			foreignColumns: [caracteristica.id],
			name: "caracteristica_estado_caracteristica_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.estadoId],
			foreignColumns: [estado.id],
			name: "caracteristica_estado_estado_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.caracteristicaId, table.estadoId], name: "caracteristica_estado_pkey"}),
	check("caracteristica_estado_area_check", sql`area >= (0)::numeric`),
]);
