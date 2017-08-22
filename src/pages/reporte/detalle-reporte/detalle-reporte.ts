import { Component, NgZone, EventEmitter, Input, Output } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { ProyectosAgrupadosPage } from '../../estadistica/proyectos-agrupados/proyectos-agrupados'
import { ProyectosAgrupadosAnioPage } from '../../estadistica/proyectos-agrupados/por-anio/proyectos-agrupados-anio'
import { ProyectosAgrupadosClientePage } from '../../estadistica/proyectos-agrupados/por-cliente/proyectos-agrupados-cliente'
import { ProyectosAgrupadosGerenciaPage } from '../../estadistica/proyectos-agrupados/por-gerencia/proyectos-agrupados-gerencia'
import { DbService } from '../../../services/db.service'
import { ProyectosAgrupadosClienteMenoresPage } from '../../estadistica/proyectos-agrupados/por-cliente/por-cliente-menores/proyectos-agrupados-cliente-menores'


@IonicPage()
@Component({
	selector: 'page-detalle-reporte',
	templateUrl: 'detalle-reporte.html',
})
export class DetalleReportePage {
	campo_agrupacion: string = ''
	campo_select: string = ''
	xy = []
	options: Object
	monto_total: string = ''
	total_proyectos: number
	proyectos = []
	id: number = 0
	proyectos_agrupados = []
	proyectos_agrupados_detalle = []

	visible: boolean = false

