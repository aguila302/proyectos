import { Component } from '@angular/core'
import { DbService } from '../../services/db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@Component({
	selector: 'page-estadistica',
	templateUrl: 'estadistica.html',
})

export class EstadisticaPage {
	pais: string = 'pais'
	proyectos = []

	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels: string[] = [];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public barChartData: any[] = [{
		label: 'ser',
		data: [],
		backgroundColor: [
			'rgba(93, 173, 226)'
		]
	}]
	ionViewDidLoad (): void {
		this.getDatosXPais()
	}

	constructor(private dbService: DbService) {

	}

	getDatosXPais() {
		this.dbService.openDatabase()
		.then(() => this.dbService.consultaXPais())
		.then(response => {
			this.proyectos = response

			let paises: string[] = []
			let porcentaje: number[] = []

			response.forEach(item => {
				paises.push(item.pais)
				porcentaje.push(item.porcentaje)
			})
			this.barChartLabels = paises
			this.barChartData.forEach(
				(item) => {
					item.data = porcentaje
				}
			)
			

			const collection = collect(this.proyectos)

			let total = collection.sum(account.unformat('monto'))
			//let total = collection.each(function(item) {
			//	return sum += account.unformat(item.monto)
				//console.log(sum += account.unformat(item.monto))
			//})
			console.log(total)
			//console.log(collection.sum((account.unformat(item.monto))))
		})
	}
}
