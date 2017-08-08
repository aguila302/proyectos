import { Component } from '@angular/core'
import { NavParams, NavController } from 'ionic-angular'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { ProyectosAgrupadosAnioPage } from '../proyectos-agrupados/por-anio/proyectos-agrupados-anio'

@Component({
	selector: 'page-circular-anio',
	templateUrl: 'circular-anio.html',
})

export class CircularAnioPage {
	proyectos = []
	monto_total: string = ''
	total_proyectos: number
	data_grafica = []
	options: Object

	constructor(private navParams: NavParams,
		private navCrtl: NavController) {
		this.proyectos = navParams.get('datos_circular')
		this.loadDatos()
	}

	loadDatos= () => {
		this.data_grafica.splice(0, this.data_grafica.length)
		this.proyectos.forEach(item => {
			this.data_grafica.push({
				name: item.anio,
				y: parseFloat(item.porcentaje)
			})
		})
		this.options = this.datosGrafica(this.data_grafica)

		/* Para mostrar la tabla dinamica. */
		const collection = collect(this.proyectos)
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
	}

	/* Funcion para dibujar la grafica circular.*/
	datosGrafica = (xy): Object => {
		let options = {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: true,
				type: 'pie',
				width: 900,
				height: 650
			},
			title: {
				text: 'Proyectos agrupados por año'
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
				name: 'Años',
				colorByPoint: true,
				data: []
			}]
		}
		options['series'][0].data = xy
		return options
	}

	/* Funcion para visualizar los proyectos agrupados por pais. */
	verProyectosAgrupadosAnio = (anio: number, monto_total: string): void => {
		this.navCrtl.push(ProyectosAgrupadosAnioPage, {
			'anio': anio,
			'monto_total': monto_total
		})
	}
}
