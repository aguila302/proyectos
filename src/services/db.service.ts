import { Injectable } from '@angular/core'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'
import { PROYECTOS } from '../services/mocks/proyectos'
import { Proyecto } from '../interfaces/proyecto'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@Injectable()

/* Clase para crear la base de datos. */
export class DbService {
	db: SQLiteObject = null
	sqlite: SQLite = null;

	constructor() {
		this.sqlite = new SQLite();
	}

	/* Creamos la base de datos. */
	openDatabase() {
		return this.sqlite.create({
				name: 'proyectos.db',
				location: 'default',
				createFromLocation: 1
			})
			.then((db: SQLiteObject) => {
				this.db = db
			})

	}
		/* Reseteamos la tabla proyectos. */
	resetTable() {
		let sql = 'drop table if exists proyectos'

		return this.db.executeSql(sql, {})
			.then(() => console.log('tabla reseteada'))
			.catch(e => console.log(e))
	}

	/* Creamos la tabla. */
	createTable() {
		let sql = `
			create table if not exists proyectos(
				id integer primary key autoincrement,
				nombre_proyecto text,
				nombre_corto text,
				contrato text,
				monto integer,
				moneda text,
				pais text,
				gerencia text,
				unidad_negocio text,
				numero_contrato text,
				producto text,
				anio integer,
				duracion text,
				contratante text,
				datos_cliente text,
				fecha_inicio text,
				fecha_fin text,
				numero_propuesta text,
				anticipo text)
		`;

		return this.db.executeSql(sql, {})
			.then(() => console.log('tabla creada'))
			.catch(e => console.log(e))
	}

	/* Insertamos los datos. */
	insertaDatos() {
		let origen = collect(PROYECTOS)
		origen.each(item => {
			let sql = `insert into proyectos(
				nombre_proyecto, nombre_corto, contrato,
				monto, moneda, pais,
				gerencia, unidad_negocio,
				numero_contrato, producto,
				anio, duracion, contratante,
				datos_cliente, fecha_inicio,
				fecha_fin, numero_propuesta,
				anticipo) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			return this.db.executeSql(sql, [
					item.nombre_proyecto,
					item.nombre_corto,
					item.contrato,
					parseInt(item.monto),
					item.moneda,
					item.pais,
					item.gerencia,
					item.unidad_negocio,
					item.numero_contrato,
					item.producto,
					item.anio,
					item.duracion,
					item.contratante,
					item.datos_cliente,
					item.fecha_inicio,
					item.fecha_fin,
					item.numero_propuesta,
					item.anticipo
				]).then(() => console.log('regustros insertados'))
				.catch(e => console.log(e))
		})
	}

	/* Obtenemos las datos de los proyectos. */
	getProyectos(): Promise < Proyecto[] > {
		let proyectos = []
		let sql = 'select * from proyectos'

		return this.db.executeSql(sql, {})
			.then((response) => {
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push({
						'nombre_proyecto': response.rows.item(index).nombre_proyecto,
						'monto': account.formatMoney(response.rows.item(index).monto),
						'moneda': response.rows.item(index).moneda,
						'pais': response.rows.item(index).pais,
						'gerencia': response.rows.item(index).gerencia,
						'unidad_negocio': response.rows.item(index).unidad_negocio,
						'numero_contrato': response.rows.item(index).numero_contrato,
						'producto': response.rows.item(index).producto,
						'anio': response.rows.item(index).anio,
						'duracion': response.rows.item(index).duracion,
						'contratante': response.rows.item(index).contratante,
						'datos_cliente': response.rows.item(index).datos_cliente,
						'fecha_inicio': response.rows.item(index).fecha_inicio,
						'fecha_fin': response.rows.item(index).fecha_fin,
						'numero_propuesta': response.rows.item(index).numero_propuesta,
						'anticipo': response.rows.item(index).anticipo,
					})
				}
				return proyectos
			})
	}

	/* Funcion para buscar los proyectos dado a los filtros seleccionados. */
	buscaProyecto = (val, filtros): any => {
		let proyectos = []
		for (let i in filtros) {
			console.log(filtros)
			let sql = 'select * from proyectos where ' + i + ' like ' + "'%" + val + "%'"
			console.log(sql)
			this.db.executeSql(sql, {})
				.then((response) => {
					for (let index = 0; index < response.rows.length; index++) {
						proyectos.push({
							'nombre_proyecto': response.rows.item(index).nombre_proyecto,
							'moneda': response.rows.item(index).moneda,
							'monto': account.formatMoney(response.rows.item(index).monto),
						})
					}
					Promise.resolve(proyectos)
				})
		}
		return proyectos
	}

	/* Funcion para consultar los proyectos por pais. */
	consultaXPais = (): any => {
		let proyectos = []
		let sql = `select pais, count(*) as numero_proyectos, sum(monto) as monto,
					(select count(*) from proyectos) as total
					FROM proyectos
					group by pais order by pais asc`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push({
						'pais': response.rows.item(index).pais,
						'numero_proyectos': response.rows.item(index).numero_proyectos,
						'monto': parseInt(response.rows.item(index).monto),
						'total': response.rows.item(index).total,
						'porcentaje': account.toFixed((response.rows.item(index).numero_proyectos / response.rows.item(index).total) * 100, 2)
					})
				}
				return Promise.resolve(proyectos)
			})
	}

	/* Funcion para traer los proyectos de un pais dado. */
	consultaPaisAgrupado = (pais: string): any => {
		let proyectos = []
		let sql = 'select * from proyectos where pais = ' + "'"  + pais + "'"

		return this.db.executeSql(sql, {})
			.then((response) => {
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push({
						'nombre_proyecto': response.rows.item(index).nombre_proyecto,
						'monto': account.formatMoney(response.rows.item(index).monto),
						'moneda': response.rows.item(index).moneda,
						'pais': response.rows.item(index).pais,
						'gerencia': response.rows.item(index).gerencia,
						'unidad_negocio': response.rows.item(index).unidad_negocio,
						'numero_contrato': response.rows.item(index).numero_contrato,
						'producto': response.rows.item(index).producto,
						'anio': response.rows.item(index).anio,
						'duracion': response.rows.item(index).duracion,
						'contratante': response.rows.item(index).contratante,
						'datos_cliente': response.rows.item(index).datos_cliente,
						'fecha_inicio': response.rows.item(index).fecha_inicio,
						'fecha_fin': response.rows.item(index).fecha_fin,
						'numero_propuesta': response.rows.item(index).numero_propuesta,
						'anticipo': response.rows.item(index).anticipo,
					})
				}
				return proyectos
			})
	}
}