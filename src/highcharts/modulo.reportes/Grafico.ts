/**
 * Clase para la funcionalidad de las graficas bar.
 */
export class Grafico {

	data = []
	serieName: string = ''
	titleName: string = ''
	grupo: string = ''
	indicador: string = ''
	/**
	 * Parametros de entrada a nuestra clase para la construccion de las graficas.
	 * @param {any[]}  data
	 * @param {string} serieName
	 * @param {string} titleName
	 */
	constructor(data: any[], serieName: string, titleName: string, grupo: string, indicador) {
		this.data = data
		this.serieName = serieName
		titleName === 'Proyectos agrupados por pais' ? this.titleName = 'Proyectos agrupados por país' : this.titleName = titleName
		grupo === '' ? this.grupo = '%' : this.grupo = grupo
		this.indicador = indicador
	}

	/**
	 * Funcion que retorna un objeto para graficar de tipo bar
	 */
	graficaBar = (): Object => {
		var global = this
		let options = {
			chart: {
				type: 'column',
			},
			title: {
				text: this.titleName
			},
			xAxis: {
				type: 'category'
			},
			yAxis: [{
				labels: {
					format: `{value} ${this.grupo}`
					// formatter: function() {
					// 	return this.value + ' %';
					// }
				},
				title: {
					text: this.indicador
				}
			}],
			legend: {
				enabled: false
			},
			plotOptions: {
				series: {
					borderWidth: 0,
					dataLabels: {
						enabled: true,
						format:  `{point.y:.1f}${this.grupo}`
					}
				}
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
				pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}'+ this.grupo+'</b> del total<br/>'
			},

			series: [{
				name: this.serieName,
				colorByPoint: false,
				// data: [],
			}],
			responsive: {
				rules: [{
					condition: {
						maxWidth: 300
					},
					title: {
						text: 'responsive'
					},
					xAxis: {
						type: 'category'
					},
					// Make the labels less space demanding on mobile
					chartOptions: {
						legend: {
							align: 'center',
							verticalAlign: 'bottom',
							layout: 'horizontal'
						},
						xAxis: {
							labels: {
								formatter: function() {
									return this.value.charAt(0)
								}
							}
						},
						yAxis: {
							labels: {
								align: 'left',
								x: 0,
								y: -5
							},
							title: {
								text: null
							},
							subtitle: {
								text: null
							},
							credits: {
								enabled: false
							}
						}
					}
				}]
			}
		}
		options['series'][0]['data'] = this.data
		return options
	}

	/**
	 * Funcion que retorna un objeto para graficar de tipo pie
	 */
	graficaPie = (): Object => {
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
				text: this.titleName
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.y:.1f} '+this.grupo+'</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y:.1f} '+ this.grupo,
					},
					showInLegend: true
				}
			},
			series: [{
				name: this.serieName,
				colorByPoint: true,
				data: []
			}]
		}
		options['series'][0].data = this.data
		return options
	}
}