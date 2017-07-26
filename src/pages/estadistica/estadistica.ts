import { Component, NgZone } from '@angular/core'
import { DbService } from '../../services/db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { CircularPaisPage } from './circular-pais'
import { CircularAnioPage } from './graficaCircularAnio/circular-anio'
import { ProyectosAgrupadosPage } from './proyectos-agrupados/proyectos-agrupados'
import { ProyectosAgrupadosAnioPage } from './proyectos-agrupados/por-anio/proyectos-agrupados-anio'
import { NavController } from 'ionic-angular'

@Component({
	selector: 'page-estadistica',
	templateUrl: 'estadistica.html',
})
export class EstadisticaPage {

	constructor(private dbService: DbService,
		private navCtrl: NavController, public zone: NgZone) {
	}

	pais: string = 'pais'
	proyectos = []
	monto_total: string = ''
	total_proyectos: number
	dataCirular = []

	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true,
		tooltips: {
			enabled: true
		},
		scales: {
			xAxes: [{
				categoryPercentage: 0.8,
				// barPercentage: 1.0,
				stacked: true,
				ticks: {
					maxRotation: 90,
					minRotation: 0,
					autoSkip: false,
					labelOffset: 3,
					mirror: true,
					beginAtZero: true
				},
				scaleLabel: {
					display: true,
					labelString: 'Paises',
				},
				gridLines: {
					color: 'rgba(255,255,255,1.0)',
					zeroLineColor: 'rgba(254,254,254, 1.0)'
				}
			}],
			yAxes: [{
				barPercentage: 0.5,
                position: 'left',
				display: true,
				ticks: {
					beginAtZero: false,
					callback: function(value, index, values) {
                        return '%' + value
                    },
                    min: 0,
        			max: 100,
                    stepSize: 10
				},
				// scaleLabel: {
				// 	display: true,
				// 	labelString: '% del Total',
				// }
			}]
		},
		legend: {
			display: false,
		},
		plugins: {
			deferred: { // enabled by default
				xOffset: 150, // defer until 150px of the canvas width are inside the viewport
				yOffset: '50%', // defer until 50% of the canvas height are inside the viewport
				delay: 500 // delay of 500 ms after the canvas is considered inside the viewport
			}
		}
	}
	public barChartLabels: string[] = []
	public barChartType: string = 'bar'
	public barChartLegend: boolean = true

	public barChartData: any[] = [{
		data: [],
		label: [],
		backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#17202A', '#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#17202A', '#e8c3b9', '#c45850', '#17202A'],
	}]

	ionViewDidLoad (): void {
		this.getDatosXPais()
	}

	/* Funcion para conseguir los datos de poryectos por pais. */
	getDatosXPais() {
		for(let index in this.barChartOptions) {
			this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = 'Paises'
			this.barChartOptions.scales.yAxes[0].ticks.min = 0
			this.barChartOptions.scales.yAxes[0].ticks.max = 100
			this.barChartOptions.scales.yAxes[0].ticks.stepSize = 10
		}
		this.dbService.openDatabase()
			.then(() => this.dbService.consultaXPais())
			.then(response => {
				/* Para mostrar la informacion de la grafica. */
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


				/* Para mostrar la tabla de informacion */
				const collection = collect(response)
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
				this.dataCirular = response
			})
			.catch(console.error.bind(console))
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

	// events
	public chartClicked(e: any): void {
		console.log('chartClicked')
		console.log(e)
	}

	public chartHovered(e: any): void {
		console.log('chartHovered')
		console.log(e)
	}

	/* Funcion para conseguir los datos de poryectos por anio. */
	getDatosXAnio = (): void => {
		for (let index in this.barChartOptions) {
			this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = 'Años'
			this.barChartOptions.scales.yAxes[0].ticks.min = 0
			this.barChartOptions.scales.yAxes[0].ticks.max = 10
			this.barChartOptions.scales.yAxes[0].ticks.stepSize = 2
		}
		this.dbService.openDatabase()
			.then(() => this.dbService.consultaXAnio())
			.then(response => {
				// Para mostrar la informacion de la grafica. 
				let anios: string[] = []
				let porcentaje: number[] = []

				response.forEach(item => {
					anios.push(item.anio)
					porcentaje.push(item.porcentaje)
				})

				this.barChartLabels = anios
				this.barChartData.forEach(
					(item) => {
						item.data = porcentaje
					}
				)

				/* Para mostrar la tabla de informacion */
				const collection = collect(response)
				this.monto_total = account.formatMoney(collection.sum('monto'))
				this.total_proyectos = collection.sum('numero_proyectos')

				let proyectos = collection.map(function(item) {
					return {
						'anio': item.anio,
						'porcentaje': item.porcentaje,
						'monto': account.formatMoney(item.monto),
						'numero_proyectos': item.numero_proyectos
					}
				})
				this.proyectos = proyectos
				this.dataCirular = response
			})
	}

	/* Funcion para visualizar los proyectos agrupados por anio. */
	verProyectosAgrupadosAnio = (anio: string): void => {
		this.navCtrl.push(ProyectosAgrupadosAnioPage, {
			'anio': anio
		})
	}

	/* Funcion para visualizar la grafica en modo circular por anio. */
	modoCircularAnio = (): void => {
		this.navCtrl.push(CircularAnioPage, {
			'datos_circular' : this.dataCirular
		})
	}

	/* Funcion para conseguir los datos de poryectos por gerencia. */
	getDatosXGerencia = (): void => {
		for(let index in this.barChartOptions) {
			this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = 'Gerencia'
			this.barChartOptions.scales.yAxes[0].ticks.min = 0
			this.barChartOptions.scales.yAxes[0].ticks.max = 100
			this.barChartOptions.scales.yAxes[0].ticks.stepSize = 15
		}

		this.dbService.openDatabase()
			.then(() => this.dbService.consultaXGerencia())
			.then(response => {
				// Para mostrar la informacion de la grafica. 
				let gerencia: string[] = []
				let porcentaje: number[] = []

				response.forEach(item => {
					gerencia.push(item.gerencia)
					porcentaje.push(item.porcentaje)
				})

				this.barChartLabels = gerencia
				this.barChartData.forEach(
					(item) => {
						item.data = porcentaje
					}
				)

				/* Para mostrar la tabla de informacion */
				const collection = collect(response)
				this.monto_total = account.formatMoney(collection.sum('monto'))
				this.total_proyectos = collection.sum('numero_proyectos')

				let proyectos = collection.map(function(item) {
					return {
						'gerencia': item.gerencia,
						'porcentaje': item.porcentaje,
						'monto': account.formatMoney(item.monto),
						'numero_proyectos': item.numero_proyectos
					}
				})
				this.proyectos = proyectos
				// this.dataCirular = response
			})
	}
}