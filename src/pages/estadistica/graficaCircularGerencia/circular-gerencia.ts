import { Component } from '@angular/core'
import { NavParams, NavController } from 'ionic-angular'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { ProyectosAgrupadosGerenciaPage } from '../proyectos-agrupados/por-gerencia/proyectos-agrupados-gerencia'

@Component({
	selector: 'page-circular-gerencia',
	templateUrl: 'circular-gerencia.html',
})

export class CircularGerenciaPage {
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
				name: item.gerencia,
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
				'gerencia': item.gerencia,
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
				text: 'Proyectos agrupados por gerencia'
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
				name: 'Gerencia',
				colorByPoint: true,
				data: []
			}]
		}
		options['series'][0].data = xy
		return options
	}

	/* Funcion para visualizar los proyectos agrupados por pais. */
	verProyectosAgrupadosGerencia = (gerencia: string, monto_total: string): void => {
		this.navCrtl.push(ProyectosAgrupadosGerenciaPage, {
			'gerencia': gerencia,
			'monto_total': monto_total
		})
	}
}
