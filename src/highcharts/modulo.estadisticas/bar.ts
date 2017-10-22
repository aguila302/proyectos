export class Bar {

	data = []
	serieName: string = ''
	titleName: string = ''

	constructor(data: any[], serieName: string, titleName: string) {
		this.data = data
		this.serieName = serieName
		this.titleName = titleName
	}

	greet() {
		console.log('greet')
		
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
					// formatter: function() {
					// 	return this.value + ' %';
					// }
				},
				title: {
					text: 'Porcentaje total de participación'
				}
			}],
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
				pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> del total<br/>'
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
							// className: 'highcharts-color-0',
							// labels: {
							// 	align: 'left',
							// 	x: 0,
							// 	y: -2
							// },
							// title: {
							// 	text: 'Porcentaje total de participación'
							// }
						}
					}
				}]
			}
		}
		options['series'][0]['data'] = this.data
		return options
	}
}