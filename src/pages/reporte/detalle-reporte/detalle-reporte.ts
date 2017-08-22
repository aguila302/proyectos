import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@IonicPage()
@Component({
	selector: 'page-detalle-reporte',
	templateUrl: 'detalle-reporte.html',
})
export class DetalleReportePage {
	campo: string = ''
	group_by: string = ''
	xy = []
	options: Object
	monto_total: string = ''
	total_proyectos: number
	proyectos = []

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteServive : ReportesDbService) {
		this.campo = 'anio'
		this.group_by = 'anio'
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DetalleReportePage');
		this.getReporteDetalle()
	}

	/* Funcion para reporte por año. */
	getReporteDetalle = (): void => {
		this.reporteServive.detalleReporte(this.campo, this.group_by)
			.then(response => {
				// Para mostrar la informacion de la grafica. 
				this.xy.splice(0, this.xy.length)
				response.forEach(item => {
					this.xy.push({
						name: item.anio,
						y: parseFloat(item.porcentaje)
					})
				})
				this.options = this.reporteServive.datosGrafica(this.xy, 2, 'Años', 'Proyectos agrupados por año')

				/* Para mostrar la tabla de informacion */
				const collection = collect(response)
				this.monto_total = account.formatNumber(collection.sum('monto'))
				this.total_proyectos = collection.sum('numero_proyectos')

				let proyectos = collection.map(function(item) {
					return {
						'anio': item.anio,
						'porcentaje': item.porcentaje,
						'monto': account.formatNumber(item.monto),
						'numero_proyectos': item.numero_proyectos
					}
				})
				this.proyectos = proyectos
			})
	}
}
