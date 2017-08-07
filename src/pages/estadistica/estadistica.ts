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
import { Platform, NavController, LoadingController } from 'ionic-angular'

// @IonicPage()
@Component({
	selector: 'page-estadistica',
	templateUrl: 'estadistica.html',
})
export class EstadisticaPage {
	xy = []
	options: Object

	constructor(private dbService: DbService,
		private navCtrl: NavController, public zone: NgZone, public loadingCtrl: LoadingController,
		public platform: Platform) {
		console.log('constructor')
		
	}


	pais: string = 'pais'
	proyectos = []
	proyectos_agrupados = []
	proyectos_agrupados_detalle = []
	monto_total: string = ''
	total_proyectos: number
	dataCirular = []
	data_grafica: {}
	
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
				},
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
			}],
			// margins: {
			// 	bottom: 100,
			// },
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

	public barChartColors: Array < any > = [{ 
		// grey
		backgroundColor: 'rgba(27, 38, 49)',
		borderColor: 'rgba(148,159,177,1)',
		pointBackgroundColor: 'rgba(148,159,177,1)',
		pointBorderColor: '#fff',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: 'rgba(148,159,177,0.8)'
	}]
	public barChartData: any[] = [{

		data: [],
		label: [],
	}]

	// ionViewDidLoad(){
	// 	this.getDatosXPais()
	// }

	ionViewDidLoad(): void {
		console.log('ionViewDidLoad')
		this.getDatosXPais()
	}


	// ionViewDidEnter() {
	// 	console.log('ionViewDidEnter')
	// 	this.getDatosXPais()
	// }

	/* Funcion para conseguir los datos de poryectos por pais. */
	getDatosXPais() {
		this.dbService.openDatabase()
			.then(() => this.dbService.consultaXPais())
			.then(response => {
				//this.options['series'][0].data.splice(0, this.options['series'][0].data.length)
				this.zone.run(() => {
					/* Para mostrar la informacion de la grafica. */
					this.xy.splice(0, this.xy.length)
					response.forEach(item => {
						this.xy.push({
							name: item.pais,
							y: parseFloat(item.porcentaje)
						})
						//this.options['series'][0].data.push(this.xy)
					})
					this.options = this.datosGrafica(this.xy)
					// console.log(this.options)

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


	datosGrafica = (xy): Object => {
		//console.log(xy)
		let options = {
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
				enabled: true
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
			responsive: {
				rules: [{
					condition: {
						maxWidth: 700
					},
					// Make the labels less space demanding on mobile
					chartOptions: {
						xAxis: {
							labels: {
								formatter: function() {
									return this.value.charAt(0);
								}
							}
						},
						yAxis: {
							labels: {
								align: 'left',
								x: 0,
								y: -2
							},
							title: {
								text: ''
							}
						}
					}
				}]
			}
		}
		// options['series'][0].data.splice(0, options['series'][0].data.length)
		console.log(options)
		options['series'][0].data = xy
		return options
		
		//this.options['series'][0].data.splice(0, this.options['series'][0].data.length)
	}
/* Funcion para visualizar los proyectos agrupados por pais. */
	verProyectosAgrupados = (pais: string, monto_total: string): void => {
		this.navCtrl.push(ProyectosAgrupadosPage, {
			'pais': pais,
			'monto_total': monto_total
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
				this.dataCirular = response
			})
	}

	/* Funcion para visualizar los proyectos agrupados por anio. */
	verProyectosAgrupadosAnio = (anio: string, monto_total:string): void => {
		this.navCtrl.push(ProyectosAgrupadosAnioPage, {
			'anio': anio,
			'monto_total': monto_total
		})
	}

	/* Funcion para visualizar la grafica en modo circular por anio. */
	modoCircularAnio = (): void => {
		this.navCtrl.push(CircularAnioPage, {
			'datos_circular' : this.dataCirular
		})
	}

	/* Funcion para conseguir los datos de proyectos por gerencia. */
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
				this.dataCirular = response
			})
	}

	/* Funcion para visualizar los proyectos agrupados por gerencia. */
	verProyectosAgrupadosGerencia = (gerencia: string, monto_total:string): void => {
		this.navCtrl.push(ProyectosAgrupadosGerenciaPage, {
			'gerencia': gerencia,
			'monto_total' : monto_total
		})
	}

	/* Funcion para visualizar la grafica en modo circular por gerencia. */
	modoCircularGerencia = (): void => {
		this.navCtrl.push(CircularGerenciaPage, {
			'datos_circular': this.dataCirular
		})
	}

	/* Funcion para obtener los proyectos por cliente. */
	getDatosXCliente = (): void => {
		for (let index in this.barChartOptions) {
			this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = 'Cliente'
			this.barChartOptions.scales.yAxes[0].ticks.min = 0
			this.barChartOptions.scales.yAxes[0].ticks.max = 70
			this.barChartOptions.scales.yAxes[0].ticks.stepSize = 5
		}

		let porcentaje: number[] = []
		let cliente: string[] = []

		this.dbService.openDatabase()
			.then(() => this.dbService.consultaXCliente())
			.then(response => {
				this.zone.run(() => {
					let data = collect(response)

					/* monto total de todos los proyectos. */
					let monto_total = data.sum('monto')

					/* Agrupo mi data por contratante. */
					let agrupados = data.groupBy('contratante').toArray()

					let datos = agrupados.map(function(contratante, monto) {
						let num_proyectos = contratante.length
						let suma_montos = contratante.reduce(function(index, proyecto) {
							return index + parseInt(proyecto.monto)
						}, 0)

						return {
							id: contratante[0].id,
							contratante: contratante[0].contratante,
							suma_monto: suma_montos,
							porcentaje: parseFloat(((suma_montos / monto_total) * 100).toFixed(2)),
							numero_proyectos: num_proyectos
						}
					})
					/* Ordeno por porcentaje de mayor a menor. */
					let ordenados = collect(datos).sortByDesc('porcentaje')

					/* Clasifico los proyectos por porcentaje mayor a 1 y menores de 1. */
					let mayores_de_uno = ordenados.where('porcentaje', '>', 1)
					let menores_de_uno = ordenados.where('porcentaje', '<', 1)

					/* Suma de los montos y porcentajes de porcentaje  menores de 1. */
					let suma_montos_menores_de_uno = menores_de_uno.sum('suma_monto')
					let suma_porcentajes_menores_de_uno = menores_de_uno.sum('porcentaje').toFixed(2)
					mayores_de_uno.toArray()

					/* Consigo el porcentaje y cliente para formar mi grafica. */
					mayores_de_uno.map(function(contratante, monto) {
						porcentaje.push(contratante.porcentaje)
						cliente.push(contratante.contratante)
					})

					/* inserto la informacion en los arreglos de origen de la grafica. */
					this.barChartLabels = cliente
					this.barChartData.forEach(
						(item) => {
							item.data = porcentaje
						}
					)

					/* Para mostrar la tabla de informacion */
					this.monto_total = account.formatNumber(data.sum('monto'))
					this.total_proyectos = response.length

					let proyectos = mayores_de_uno.map(function(item) {
						return {
							'contratante': item.contratante,
							'porcentaje': item.porcentaje,
							'monto': account.formatNumber(item.suma_monto),
							'numero_proyectos': item.numero_proyectos
						}
					})

					this.proyectos = proyectos
					this.dataCirular = response
					this.proyectosAgrupados(menores_de_uno, suma_porcentajes_menores_de_uno)
				})
			})
	}

	/* Funcion para los proyectos que tienen menos de 1 porcentaje. */
	async proyectosAgrupados(menores_de_uno, suma_porcentajes_menores_de_uno) {
		/* Para mostras la informacion agrupada con los proyectos menores del 1 %. */
		/* Consigo el porcentaje y cliente para formar mi grafica. */
		menores_de_uno.toArray()
		this.barChartLabels.push('Proyectos agrupados')
		this.barChartData.forEach(
				(item) => {
					item.data.push(parseFloat(suma_porcentajes_menores_de_uno))
				}
			)
		/* Construyo la informacion para mi tablero. */
		this.proyectos_agrupados['suma_montos_menores_de_uno'] = account.formatNumber(menores_de_uno.sum('suma_monto'))
		this.proyectos_agrupados['porcentaje'] = suma_porcentajes_menores_de_uno
		this.proyectos_agrupados['numero_proyectos'] =  menores_de_uno.count()

		this.proyectos_agrupados_detalle = menores_de_uno
	}

	/* Funcion para visualizar los proyectos agrupados por contratante. */
	verProyectosAgrupadosCliente = (contratante: string, monto_total: string): void => {
		this.navCtrl.push(ProyectosAgrupadosClientePage, {
			'contratante': contratante,
			'monto_total': monto_total
		})
	}

	verProyectosAgrupadosClientePorcentajeMenosAUno = (monto_total: string): void => {
		let proyectos = this.proyectos_agrupados_detalle.map(function(item) {
			return {
				'id': item.id,
				'contratante': item.contratante,
				'porcentaje': item.porcentaje,
				'monto': account.formatNumber(item.suma_monto),
				'numero_proyectos': item.numero_proyectos
			}
		})

		this.navCtrl.push(ProyectosAgrupadosClienteMenoresPage, {
			'proyectos_agrupados_detalle': proyectos,
			'monto_total': monto_total
		})
	}

	/* Funcion para visualizar la grafica en modo circular por gerencia. */
	modoCircularCliente = (): void => {
		this.navCtrl.push(CircularClientePage, {
			'datos_circular': this.dataCirular
		})
	}
}