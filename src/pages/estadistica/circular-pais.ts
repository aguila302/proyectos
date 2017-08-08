import { Component } from '@angular/core'
import { NavParams, NavController } from 'ionic-angular'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { ProyectosAgrupadosPage } from './proyectos-agrupados/proyectos-agrupados'

@Component({
	selector: 'page-circular-pais',
	templateUrl: 'circular-pais.html',
})

export class CircularPaisPage {
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
				name: item.pais,
				y: parseFloat(item.porcentaje)
			})
		})
		this.options = this.datosGrafica(this.data_grafica)

		const collection = collect(this.proyectos)
		this.monto_total = account.formatNumber(collection.sum('monto'))
		this.total_proyectos = collection.sum('numero_proyectos')

		let proyectos = collection.map(function(item) {
			return {
				'pais': item.pais,
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

	/* Funcion para visualizar los proyectos agrupados por pais. */
	verProyectosAgrupados = (pais: string, monto_total: string): void => {
		this.navCrtl.push(ProyectosAgrupadosPage, {
			'pais': pais,
			'monto_total': monto_total
		})
	}
}
