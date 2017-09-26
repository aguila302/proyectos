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
	resultado = []

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
		let insert_grupado = `insert into reportes_agrupacion(
				reporte_id, nombre_columna, orden_agrupacion) values(?, ?, ?)`

		return this.db.executeSql(insert_grupado, [id, agrupacion, '1'])
	}

	/* Funcion para insertar e reportes columans*/
	insertReporteColumnas = (id: number, agrupacion: string): any => {
		let insert_grupado = `insert into reportes_columnas(
				reporte_id, nombre_columna) values(?, ?)`

		return this.db.executeSql(insert_grupado, [id, agrupacion])
	}

	/* Funcion consultar el detalle de un reporte dado a un campo. */
	consultaXCampoAgrupado = (campo: string, groupBy: string): any => {
		let proyectos = []
		let sql = 'select * from proyectos where ' + groupBy + ' = ' + "'" + campo + "'"

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

	/* Funcion para obtener los distintos valores de agruapcion. */
	selectDistinct = (agrupacion: string): any => {
		let reportes = []
		let sql = 'select distinct(' + agrupacion + ') as registros from proyectos order by ' + agrupacion + ' desc'

		return this.db.executeSql(sql, {})
			.then((response) => {
				for (let index = 0; index < response.rows.length; index++) {
					reportes.push({
						'registros': response.rows.item(index).registros,
					})
				}
				return reportes
			})
	}

	/*Funcion para conseguir la informacion para construir la grafica. */
	paraGraficar = (columnas, agrupacion, where): any => {
		let sql = `select ` + columnas + ` as campo , count(*) as numero_proyectos, sum(monto) as monto,
						(select count(*) from proyectos) as total, sum(monto) as monto_filtrado
						FROM proyectos
						where ` + agrupacion + ` in ('` + where + `')` + ` group by ` + agrupacion + ` order by ` + agrupacion + ` asc`

		return this.db.executeSql(sql, {})
	}

	/* Funcion para ver el detalle para el grupo monto total. */
	detallePorMontoTotal = (select, groupBY): any => {
		let reportes = []

		let sql = `select ` + select + ` as campo , count(*) as numero_proyectos, sum(monto) as monto,
						(select sum(monto) from proyectos) as monto_total
						FROM proyectos group by ` + groupBY + ` order by ` + groupBY + ` asc`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					reportes.push({
						'campo': response.rows.item(index).campo,
						'monto': response.rows.item(index).monto,
						'monto_total': response.rows.item(index).monto_total,
						'numero_proyectos': response.rows.item(index).numero_proyectos,
						'porcentaje': account.toFixed((response.rows.item(index).monto / response.rows.item(index).monto_total) * 100, 2)
					})
				}
				return Promise.resolve(reportes)
			})
	}

	/* Funcion para ver el detalle para el grupo numero de proyectos. */
	detallePorNumeroProyectos = (select, groupBY): any => {
		let reportes = []

		let sql = `select ` + select + ` as campo , count(*) as numero_proyectos, sum(monto) as monto,
						(select count(*) from proyectos) as total_proyectos
						FROM proyectos group by ` + groupBY + ` order by ` + groupBY + ` asc`
		console.log(sql)
		
		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					reportes.push({
						'campo': response.rows.item(index).campo,
						'monto': response.rows.item(index).monto,
						'total_proyectos': response.rows.item(index).total_proyectos,
						'numero_proyectos': response.rows.item(index).numero_proyectos,
						'porcentaje': account.toFixed((response.rows.item(index).numero_proyectos / response.rows.item(index).total_proyectos) * 100, 2)
					})
				}
				return Promise.resolve(reportes)
			})
	}

	/* Funcion para obtener el reporte de direccion. */
	reportePorDireccion = () => {


		let reportes = []
		let sql = `select proyectos.unidad_negocio,
					 	 cast(count(case when proyectos.anio = 1985 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1985],
						 cast(count(case when proyectos.anio = 1986 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1986],
						 cast(count(case when proyectos.anio = 1987 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1987],
						 cast(count(case when proyectos.anio = 1988 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1988],
						 cast(count(case when proyectos.anio = 1989 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1989],
						 cast(count(case when proyectos.anio = 1990 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1990],
						 cast(count(case when proyectos.anio = 1991 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1991],
						 cast(count(case when proyectos.anio = 1992 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1992],
						 cast(count(case when proyectos.anio = 1993 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1993],
						 cast(count(case when proyectos.anio = 1994 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1994],
						 cast(count(case when proyectos.anio = 1995 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1995],
						 cast(count(case when proyectos.anio = 1996 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1996],
						 cast(count(case when proyectos.anio = 1997 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1997],
						 cast(count(case when proyectos.anio = 1998 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1998],
						 cast(count(case when proyectos.anio = 1999 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [1999],
						 cast(count(case when proyectos.anio = 2000 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2000],
						 cast(count(case when proyectos.anio = 2001 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2001],
						 cast(count(case when proyectos.anio = 2002 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2002],
						 cast(count(case when proyectos.anio = 2003 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2003],
						 cast(count(case when proyectos.anio = 2004 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2004],
						 cast(count(case when proyectos.anio = 2005 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2005],
						 cast(count(case when proyectos.anio = 2006 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2006],
						 cast(count(case when proyectos.anio = 2007 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2007],
						 cast(count(case when proyectos.anio = 2008 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2008],
						 cast(count(case when proyectos.anio = 2009 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2009],
						 cast(count(case when proyectos.anio = 2010 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2010],
						 cast(count(case when proyectos.anio = 2011 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2011],
						 cast(count(case when proyectos.anio = 2012 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2012],
						 cast(count(case when proyectos.anio = 2013 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2013],
						 cast(count(case when proyectos.anio = 2014 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2014],
						 cast(count(case when proyectos.anio = 2015 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2015],
						 cast(count(case when proyectos.anio = 2016 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2016],
						 cast(count(case when proyectos.anio = 2017 then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [2017]
					 from proyectos
					LEFT OUTER JOIN anios ON (proyectos.anio = anios.anio)
 					group by proyectos.unidad_negocio`

		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					reportes.push({
						'unidad_negocio': response.rows.item(index).unidad_negocio,
						'1985': response.rows.item(index)[1985],
						'1986': response.rows.item(index)[1986],
						'1987': response.rows.item(index)[1987],
						'1988': response.rows.item(index)[1988],
						'1989': response.rows.item(index)[1989],
						'1990': response.rows.item(index)[1990],
						'1991': response.rows.item(index)[1991],
						'1992': response.rows.item(index)[1992],
						'1993': response.rows.item(index)[1993],
						'1994': response.rows.item(index)[1994],
						'1995': response.rows.item(index)[1995],
						'1996': response.rows.item(index)[1996],
						'1997': response.rows.item(index)[1997],
						'1998': response.rows.item(index)[1998],
						'1999': response.rows.item(index)[1999],
						'2000': response.rows.item(index)[2000],
						'2001': response.rows.item(index)[2001],
						'2002': response.rows.item(index)[2002],
						'2003': response.rows.item(index)[2003],
						'2004': response.rows.item(index)[2004],
						'2005': response.rows.item(index)[2005],
						'2006': response.rows.item(index)[2006],
						'2007': response.rows.item(index)[2007],
						'2008': response.rows.item(index)[2008],
						'2009': response.rows.item(index)[2009],
						'2010': response.rows.item(index)[2010],
						'2011': response.rows.item(index)[2011],
						'2012': response.rows.item(index)[2012],
						'2013': response.rows.item(index)[2013],
						'2014': response.rows.item(index)[2014],
						'2015': response.rows.item(index)[2015],
						'2016': response.rows.item(index)[2016],
						'2017': response.rows.item(index)[2017],
					})
				}
				return Promise.resolve(reportes)
			})
			.catch(console.error.bind(console))
	}

	/* Funcion para obtener tabla informativa del reporte por direccion con años. */
	reportePorDireccionTAbla = () => {
		let reportes = []
		let sql = `select proyectos.anio, sum(proyectos.monto) as monto, count(*) as numero_proyectos,
						 cast( count(*) as double )/(select count(*) from proyectos)*100 as porcentaje,
					 	 cast(count(case when proyectos.unidad_negocio = 'Consultoría' then proyectos.unidad_negocio end) as double)/1330*100 as [Consultoría],
						 cast(count(case when proyectos.unidad_negocio = 'Desarrollo de sistemas' then proyectos.unidad_negocio end) as double)/1330*100 as [Desarrollo de sistemas],
						 cast(count(case when proyectos.unidad_negocio = 'Ingeniería' then proyectos.unidad_negocio end) as double)/1330*100 as [Ingeniería],
						 cast(count(case when proyectos.unidad_negocio = 'Sin dato' then proyectos.unidad_negocio end) as double)/1330*100 as [Sin dato],
						 cast(count(case when proyectos.unidad_negocio = 'Sin datobonus' then proyectos.unidad_negocio end) as double)/1330*100 as [Sin datobonus],
						 cast(count(case when proyectos.unidad_negocio = 'Suramérica' then proyectos.unidad_negocio end) as double)/1330*100 as [Suramérica]
					 from proyectos
					LEFT OUTER JOIN anios ON (proyectos.anio = anios.anio)
 					group by proyectos.anio`
 		return this.db.executeSql(sql, {})
			.then(response => {
				for (let index = 0; index < response.rows.length; index++) {
					reportes.push({
						'anio': response.rows.item(index).anio,
						'monto': response.rows.item(index).monto,
						'numero_proyectos': response.rows.item(index).numero_proyectos,
						'porcentaje': response.rows.item(index).porcentaje,
						'Consultoría': response.rows.item(index)['Suramérica'],
						'Desarrollo de sistemas': response.rows.item(index)['Desarrollo de sistemas'],
						'Ingeniería': response.rows.item(index)['Ingeniería'],
						'Sin dato': response.rows.item(index)['Sin dato'],
						'Sin datobonus': response.rows.item(index)['Sin datobonus'],
						'Suramérica': response.rows.item(index)['Suramérica'],
					})
				}
				return Promise.resolve(reportes)
			})
			.catch(console.error.bind(console));
	}

	/* Funcion para filtrar el reporte de direccion con anios. */
	filtrarReporteDireccionAnio(where) {
		let cadena:string = ''
		
		// var resultado = []
		var con: number = 1
		for(let index in where) {
			cadena += `cast(count(case when proyectos.anio = ` + where[index] + ` then proyectos.anio end) as double)/(select count(*) from proyectos)*100 as [`+ con +`],`
			con ++
		}
		cadena = cadena.slice(0, -1)
		var miglobal = this

			let sql = `select proyectos.unidad_negocio, ` + cadena +
					` from proyectos
					LEFT OUTER JOIN anios ON(proyectos.anio = anios.anio)
					group by proyectos.unidad_negocio order by proyectos.unidad_negocio asc`

			console.log(sql)
			return this.db.executeSql(sql, {})
			// .then(response => {
			// 	// for(let index in where) {
			// 		for (var i = 0; i < response.rows.length; i++) {
			// 			// console.log(where[i])
			// 			miglobal.resultado.push(response.rows.item(i))

			// 		// }
			// 	}
			// })
				
		// // }
		// console.log(miglobal.resultado)
		// return miglobal.resultado
	}

	/* Objeto para construir  la grafica de barras. */
	datosGrafica = (xy: Array < any > , intervalo: number, serie_name: string, title_name: string): Object => {
		let options = {
			chart: {
				type: 'column',
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

	/* Objeto para construir  la grafica de barras. */
	datosGraficaGrupoNumeroProyecto = (xy: Array < any > , intervalo: number, serie_name: string, title_name: string): Object => {
		let options = {
			chart: {
				type: 'column',
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
					formatter: function() {
						return this.value + '';
					}
				},
				title: {
					text: 'Participación en total de proyectos'
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
						format: '{point.y:.1f}'
					}
				}
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
				pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> del total<br/>'
			},

			series: [{
				name: serie_name,
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
								text: 'Participación en total de proyectos'
							}
						}
					}
				}]
			}
		}
		options['series'][0].data = xy
		return options
	}

	graficaDireccionAnios = (categorias, serie): Object => {
		let options = {
				chart: {
					type: 'column'
				},
				title: {
					text: 'Reporte de direcciones'
				},
				subtitle: {
					text: 'Direcciones agrupados por años'
				},
				xAxis: {
					categories: categorias,
					crosshair: true
				},
				yAxis: {
					min: 0,
					title: {
						text: 'Porcentaje total de participación'
					}
				},
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
					pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
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
				series: serie
				}
		return options
	}
}