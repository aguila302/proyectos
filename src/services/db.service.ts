import { Injectable } from '@angular/core'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'
import { PROYECTOS } from '../services/mocks/proyectos'
import { Proyecto } from '../interfaces/proyecto'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { ReportesDbService } from './reportes.db.service'
import { SQLitePorter } from '@ionic-native/sqlite-porter';

@Injectable()

/* Clase para crear la base de datos. */
export class DbService {
	db: SQLiteObject = null
	sqlite: SQLite = null;

	constructor(public reporteService: ReportesDbService,
		private sqlitePorter: SQLitePorter) {
		this.sqlite = new SQLite();
	}

	/* Creamos la base de datos. */
	openDatabase() {
		return this.sqlite.create({
				name: 'data.db',
				location: 'default',
				createFromLocation: 1
			})
			.then((db: any) => {
				this.db = db
				// let dbInstance = db._objectInstance;

				/* Inicio mi servicio para los reportes. */
				this.reporteService.initDb(db)
			})

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
				monto_moneda_original integer,
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
		`
		// this.sqlitePorter.exportDbToSql(this.db)
		// 	.then(r => {
		// 		console.log(r)
				
		// 		console.log('Exported')
		// 	})
		// 	.catch(e => console.error(e))

		return this.db.executeSql(sql, {})
			.then(() => console.log('tabla creada'))
			.catch(e => console.log(e))
	}

	/* Validamos que la tabla proyectos tenga informacion. */
	validaRegistros() {
		let sql = 'select count(*) as contador from proyectos'
		return this.db.executeSql(sql, {})
		.then((response) => {
			let filas = response.rows.item(0).contador
			/* Si no hay registros insertamos los datos*/
			// console.log(response.rows.item(0).contador)
			if(filas === 0) {
				//console.log('insertamos registros')
				this.insertaDatos()
			}
			else {
				console.log('tenemos registros')
			}
			// console.log(response.rows.length)
		})
	}
	/* Insertamos los datos. */
	insertaDatos() {
		let origen = collect(PROYECTOS)
		origen.each(item => {
			let sql = `insert into proyectos(
				nombre_proyecto, nombre_corto, contrato,
				monto, monto_moneda_original, moneda, pais,
				gerencia, unidad_negocio,
				numero_contrato, producto,
				anio, duracion, contratante,
				datos_cliente, fecha_inicio,
				fecha_fin, numero_propuesta,
				anticipo) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			return this.db.executeSql(sql, [
					item.nombre_proyecto,
					item.nombre_corto,
					item.contrato,
					parseInt(item.montoUsd),
					parseInt(item.monto_moneda_original),
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
						'monto': account.formatNumber(response.rows.item(index).monto),
						'monto_moneda_original': account.formatNumber(response.rows.item(index).monto_moneda_original),
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
			let sql = 'select * from proyectos where ' + i + ' like ' + "'%" + val + "%'"
			console.log(sql)
			
			this.db.executeSql(sql, {})
				.then((response) => {
					for (let index = 0; index < response.rows.length; index++) {
						proyectos.push({
							'nombre_proyecto': response.rows.item(index).nombre_proyecto,
							'moneda': response.rows.item(index).moneda,
							'monto': account.formatNumber(response.rows.item(index).monto),
							'monto_moneda_original': account.formatNumber(response.rows.item(index).monto_moneda_original),
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
					Promise.resolve(proyectos)
				})
		}
		console.log(proyectos)
		
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
						'monto': account.formatNumber(response.rows.item(index).monto),
						'monto_moneda_original': account.formatNumber(response.rows.item(index).monto_moneda_original),
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

	/* Funcion para la consulta de proyectos por anio. */
	consultaXAnio = (): any => {
		let proyectos = []
		let sql = `select anio, count(*) as numero_proyectos, sum(monto) as monto,
					(select count(*) from proyectos) as total
					FROM proyectos
					group by anio order by anio desc`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push({
						'anio': response.rows.item(index).anio,
						'numero_proyectos': response.rows.item(index).numero_proyectos,
						'monto': parseInt(response.rows.item(index).monto),
						'total': response.rows.item(index).total,
						'porcentaje': account.toFixed((response.rows.item(index).numero_proyectos / response.rows.item(index).total) * 100, 2)
					})
				}
				return Promise.resolve(proyectos)
			})
	}

	/* Funcion para traer los proyectos de un anio dado. */
	consultaAnioAgrupado = (anio: number): any => {
		let proyectos = []
		let sql = 'select * from proyectos where anio = ' + "'"  + anio + "'"

		return this.db.executeSql(sql, {})
			.then((response) => {
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push({
						'nombre_proyecto': response.rows.item(index).nombre_proyecto,
						'monto': account.formatNumber(response.rows.item(index).monto),
						'monto_moneda_original': account.formatNumber(response.rows.item(index).monto_moneda_original),
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

	/* Funcion para la consulta de proyectos por gerencia. */
	consultaXGerencia = (): any => {
		let proyectos = []
		let sql = `select gerencia, count(*) as numero_proyectos, sum(monto) as monto,
					(select count(*) from proyectos) as total
					FROM proyectos
					group by gerencia order by gerencia asc`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push({
						'gerencia': response.rows.item(index).gerencia,
						'numero_proyectos': response.rows.item(index).numero_proyectos,
						'monto': parseInt(response.rows.item(index).monto),
						'total': response.rows.item(index).total,
						'porcentaje': account.toFixed((response.rows.item(index).numero_proyectos / response.rows.item(index).total) * 100, 2)
					})
				}
				return Promise.resolve(proyectos)
			})
	}

	/* Funcion para traer los proyectos de un gerencia dado. */
	consultaGerenciaAgrupado = (gerencia: string): any => {
		let proyectos = []
		let sql = 'select * from proyectos where gerencia = ' + "'"  + gerencia + "'"

		return this.db.executeSql(sql, {})
			.then((response) => {
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push({
						'nombre_proyecto': response.rows.item(index).nombre_proyecto,
						'monto': account.formatNumber(response.rows.item(index).monto),
						'monto_moneda_original': account.formatNumber(response.rows.item(index).monto_moneda_original),
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

	/* Funcion para la consulta de proyectos por cliente. */
	consultaXCliente = (): any => {
		let proyectos = []
		let sql = `select id, contratante, monto
					FROM proyectos
					order by contratante asc`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push({
						'id': response.rows.item(index).id,
						'contratante': response.rows.item(index).contratante,
						'monto': parseInt(response.rows.item(index).monto),
					})
				}
				return Promise.resolve(proyectos)
			})
	}

	/* Funcion para traer los proyectos de un cliente dado. */
	consultaClienteAgrupado = (contratante: string): any => {
		let proyectos = []
		let sql = 'select * from proyectos where contratante = ' + "'"  + contratante + "'"

		return this.db.executeSql(sql, {})
			.then((response) => {
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push({
						'nombre_proyecto': response.rows.item(index).nombre_proyecto,
						'monto': account.formatNumber(response.rows.item(index).monto),
						'monto_moneda_original': account.formatNumber(response.rows.item(index).monto_moneda_original),
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

	/* Funcion para crear la tabla de reportes. */
	creaTablaReportes() {
		let sql = `
			create table if not exists reportes(
				id integer primary key autoincrement,
				nombre_reporte text,
				total_usd integer,
				total_proyectos integer
				)
		`;

		return this.db.executeSql(sql, {})
			.then(() => console.log('tabla de reportes creada'))
			.catch(e => console.log(e))
	}

	/* Funcion para crear la tabla de reportesColumnas. */
	creaTablaReporteColumnas() {
		let sql = `
			create table if not exists reportes_columnas(
				id integer primary key autoincrement,
				reporte_id integer,
				nombre_columna text,
				FOREIGN KEY(reporte_id) REFERENCES reportes(id)
			)`;

		return this.db.executeSql(sql, {})
			.then(() => console.log('tabla de reportes columnas creada'))
			.catch(e => console.log(e))
	}

	/* Funcion para crear la tabla de reportesFiltros. */
	creaTablaReporteFiltros() {
		let sql = `
			create table if not exists reportes_filtros(
				id integer primary key autoincrement,
				reporte_id integer,
				nombre_columna text,
				valor text,
				FOREIGN KEY(reporte_id) REFERENCES reportes(id)
			)`;

		return this.db.executeSql(sql, {})
			.then(() => console.log('tabla de reportes filtros creada'))
			.catch(e => console.log(e))
	}

		/* Funcion para crear la tabla de reporteAgrupaciones. */
	creaTablaReporteAgrupaciones() {
		let sql = `
			create table if not exists reportes_agrupacion(
				id integer primary key autoincrement,
				reporte_id integer,
				nombre_columna text,
				orden_agrupacion text,
				FOREIGN KEY(reporte_id) REFERENCES reportes(id)
			)`;

		return this.db.executeSql(sql, {})
			.then(() => console.log('tabla de reportes agrupacion creada'))
			.catch(e => console.log(e))
	}

	/* Funcion para insertar datos en la tabla de reportes */
	insertaDatosTablaReportes() {
		let pais = ''
		let anio = ''
		let gerencia = ''
		let cliente = ''
		let producto = ''

		pais = `insert into reportes(nombre_reporte,total_usd, total_proyectos) values('Reporte por pais', '2062717473.00', '1330');`
		this.db.executeSql(pais, {})
			.then(() => console.log('regustros insertados en tabla reportes'))
			.catch(e => console.log(e))

		anio = `
			insert into reportes(nombre_reporte,total_usd, total_proyectos) values('Reporte por año', '2062717473.00', '1330');`
		this.db.executeSql(anio, {})
			.then(() => console.log('regustros insertados en tabla reportes'))
			.catch(e => console.log(e))

		gerencia = `
			insert into reportes(nombre_reporte,total_usd, total_proyectos) values('Reporte por gerencia', '2062717473.00', '1330');`
		this.db.executeSql(gerencia, {})
			.then(() => console.log('regustros insertados en tabla reportes'))
			.catch(e => console.log(e))

		cliente = `
			insert into reportes(nombre_reporte,total_usd, total_proyectos) values('Reporte por cliente', '2062717473.00', '1330');`
		this.db.executeSql(cliente, {})
			.then(() => console.log('regustros insertados en tabla reportes'))
			.catch(e => console.log(e))

		producto = `
			insert into reportes(nombre_reporte,total_usd, total_proyectos) values('Reporte por producto', '2062717473.00', '1330');`
		this.db.executeSql(producto, {})
			.then(() => console.log('regustros insertados en tabla reportes'))
			.catch(e => console.log(e))
	}

	/* Funcion para insertar datos en la tabla de reportes_columnas */
	insertaDatosTablaReportesColunas() {
		let pais = `insert into reportes_columnas(
				reporte_id, nombre_columna) values(?, ?)`
		this.db.executeSql(pais, ['1', 'pais'])
			.then(() => console.log('regustros insertados en tabla reportes columnas'))
			.catch(e => console.log(e))

		let anio = `insert into reportes_columnas(
				reporte_id, nombre_columna) values(?, ?)`
		this.db.executeSql(anio, ['2', 'anio'])
			.then(() => console.log('regustros insertados en tabla reportes columnas'))
			.catch(e => console.log(e))

		let gerencia = `insert into reportes_columnas(
				reporte_id, nombre_columna) values(?, ?)`
		this.db.executeSql(gerencia, ['3', 'gerencia'])
			.then(() => console.log('regustros insertados en tabla reportes columnas'))
			.catch(e => console.log(e))

		let cliente = `insert into reportes_columnas(
				reporte_id, nombre_columna) values(?, ?)`
		this.db.executeSql(cliente, ['4', 'contratante'])
			.then(() => console.log('regustros insertados en tabla reportes columnas'))
			.catch(e => console.log(e))

		let producto = `insert into reportes_columnas(
				reporte_id, nombre_columna) values(?, ?)`
		this.db.executeSql(producto, ['5', 'producto'])
			.then(() => console.log('regustros insertados en tabla reportes columnas'))
			.catch(e => console.log(e))

	}

	/* Funcion para insertar datos en la tabla de reportes_filtros */
	insertaDatosTablaReportesFiltros() {
		let sql = `insert into reportes_filtros(
				reporte_id, nombre_columna, valor) values(?, ?, ?)`
		return this.db.executeSql(sql, ['1', 'anio', '2017'])
			.then(() => console.log('regustros insertados en tabla reportes filtros'))
			.catch(e => console.log(e))
	}

	/* Funcion para insertar datos en la tabla de reportes_agrupacion */
	insertaDatosTablaReportesAgrupacion() {
		let pais = `insert into reportes_agrupacion(
				reporte_id, nombre_columna, orden_agrupacion) values(?, ?, ?)`
		this.db.executeSql(pais, ['1', 'pais', '1'])
			.then(() => console.log('regustros insertados en tabla reportes agrupacion'))
			.catch(e => console.log(e))

		let anio = `insert into reportes_agrupacion(
				reporte_id, nombre_columna, orden_agrupacion) values(?, ?, ?)`
		this.db.executeSql(anio, ['2', 'anio', '1'])
			.then(() => console.log('regustros insertados en tabla reportes agrupacion'))
			.catch(e => console.log(e))

		let gerencia = `insert into reportes_agrupacion(
				reporte_id, nombre_columna, orden_agrupacion) values(?, ?, ?)`
		this.db.executeSql(gerencia, ['3', 'gerencia', '1'])
			.then(() => console.log('regustros insertados en tabla reportes agrupacion'))
			.catch(e => console.log(e))

		let cliente = `insert into reportes_agrupacion(
				reporte_id, nombre_columna, orden_agrupacion) values(?, ?, ?)`
		this.db.executeSql(cliente, ['4', 'contratante', '1'])
			.then(() => console.log('regustros insertados en tabla reportes agrupacion'))
			.catch(e => console.log(e))

		let producto = `insert into reportes_agrupacion(
				reporte_id, nombre_columna, orden_agrupacion) values(?, ?, ?)`
		this.db.executeSql(producto, ['5', 'producto', '1'])
			.then(() => console.log('regustros insertados en tabla reportes agrupacion'))
			.catch(e => console.log(e))
	}


	delete() {
		let anio = `drop table reportes`
		this.db.executeSql(anio, {})
			.then(() => console.log('deleted'))
			.catch(e => console.log(e))

		let rc = `drop table reportes_columnas`
		this.db.executeSql(rc, {})
			.then(() => console.log('deleted'))
			.catch(e => console.log(e))

		let rf = `drop table reportes_filtros`
		this.db.executeSql(rf, {})
			.then(() => console.log('deleted'))
			.catch(e => console.log(e))

		let ra = `drop table reportes_agrupacion`
		this.db.executeSql(ra, {})
			.then(() => console.log('deleted'))
			.catch(e => console.log(e))
	}

	/*Funcion para conseguir la informacion para construir la grafica. */
	paraGraficar = (columnas, agrupacion, where): any => {
		let data_grafica = {}
			let sql = `select ` + columnas + ` as campo , count(*) as numero_proyectos, sum(monto) as monto,
						(select count(*) from proyectos) as total
						FROM proyectos
						where ` + agrupacion + ` in ('` + where  + `')` + ` group by ` + agrupacion + ` order by ` + agrupacion + ` asc`

			this.db.executeSql(sql, {})
				.then((response) => {
					for (let index = 0; index < response.rows.length; index++) {
						data_grafica['campo'] = response.rows.item(index).campo
						data_grafica['numero_proyectos'] = response.rows.item(index).numero_proyectos
						data_grafica['monto'] = parseInt(response.rows.item(index).monto)
						data_grafica['total'] = response.rows.item(index).total
						data_grafica['porcentaje']  = account.toFixed((response.rows.item(index).numero_proyectos / response.rows.item(index).total) * 100, 2)
						
					}
				})
				console.log('data_grafica db')
				
				console.log(data_grafica)
				
			return data_grafica
		}
}