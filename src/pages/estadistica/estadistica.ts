import { Component, NgZone } from '@angular/core'
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
				barPercentage: 0.5,
                position: 'left',
				display: true,
				ticks: {
					beginAtZero: false,
					callback: function(value, index, values) {
                        return '%' + value;
                    },
                    min: 0,
        			max: 100,
                    stepSize: 25
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

	/* Cuando cargue nuestra vista conseguimos los proyectos de cada pais. */
	ionViewWillEnter (): void {
		this.getDatosXPais()
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
}
