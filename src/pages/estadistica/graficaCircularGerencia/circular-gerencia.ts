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
		let gerencia: string[] = []
		let porcentaje: number[] = []

		this.proyectos.forEach(item => {
			gerencia.push(item.gerencia)
			porcentaje.push(item.porcentaje)
		})

		this.pieChartLabels = gerencia
		this.pieChartData = porcentaje

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

	/* Funcion para visualizar los proyectos agrupados por pais. */
	verProyectosAgrupadosGerencia = (gerencia: string, monto_total: string): void => {
		this.navCrtl.push(ProyectosAgrupadosGerenciaPage, {
			'gerencia': gerencia,
			'monto_total': monto_total
		})
	}
}
