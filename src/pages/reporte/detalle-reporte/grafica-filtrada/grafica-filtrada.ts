import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportesDbService } from '../../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import { DetalleReporteAgrupadoPage } from '../../../reporte/detalle-reporte/detalle-reporte-agrupado/detalle-reporte-agrupado'
import { Grafico } from '../../../../highcharts/modulo.reportes/Grafico'

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
	id: number = 0
	categorias = []
	grafico: Grafico

	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteService : ReportesDbService) {
		this.reportes = navParams.get('data_grafica')
		this.monto_total = navParams.get('monto_total')
		this.total_proyectos = navParams.get('total_proyectos')
		this.campo_agrupacion = navParams.get('groupBy')
		this.categorias = navParams.get('categorias')
		this.id = navParams.get('id')

		/* PAra visualizar el titulo de la vista activa.*/
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
			data.push({
				name: items.campo,
				y: parseFloat(items.porcentaje)
			})
		})
		/*Realizamos la instancia a nuestra clase para contruir la grafica. */
		this.grafico = new Grafico(data, this.campo_agrupacion, 'Proyectos agrupados por ' + this.campo_agrupacion , '')
		this.options = this.grafico.graficaBar()
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
