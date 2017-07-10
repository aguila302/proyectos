import { Component } from '@angular/core'
import { DbService } from '../../services/db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { CircularPaisPage } from './circular-pais'
import { ProyectosAgrupadosPage } from './proyectos-agrupados/proyectos-agrupados'
import { NavController } from 'ionic-angular'

@Component({
	selector: 'page-estadistica',
	templateUrl: 'estadistica.html',
})
export class EstadisticaPage {

	pais: string = 'pais'
	proyectos = []
	monto_total: string = ''
	total_proyectos: number
	dataCirular = []

	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true,
		scales: {
			xAxes: [{
				categoryPercentage: 0.8,
				barPercentage: 1.0,
				stacked: true,
				ticks: {
					beginAtZero: true
				},
				scaleLabel: {
					display: true,
					labelString: 'Países',
				},
				gridLines: {
					color: 'rgba(255,255,255,1.0)',
					zeroLineColor: 'rgba(254,254,254, 1.0)'
				}
			}],
			yAxes: [{

                position: 'left',
				display: true,
				ticks: {
					beginAtZero: false,
					callback: function(value, index, values) {
                        return '%' + value;
                    }
				},
				// scaleLabel: {
				// 	display: true,
				// 	labelString: '% del Total',
				// }
			}]
		},
		legend: {
			display: false,
		}
	}
	public barChartLabels: string[] = []
	public barChartType: string = 'bar'
	public barChartLegend: boolean = true

	public barChartData: any[] = [{
		data: [],
	}]
	barChartColors: any[] = [{ // grey
		backgroundColor: 'rgba(33, 47, 61)',
		borderColor: 'rgba(148,159,177,1)',
		pointBackgroundColor: 'rgba(148,159,177,1)',
		pointBorderColor: '#fff',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: 'rgba(148,159,177,0.8)'
	}, { // dark grey
		backgroundColor: 'rgba(77,83,96,0.2)',
		borderColor: 'rgba(77,83,96,1)',
		pointBackgroundColor: 'rgba(77,83,96,1)',
		pointBorderColor: '#fff',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: 'rgba(77,83,96,1)'
	}, { // grey
		backgroundColor: 'rgba(148,159,177,0.2)',
		borderColor: 'rgba(148,159,177,1)',
		pointBackgroundColor: 'rgba(148,159,177,1)',
		pointBorderColor: '#fff',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: 'rgba(148,159,177,0.8)'
	}]

	/* Cuando cargue nuestra vista conseguimos los proyectos de cada pais. */
	ionViewDidLoad (): void {
		this.getDatosXPais()
	}

	constructor(private dbService: DbService,
		private navCtrl: NavController) {
	}

	/* Funcion para conseguir los datos de poryectos por pais. */
	getDatosXPais() {
		this.dbService.openDatabase()
		.then(() => this.dbService.consultaXPais())
		.then(response => {
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
			
			const collection = collect(response)
			this.monto_total = account.formatMoney(collection.sum('monto'))
			this.total_proyectos = collection.sum('numero_proyectos')

			let proyectos = collection.map(function(item) {
				return {
					'pais': item.pais,
					'porcentaje': item.porcentaje,
					'monto': account.formatMoney(item.monto),
					'numero_proyectos' : item.numero_proyectos
				}
			})
			this.proyectos = proyectos
			this.dataCirular =  response
		})
	}

	/* Funcion para visualizar los proyectos agrupados por pais. */
	verProyectosAgrupados = (pais: string): void => {
		this.navCtrl.push(ProyectosAgrupadosPage, {
			'pais': pais
		})
	}

	/* Funcion para visualizar la grafica en modo circular. */
	modoCircular = (): void => {
		this.navCtrl.push(CircularPaisPage, {
			'datos_circular' : this.dataCirular
		})
	}
}
