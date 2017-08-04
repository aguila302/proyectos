import { Component, NgZone } from '@angular/core'
import { DbService } from '../../services/db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { CircularPaisPage } from './circular-pais'
import { CircularAnioPage } from './graficaCircularAnio/circular-anio'
import { CircularGerenciaPage } from './graficaCircularGerencia/circular-gerencia'
import { CircularClientePage } from './graficaCircularCliente/circular-cliente'

import { ProyectosAgrupadosPage } from './proyectos-agrupados/proyectos-agrupados'
import { ProyectosAgrupadosAnioPage } from './proyectos-agrupados/por-anio/proyectos-agrupados-anio'
import { ProyectosAgrupadosClientePage } from './proyectos-agrupados/por-cliente/proyectos-agrupados-cliente'
import { ProyectosAgrupadosClienteMenoresPage } from './proyectos-agrupados/por-cliente/por-cliente-menores/proyectos-agrupados-cliente-menores'

import { ProyectosAgrupadosGerenciaPage } from './proyectos-agrupados/por-gerencia/proyectos-agrupados-gerencia'
import { IonicPage, NavController, LoadingController } from 'ionic-angular'

// @IonicPage()
@Component({
	selector: 'page-estadistica',
	templateUrl: 'estadistica.html',
})
export class EstadisticaPage {
	// options: Object;

	constructor(private dbService: DbService,
		private navCtrl: NavController, public zone: NgZone, public loadingCtrl: LoadingController) {

	}
	// console.log(this.options)

	pais: string = 'pais'
	proyectos = []
	proyectos_agrupados = []
	proyectos_agrupados_detalle = []
	monto_total: string = ''
	total_proyectos: number
	dataCirular = []
	data_grafica: {}
	options = {
		chart: {
			type: 'column'
		},
		title: {
			text: 'Browser market shares. January, 2015 to May, 2015'
		},
		subtitle: {
			text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
		},
		xAxis: {
			type: 'category'
		},
		yAxis: {
			title: {
				text: 'Total percent market share'
			}

		},
		legend: {
			enabled: false
		},
		plotOptions: {
			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					format: '{point.y:.1f}%'
				}
			}
		},

		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
		},

		series: [{
			name: 'Brands',
			colorByPoint: false,
			data: []
		}],
	}

	// ionViewDidLoad(){
	// 	this.getDatosXPais()
	// }

	ionViewDidLoad() {
		console.log('toy activo')
		
		this.getDatosXPais()
	}

	// ionViewDidEnter() {
	// 	this.getDatosXPais()
	// }

	/* Funcion para conseguir los datos de poryectos por pais. */
	getDatosXPais() {
		this.dbService.openDatabase()
			.then(() => this.dbService.consultaXPais())
			.then(response => {
				this.options['series'][0].data.splice(0, this.options['series'][0].data.length)
				// let data_grafica: Object
				this.zone.run(() => {
					/* Para mostrar la informacion de la grafica. */
					response.forEach(item => {
						this.data_grafica = {
							name: item.pais,
							y: parseFloat(item.porcentaje)
						}
						this.options['series'][0].data.push(this.data_grafica)
					})
					console.log(this.options)

					/* Para mostrar la tabla de informacion */
					const collection = collect(response)
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
					this.dataCirular = response
				})
			})
			.catch(console.error.bind(console))
	}

}