import {
	Injectable
} from '@angular/core'
import {
	SQLiteObject
} from '@ionic-native/sqlite'

import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@Injectable()
	/* Clase para el manejo de los reportes. */
export class ReportesDbService {

	db: SQLiteObject = null

	constructor() {}

	/* Funcion que inisializa la base de datos para los reportes. */
	initDb(db: SQLiteObject) {
		this.db = db
	}

	/* Funcion para la consulta de los reportes. */
	getReportes = (): any => {
		let reportes = []
		let sql = `select * from reportes`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					reportes.push({
						'id': response.rows.item(index).id,
						'nombre_reporte': response.rows.item(index).nombre_reporte,
						'total_proyectos': parseInt(response.rows.item(index).total_proyectos),
						'total_usd': account.formatNumber(response.rows.item(index).total_usd),
					})
				}
				return Promise.resolve(reportes)
			})
	}

	/* Funcion para obtener la agrupacion de un detalle de reporte a consultar. */
	obtenerAgrupacionDetalle = (id: number): any => {
		let agrupaciones = []
		let agrupacion = `select nombre_columna from reportes_agrupacion where reporte_id = ` + id
		return this.db.executeSql(agrupacion, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					agrupaciones.push({
						'nombre_columna': response.rows.item(index).nombre_columna,
					})
				}
				return Promise.resolve(agrupaciones)
			})
	}

	/* Funcion para obtener las columans de select de un detalle de reporte a consultar. */
	obtenerCamposDetalle = (id: number): any => {
		let campos_select = []
		let select = `select nombre_columna from reportes_columnas where reporte_id = ` + id
		return this.db.executeSql(select, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					campos_select.push({
						'nombre_columna': response.rows.item(index).nombre_columna,
					})
				}
				return Promise.resolve(campos_select)
			})
	}


	/* Funcion para la consulta del detalle de reportes. */
	detalleReporte = (campo: string, group_by: string): any => {
		let reportes = []
		let sql = `select ` + campo + ` as campo, count(*) as numero_proyectos, sum(monto) as monto,
					(select count(*) from proyectos) as total
					FROM proyectos
					group by ` + group_by + ` order by ` + campo + ` asc`

		console.log(sql)
		
		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					reportes.push({
						'campo': response.rows.item(index).campo,
						'numero_proyectos': response.rows.item(index).numero_proyectos,
						'monto': parseInt(response.rows.item(index).monto),
						'total': response.rows.item(index).total,
						'group_by': group_by,
						'porcentaje': account.toFixed((response.rows.item(index).numero_proyectos / response.rows.item(index).total) * 100, 2)
					})
				}
				return Promise.resolve(reportes)
			})
	}


	/* Funcion para traer las columnas. */
	getColumnas = (): any => {
		let columnas = []
		let sql = `PRAGMA table_info('proyectos')`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					columnas.push(
						response.rows.item(index).name
					)
				}
				return Promise.resolve(columnas)
			})
	}

	/* Funcion para obtener los datos de las columnas que se selecciono en los filtros para el grid. */
	obtenerDataCampos = (columnas): any => {
			let campos_data = []
			let columns = collect(columnas).implode(',')

			let select = 'select ' + columns + ' from proyectos order by anio'

			return this.db.executeSql(select, {})
				.then((response) => {
					for (let index = 0; index < response.rows.length; index++) {
						campos_data.push(
							response.rows.item(index),
						)
					}
					return Promise.resolve(campos_data)
				})
				.catch(console.error.bind(console))
		}
		/*Funcion para conseguir la informacion para construir la grafica. */
	paraGraficar = (columnas: Array < any > , agrupacion: Array < any > ) => {
		let mis_columnas = collect(columnas).implode('items', ',')
	
		let data_grafica = []
		let mi_agrupacion = agrupacion[0].items

		let sql = `select ` + mis_columnas + `, count(*) as numero_proyectos, sum(monto) as monto,
					(select count(*) from proyectos) as total
					FROM proyectos
					group by ` + mi_agrupacion + ` order by ` + mi_agrupacion + ` asc`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					data_grafica.push({
						'data': response.rows.item(index),
					})
				}
				return Promise.resolve(data_grafica)
			})
	}

	/* Funcion para obtener la data para registrar un reporte. */
	paraGuardarReporte = (agrupacion: string) => {
		let data = []
		let sql = `select sum(monto) as monto,
					count(*) as numero_proyectos
					FROM proyectos
					group by ` + agrupacion + ``

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					data.push({
						'monto': response.rows.item(index).monto,
						'numero_proyectos': response.rows.item(index).numero_proyectos,
					})
				}
				return Promise.resolve(data)
			})
	}

	/* Funcion para guardar un reporte. */
	saveReporte = (title: string, monto_total: number, numero_proyectos: number): any => {
		let array_id = []

		let insert = `insert into reportes(
				nombre_reporte, total_usd, total_proyectos) values(?, ?, ?)`
		this.db.executeSql(insert, [title, monto_total, numero_proyectos])
			.then(() => console.log('nuevo reporte insertado'))
			.catch(e => console.log(e))

		let last_id = `SELECT max(id) as id from reportes`
		return this.db.executeSql(last_id, {})
			.then(response => {
				let id: number
				for (let index = 0; index < response.rows.length; index++) {
					array_id.push({
						'id': response.rows.item(index).id
					})
				}
				return Promise.resolve(array_id)
			})
	}

	/* Funcion para insertar en reportes agrupacion*/
	insertarReporteAgrupado = (id: number, agrupacion: string): any => {
		let success: number = 0
		let insert_grupado = `insert into reportes_agrupacion(
				reporte_id, nombre_columna, orden_agrupacion) values(?, ?, ?)`

		return this.db.executeSql(insert_grupado, [id, agrupacion, '1'])
			// .then(() =>
			// 	console.log('regustros insertados en tabla reportes agrupacion de nuevo reporte'),
			// 	// this.insertReporteColumnas(id, agrupacion)
			// )
			// .catch(e => console.log(e))
		// success = 1
		// return success
	}

	/* Funcion para insertar e reportes columans*/
	insertReporteColumnas = (id: number, agrupacion: string): any => {
		let insert_grupado = `insert into reportes_columnas(
				reporte_id, nombre_columna) values(?, ?)`

		return this.db.executeSql(insert_grupado, [id, agrupacion])
			// .then(() => console.log('regustros insertados en tabla reportes columnas de nuevo reporte'))
			// .catch(e => console.log(e))
	}

	/* Funcion consultar el detalle de un reporte dado a un campo. */
	consultaXCampoAgrupado = (campo: string, groupBy: string): any => {
		console.log('mi campo' + campo)
		
		let proyectos = []
		let sql = 'select * from proyectos where '+ groupBy +' = ' + "'"  + campo + "'"
		console.log(sql)
		
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
	/* Objeto para construir  la grafica de barras agruapdos. */
	datosGraficaAgrupados = (xy: Array < any > , intervalo: number, categorias: any, title_name: string): Object => {
			let options = {
					chart: {
						type: 'column'
					},
					title: {
						text: 'Monthly Average Rainfall'
					},
					subtitle: {
						text: 'Source: WorldClimate.com'
					},
					xAxis: {
						categories: categorias,
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: 'Rainfall (mm)'
						}
					},
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
							'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: [{
						name: 'Tokyo',
						data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

					}, {
						name: 'New York',
						data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

					}, {
						name: 'London',
						data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

					}, {
						name: 'Berlin',
						data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

					}]
				}

		return options
	}
		/* Objeto para construir  la grafica de barras. */
	datosGrafica = (xy: Array < any > , intervalo: number, serie_name: string, title_name: string): Object => {
		let options = {
			chart: {
				type: 'column',
				// width: 600,
				// height: 350
			},
			title: {
				text: title_name
			},
			xAxis: {
				type: 'category'
			},
			yAxis: [{
				className: 'highcharts-color-0',
				tickInterval: intervalo,
				labels: {
					// x: -15,
					formatter: function() {
						return this.value + ' %';
					}
				},
				title: {
					text: 'Porcentaje total de participación'
				}
			}],
			legend: {
				enabled: false
			},
			plotOptions: {
				series: {
					borderWidth: 0,
					dataLabels: {
						enabled: true,
						format: '{point.y:.1f}%'
					}
				}
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
				pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> del total<br/>'
			},

			series: [{
				name: serie_name,
				// colorByPoint: true,
				data: [],
			}],
			responsive: {
				rules: [{
					condition: {
						maxWidth: 500
					},
					title: {
						text: 'responsive'
					},
					xAxis: {
						type: 'category'
					},
					// Make the labels less space demanding on mobile
					chartOptions: {
						xAxis: {
							labels: {
								formatter: function() {
									return this.value.charAt(0)
								}
							}
						},
						yAxis: {
							className: 'highcharts-color-0',
							labels: {
								align: 'left',
								x: 0,
								y: -2
							},
							title: {
								text: 'Porcentaje total de participación'
							}
						}
					}
				}]
			}
		}
		options['series'][0].data = xy
		return options
	}
}