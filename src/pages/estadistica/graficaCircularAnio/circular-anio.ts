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

	constructor(private navParams: NavParams,
		private navCrtl: NavController) {
		this.proyectos = navParams.get('datos_circular')
		this.loadDatos()
	}

	// Pie
	public pieChartLabels: string[] = []
	public pieChartData: number[] = []
	public pieChartType: string = 'pie'

	// events
	public chartClicked(e: any): void {
		console.log(e)
	}

	public chartHovered(e: any): void {
		console.log(e)
	}
	public pieChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true,
	}

	loadDatos= () => {
		let anios: string[] = []
		let porcentaje: number[] = []

		this.proyectos.forEach(item => {
			anios.push(item.anio)
			porcentaje.push(item.porcentaje)
		})

		this.pieChartLabels = anios
		this.pieChartData = porcentaje

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

	/* Funcion para visualizar los proyectos agrupados por pais. */
	verProyectosAgrupadosAnio = (anio: number, monto_total: string): void => {
		this.navCrtl.push(ProyectosAgrupadosAnioPage, {
			'anio': anio,
			'monto_total': monto_total
		})
	}
}
