import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@IonicPage()
@Component({
	selector: 'page-grafica-circular',
	templateUrl: 'grafica-circular.html',
})
export class GraficaCircularPage {
	proyectos = []
	data_grafica = []
	options: Object
	monto_total: string = ''
	total_proyectos: number

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.proyectos = this.navParams.get('datos_circular')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaCircularPage');
		this.verGrafica()
	}

	/* Funcion para mostrar la grafica. */
	verGrafica = () => {
		this.proyectos.forEach(item => {
			this.data_grafica.push({
				name: item.campo,
				y: parseFloat(item.porcentaje)
			})
		})

		this.options = this.datosGrafica(this.data_grafica)

		const collection = collect(this.proyectos)
		this.monto_total = account.formatNumber(collection.sum('monto'))
		this.total_proyectos = collection.sum('numero_proyectos')

		console.log(collection)
		
		let proyectos = collection.map(function(item) {
			return {
				'campo': item.campo,
				'porcentaje': item.porcentaje,
				'monto': account.formatNumber(item.monto),
				'numero_proyectos': item.numero_proyectos
			}
		})
		this.proyectos = proyectos
	}

	/* Funcion para dibujar la grafica circular.*/
	datosGrafica = (xy): Object => {
		let options = {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: true,
				type: 'pie',
				width: 750,
				height: 600
			},
			title: {
				text: 'Proyectos agrupados por país'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					},
					showInLegend: true
				}
			},
			series: [{
				name: 'Paises',
				colorByPoint: true,
				data: []
			}]
		}
		options['series'][0].data = xy
		return options
	}

}
