import { Injectable } from '@angular/core'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'
import { PROYECTOS } from '../services/mocks/proyectos'
import { Proyecto } from '../interfaces/proyecto'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@Injectable()
/* Clase para el manejo de los reportes. */
export class ReportesDbService {

	db: SQLiteObject = null

	constructor() {
	}

	/* Funcion que inisializa la base de datos para los reportes. */
	initDb(db: SQLiteObject) {
		this.db = db
	}

	/* Funcion para la consulta de reporte por año. */
	reporteXanio = (campo: string, group_by: string): any => {
		let reporteAnio = []
		let sql = `select `+ campo + ` , count(*) as numero_proyectos, sum(monto) as monto,
					(select count(*) from proyectos) as total
					FROM proyectos
					group by ` + group_by + ` order by anio desc`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					reporteAnio.push({
						'anio': response.rows.item(index).anio,
						'numero_proyectos': response.rows.item(index).numero_proyectos,
						'monto': parseInt(response.rows.item(index).monto),
						'total': response.rows.item(index).total,
						'porcentaje': account.toFixed((response.rows.item(index).numero_proyectos / response.rows.item(index).total) * 100, 2)

					})
				}

				return Promise.resolve(reporteAnio)
			})
	}

	/* Funcion para la consulta de los reportes. */
	getReportes = (campo: string, group_by: string): any => {
		let reporteAnio = []
		let sql = `select * from reportes`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					console.log(response.rows.item(index))
					// reporteAnio.push({
					// 	'anio': response.rows.item(index).anio,
					// 	'numero_proyectos': response.rows.item(index).numero_proyectos,
					// 	'monto': parseInt(response.rows.item(index).monto),
					// 	'total': response.rows.item(index).total,
					// 	'porcentaje': account.toFixed((response.rows.item(index).numero_proyectos / response.rows.item(index).total) * 100, 2)

					// })
				}

				return Promise.resolve(reporteAnio)
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

	/* Objeto para construir  la grafica de barras. */
	datosGrafica = (xy: Array<any>, intervalo: number, serie_name: string, title_name: string): Object => {
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