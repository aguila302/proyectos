import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { ProyectosAgrupadosPage } from '../../estadistica/proyectos-agrupados/proyectos-agrupados'
import { ProyectosAgrupadosAnioPage } from '../../estadistica/proyectos-agrupados/por-anio/proyectos-agrupados-anio'
import { ProyectosAgrupadosClientePage } from '../../estadistica/proyectos-agrupados/por-cliente/proyectos-agrupados-cliente'
import { ProyectosAgrupadosGerenciaPage } from '../../estadistica/proyectos-agrupados/por-gerencia/proyectos-agrupados-gerencia'


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

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService : ReportesDbService) {
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
	}
}
