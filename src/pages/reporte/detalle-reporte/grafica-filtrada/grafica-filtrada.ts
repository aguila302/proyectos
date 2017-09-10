import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportesDbService } from '../../../../services/reportes.db.service'

@IonicPage()
@Component({
	selector: 'page-grafica-filtrada',
	templateUrl: 'grafica-filtrada.html',
})

export class GraficaFiltradaPage {
	reportes = []
	options: Object

	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteService : ReportesDbService) {
		this.reportes = navParams.get('data_grafica')
		// console.log(this.reportes)
		this.options = this.reporteService.datosGrafica(this.reportes , 5, '', '')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaFiltradaPage')
	}

	/* Funcion para visualizar la grafica con los filtros seleccionados. */
	// muestraGrafica = () => {
	// 	let data = []
	// 	this.reportes.forEach(items => {
	// 		console.log(items)
			
	// 		data.push({
	// 			name: items.campo,
	// 			y: parseFloat(items.porcentaje)
	// 		})
	// 	})
	// 	this.options = this.reporteService.datosGrafica(data , 5, '', '')
	// 	// console.log(this.options)
		
	// }
}
