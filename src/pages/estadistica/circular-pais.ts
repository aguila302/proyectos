import { Component } from '@angular/core'
import { NavParams, NavController } from 'ionic-angular'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@Component({
	selector: 'page-circular-pais',
	templateUrl: 'circular-pais.html',
})

export class CircularPaisPage {
	proyectos = []
	monto_total: string = ''
	total_proyectos: number

	constructor(private navParams: NavParams,
		private navCrtl: NavController) {
		this.proyectos = navParams.get('datos_circular')
		this.loadDatos()
	}

	ionViewWillLeave () {
		console.log('me dejas')
		this.navCrtl.pop()
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
		let paises: string[] = []
		let porcentaje: number[] = []

		this.proyectos.forEach(item => {
			paises.push(item.pais)
			porcentaje.push(item.porcentaje)
		})

		this.pieChartLabels = paises
		this.pieChartData = porcentaje

		const collection = collect(this.proyectos)
		this.monto_total = account.formatMoney(collection.sum('monto'))
		this.total_proyectos = collection.sum('numero_proyectos')

		let proyectos = collection.map(function(item) {
			return {
				'pais': item.pais,
				'porcentaje': item.porcentaje,
				'monto': account.formatMoney(item.monto),
				'numero_proyectos': item.numero_proyectos
			}
		})
		this.proyectos = proyectos
	}

	/* Funcion para cerrar la ventana de la grafica circular. */
	back() {
		this.navCrtl.pop()
	}
}
