import { relations } from "drizzle-orm/relations";
import { bioma, desmatamentoBioma, desmatamentoEstado, estado, desmatamentoMunicipio, municipio, biomaMunicipio, biomaEstado, caracteristica, caracteristicaMunicipio, caracteristicaBioma, caracteristicaEstado } from "./schema";

export const desmatamentoBiomaRelations = relations(desmatamentoBioma, ({one}) => ({
	bioma: one(bioma, {
		fields: [desmatamentoBioma.biomaId],
		references: [bioma.id]
	}),
}));

export const biomaRelations = relations(bioma, ({many}) => ({
	desmatamentoBiomas: many(desmatamentoBioma),
	desmatamentoEstados: many(desmatamentoEstado),
	desmatamentoMunicipios: many(desmatamentoMunicipio),
	biomaMunicipios: many(biomaMunicipio),
	biomaEstados: many(biomaEstado),
	caracteristicaBiomas: many(caracteristicaBioma),
}));

export const desmatamentoEstadoRelations = relations(desmatamentoEstado, ({one}) => ({
	bioma: one(bioma, {
		fields: [desmatamentoEstado.biomaId],
		references: [bioma.id]
	}),
	estado: one(estado, {
		fields: [desmatamentoEstado.estadoId],
		references: [estado.id]
	}),
}));

export const estadoRelations = relations(estado, ({many}) => ({
	desmatamentoEstados: many(desmatamentoEstado),
	municipios: many(municipio),
	biomaEstados: many(biomaEstado),
	caracteristicaEstados: many(caracteristicaEstado),
}));

export const desmatamentoMunicipioRelations = relations(desmatamentoMunicipio, ({one}) => ({
	bioma: one(bioma, {
		fields: [desmatamentoMunicipio.biomaId],
		references: [bioma.id]
	}),
	municipio: one(municipio, {
		fields: [desmatamentoMunicipio.municipioId],
		references: [municipio.id]
	}),
}));

export const municipioRelations = relations(municipio, ({one, many}) => ({
	desmatamentoMunicipios: many(desmatamentoMunicipio),
	estado: one(estado, {
		fields: [municipio.estadoId],
		references: [estado.id]
	}),
	biomaMunicipios: many(biomaMunicipio),
	caracteristicaMunicipios: many(caracteristicaMunicipio),
}));

export const biomaMunicipioRelations = relations(biomaMunicipio, ({one}) => ({
	bioma: one(bioma, {
		fields: [biomaMunicipio.biomaId],
		references: [bioma.id]
	}),
	municipio: one(municipio, {
		fields: [biomaMunicipio.municipioId],
		references: [municipio.id]
	}),
}));

export const biomaEstadoRelations = relations(biomaEstado, ({one}) => ({
	bioma: one(bioma, {
		fields: [biomaEstado.biomaId],
		references: [bioma.id]
	}),
	estado: one(estado, {
		fields: [biomaEstado.estadoId],
		references: [estado.id]
	}),
}));

export const caracteristicaMunicipioRelations = relations(caracteristicaMunicipio, ({one}) => ({
	caracteristica: one(caracteristica, {
		fields: [caracteristicaMunicipio.caracteristicaId],
		references: [caracteristica.id]
	}),
	municipio: one(municipio, {
		fields: [caracteristicaMunicipio.municipioId],
		references: [municipio.id]
	}),
}));

export const caracteristicaRelations = relations(caracteristica, ({many}) => ({
	caracteristicaMunicipios: many(caracteristicaMunicipio),
	caracteristicaBiomas: many(caracteristicaBioma),
	caracteristicaEstados: many(caracteristicaEstado),
}));

export const caracteristicaBiomaRelations = relations(caracteristicaBioma, ({one}) => ({
	bioma: one(bioma, {
		fields: [caracteristicaBioma.biomaId],
		references: [bioma.id]
	}),
	caracteristica: one(caracteristica, {
		fields: [caracteristicaBioma.caracteristicaId],
		references: [caracteristica.id]
	}),
}));

export const caracteristicaEstadoRelations = relations(caracteristicaEstado, ({one}) => ({
	caracteristica: one(caracteristica, {
		fields: [caracteristicaEstado.caracteristicaId],
		references: [caracteristica.id]
	}),
	estado: one(estado, {
		fields: [caracteristicaEstado.estadoId],
		references: [estado.id]
	}),
}));