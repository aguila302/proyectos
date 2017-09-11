import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportesDbService } from '../../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { DetalleReporteAgrupadoPage } from '../../../reporte/detalle-reporte/detalle-reporte-agrupado/detalle-reporte-agrupado'

@IonicPage()
@Component({
	selector: 'page-grafica-filtrada',
	templateUrl: 'grafica-filtrada.html',
})

export class GraficaFiltradaPage {
	reportes = []
	options: Object
	title: string = ''
	monto_total: string = ''
	total_proyectos: number
	campo_agrupacion: string = ''

	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteService : ReportesDbService) {
		this.reportes = navParams.get('data_grafica')
		this.monto_total = navParams.get('monto_total')
		this.total_proyectos = navParams.get('total_proyectos')
		this.campo_agrupacion = navParams.get('groupBy')

		this.title = collect(this.reportes).implode('campo', ' , ')
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaFiltradaPage')
		this.muestraGrafica()
	}

	/* Funcion para visualizar la grafica con los filtros seleccionados. */
	muestraGrafica = () => {
		let data = []
		this.reportes.forEach(items => {
			console.log(items)

			data.push({
				name: items.campo,
				y: parseFloat(items.porcentaje)
			})
		})
		this.options = this.reporteService.datosGrafica(data , 5, '', '')
	}

	/* Funcion para ver el detalle de los proyectos segun la opcion que se escoja. */
	verProyectosAgrupados = (group_by: string, campo: string, monto_total: string): void => {
		this.navCtrl.push(DetalleReporteAgrupadoPage, {
			'campo': campo,
			'monto_total': monto_total,
			'groupBy': this.campo_agrupacion
		})
	}
}