	@Output() open: EventEmitter < any > = new EventEmitter();
	@Output() close: EventEmitter < any > = new EventEmitter();

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService : ReportesDbService, private dbService: DbService, public zone: NgZone) {
		this.id = navParams.get('id')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DetalleReportePage')
		// this.getReporteDetalle()
		this.getAgrupacion()
	}

	/* Funcion para obtener la agrupacion y campos del select del reporte a consultar. */
	getAgrupacion = (): void => {
		this.reporteService.obtenerAgrupacionDetalle(this.id)
		.then(response => {
			let agrupacion = collect(response)
			this.campo_agrupacion = agrupacion.implode('nombre_columna', ',')
		})
		.then(() => this.reporteService.obtenerCamposDetalle(this.id)
			.then(response => {
				let campos = collect(response)
				this.campo_select = campos.implode('nombre_columna', ',')
			})
		).then(() => this.getReporteDetalle())
	}

	/* Funcion para reporte por año. */
	getReporteDetalle = (): void => {
		// this.visible = false
		// this.visible = !this.visible
		// console.log(this.visible)
		
		if(this.campo_agrupacion === 'contratante') {
			this.visible = !this.visible
			// if (this.visible) {
			// 	this.open.emit(null);
			// } else {
			// 	this.close.emit(null);
			// }
			let data_cliente = []

			this.dbService.openDatabase()
			.then(() => this.dbService.consultaXCliente())
			.then(response => {
				this.zone.run(() => {
					let data = collect(response)

					/* monto total de todos los proyectos. */
					let monto_total = data.sum('monto')

					/* Agrupo mi data por contratante. */
					let agrupados = data.groupBy('contratante').toArray()

					let datos = agrupados.map(function(contratante, monto) {
						let num_proyectos = contratante.length
						let suma_montos = contratante.reduce(function(index, proyecto) {
							return index + parseInt(proyecto.monto)
						}, 0)

						return {
							id: contratante[0].id,
							contratante: contratante[0].contratante,
							suma_monto: suma_montos,
							porcentaje: parseFloat(((suma_montos / monto_total) * 100).toFixed(2)),
							numero_proyectos: num_proyectos
						}
					})
					/* Ordeno por porcentaje de mayor a menor. */
					let ordenados = collect(datos).sortByDesc('porcentaje')

					/* Clasifico los proyectos por porcentaje mayor a 1 y menores de 1. */
					let mayores_de_uno = ordenados.where('porcentaje', '>', 1)
					let menores_de_uno = ordenados.where('porcentaje', '<', 1)

					/* Suma de los montos y porcentajes de porcentaje  menores de 1. */
					let suma_montos_menores_de_uno = menores_de_uno.sum('suma_monto')
					let suma_porcentajes_menores_de_uno = menores_de_uno.sum('porcentaje').toFixed(2)
					mayores_de_uno.toArray()

					/* Consigo el porcentaje y cliente para formar mi grafica. */
					this.xy.splice(0, this.xy.length)
					mayores_de_uno.map(function(contratante, monto) {
						data_cliente.push({
							name: contratante.contratante,
							y: parseFloat(contratante.porcentaje)
						})
					})
					this.xy = data_cliente
					this.options = this.reporteService.datosGrafica(this.xy, 10, 'Clientes', 'Proyectos agrupados por clientes')

					/* Para mostrar la tabla de informacion */
					this.monto_total = account.formatNumber(data.sum('monto'))
					this.total_proyectos = response.length

					let proyectos = mayores_de_uno.map(function(item) {
						return {
							'campo': item.contratante,
							'porcentaje': item.porcentaje,
							'monto': account.formatNumber(item.suma_monto),
							'numero_proyectos': item.numero_proyectos,
							'group_by': 'contratante',
						}
					})

					this.proyectos = proyectos
					// this.dataCirular = response
					this.proyectosAgrupados(menores_de_uno, suma_porcentajes_menores_de_uno)
				})
			})
		}

		this.reporteService.detalleReporte(this.campo_select, this.campo_agrupacion)
			.then(response => {
				// Para mostrar la informacion de la grafica.
				this.xy.splice(0, this.xy.length)
				response.forEach(item => {
					this.xy.push({
						name: item.campo,
						y: parseFloat(item.porcentaje)
					})

				})
				this.options = this.reporteService.datosGrafica(this.xy, 2, '', 'Proyectos agrupados por ' + this.campo_agrupacion)

				/* Para mostrar la tabla de informacion */
				const collection = collect(response)
				this.monto_total = account.formatNumber(collection.sum('monto'))
				this.total_proyectos = collection.sum('numero_proyectos')

				let proyectos = collection.map(function(item) {
					return {
						'campo': item.campo,
						'porcentaje': item.porcentaje,
						'monto': account.formatNumber(item.monto),
						'numero_proyectos': item.numero_proyectos,
						'group_by': item.group_by,
					}
				})
				this.proyectos = proyectos
				console.log(this.proyectos)
			})
	}

	/* Funcion para ver detalle de los proyectos agrupados que tienen menos de 1 %. */
	verProyectosAgrupadosClientePorcentajeMenosAUno = (monto_total: string): void => {
		let proyectos = this.proyectos_agrupados_detalle.map(function(item) {
			return {
				'id': item.id,
				'contratante': item.contratante,
				'porcentaje': item.porcentaje,
				'monto': account.formatNumber(item.suma_monto),
				'numero_proyectos': item.numero_proyectos
			}
		})

		this.navCtrl.push(ProyectosAgrupadosClienteMenoresPage, {
			'proyectos_agrupados_detalle': proyectos,
			'monto_total': monto_total
		})
	}
	/* Funcion para visualizar los proyectos agrupados por contratante. */
	verProyectosAgrupadosCliente = (contratante: string, monto_total: string): void => {
		this.navCtrl.push(ProyectosAgrupadosClientePage, {
			'contratante': contratante,
			'monto_total': monto_total
		})
	}

	/* Funcion para los proyectos que tienen menos de 1 porcentaje. */
	async proyectosAgrupados(menores_de_uno, suma_porcentajes_menores_de_uno) {
		/* Para mostras la informacion agrupada con los proyectos menores del 1 %. */
		/* Consigo el porcentaje y cliente para formar mi grafica. */
		this.xy.push({
			name: 'Proyectos agrupados',
			y: parseFloat(suma_porcentajes_menores_de_uno)
		})

		/* Construyo la informacion para mi tablero. */
		this.proyectos_agrupados['suma_montos_menores_de_uno'] = account.formatNumber(menores_de_uno.sum('suma_monto'))
		this.proyectos_agrupados['porcentaje'] = suma_porcentajes_menores_de_uno
		this.proyectos_agrupados['numero_proyectos'] = menores_de_uno.count()

		this.proyectos_agrupados_detalle = menores_de_uno
	}


	/* Funcion para ver el detalle de los proyectos segun la opcion que se escoja. */
	verProyectosAgrupados = (group_by: string, campo: string, monto_total: string): void => {
		if(group_by === 'pais') {
			console.log(group_by)
			
			this.navCtrl.push(ProyectosAgrupadosPage, {
				'pais': campo,
				'monto_total': monto_total
			})
		}
		if(group_by === 'anio') {
			console.log(group_by)
			
			this.navCtrl.push(ProyectosAgrupadosAnioPage, {
				'anio': campo,
				'monto_total': monto_total
			})
		}
		if(group_by === 'gerencia') {
			console.log(group_by)
			
			this.navCtrl.push(ProyectosAgrupadosGerenciaPage, {
				'gerencia': campo,
				'monto_total': monto_total
			})
		}
		if(group_by === 'contratante') {
			console.log(group_by)
			this.verProyectosAgrupadosCliente(campo, monto_total)
		}
	}
}
