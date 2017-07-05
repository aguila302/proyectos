import { Component, OnInit } from '@angular/core'
import { EstadisticaService } from '../../services/estadistica.service'
import { Proyecto } from '../../interfaces/proyecto'
import { NavController, NavParams } from 'ionic-angular'
import { PiePage } from './pie'
// import { collect } from 'collect.js'


@Component({
	selector: 'page-estadistica',
	templateUrl: 'estadistica.html',
})


export class EstadisticaPage {
	pais: string = 'pais'

	proyectos = []
	mexico = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	colombia = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	venenzuela = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	peru = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	panama = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	salvador = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	guatemala = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	honduras = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	costa = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	ecuador = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	argentina = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	usa = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}
	bolivia = {'porcentaje': '', 'monto': '', 'proyectos': '', 'monedas': ''}

	anios: Array<any> = [{}]

	ionViewDidLoad (): void {
		console.log('Iniciando estadisticas ')
		
	}

	constructor(
		private estadisticaService: EstadisticaService, public navCtrl: NavController) {
		this.getProyectosXPais()
		//this.estadisticaService.porAnio()

	}

	public barChartOptions: any = {
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


	public barChartLabels: string[] = [] /* Datos de abajo. */
	public barChartType: string = 'bar'
	public barChartLegend: boolean = true

	public barChartData: any[] = [{
		label: '',
		data: [],
		backgroundColor: [
			'rgba(93, 173, 226)'
		]
	}]

	public barChartColors: Array < any > = [
		{ // grey
			backgroundColor: 'rgba(77, 86, 86)',
			borderColor: 'rgba(148,159,177,1)',
			pointBackgroundColor: 'rgba(148,159,177,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(148,159,177,0.8)'
		},
		{ // dark grey
			backgroundColor: 'rgba(77,83,96,0.2)',
			borderColor: 'rgba(77,83,96,1)',
			pointBackgroundColor: 'rgba(77,83,96,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(77,83,96,1)'
		},
		{ // grey
			backgroundColor: 'rgba(148,159,177,0.2)',
			borderColor: 'rgba(148,159,177,1)',
			pointBackgroundColor: 'rgba(148,159,177,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(148,159,177,0.8)'
		}
	];

	getProyectosXPais = (): void => {
		this.estadisticaService.getProyectos()
			.then(proyectos => this.proyectos = proyectos)
			.then(() => this.estadisticaService.porPais(this.proyectos))
			.then(data => {
				/* Obtenemos porcentaje de mexico. */
				this.mexico.porcentaje = data[3].toFixed(2)
				/* Obtenemos el monto de mexico. */
				this.mexico.monto = data[4].toFixed(2)
				/* Obtenemos el numero de proyecto de mexico. */
				this.mexico.proyectos = data[1]
				/* Obtenemos el nombre mexico. */
				this.barChartLabels.push(data[0])
				/* Obtenemos los tipos de monedas de mexico. */
				this.mexico.monedas = data[5]

				/* Obtenemos porcentaje de colombia. */
				this.colombia.porcentaje = data[9].toFixed(2)
				/* Obtenemos el monto de colombia. */
				this.colombia.monto = data[10].toFixed(2)
				/* Obtenemos el numero de proyecto de colombia. */
				this.colombia.proyectos = data[7]
				/* Obtenemos el nombre colombia. */
				this.barChartLabels.push(data[6])
				/* Obtenemos los tipos de monedas de colombia. */
				this.colombia.monedas = data[11]

				/* Obtenemos porcentaje de venenzuela. */
				this.venenzuela.porcentaje = data[15].toFixed(2)
				/* Obtenemos el monto de venenzuela. */
				this.venenzuela.monto = data[16].toFixed(2)
				/* Obtenemos el numero de proyecto de venenzuela. */
				this.venenzuela.proyectos = data[13]
				/* Obtenemos el nombre venenzuela. */
				this.barChartLabels.push(data[12])
				/* Obtenemos los tipos de monedas de venenzuela. */
				this.venenzuela.monedas = data[17]

				/* Obtenemos porcentaje de peru. */
				this.peru.porcentaje = data[21].toFixed(2)
				/* Obtenemos el monto de peru. */
				this.peru.monto = data[22].toFixed(2)
				/* Obtenemos el numero de proyecto de peru. */
				this.peru.proyectos = data[19]
				/* Obtenemos el nombre peru. */
				this.barChartLabels.push(data[18])
				/* Obtenemos los tipos de monedas de peru. */
				this.peru.monedas = data[23]

				/* Obtenemos porcentaje de panama. */
				this.panama.porcentaje = data[27].toFixed(2)
				/* Obtenemos el monto de panama. */
				this.panama.monto = data[28].toFixed(2)
				/* Obtenemos el numero de proyecto de panama. */
				this.panama.proyectos = data[25]
				/* Obtenemos el nombre panama. */
				this.barChartLabels.push(data[24])
				/* Obtenemos los tipos de monedas de panama. */
				this.panama.monedas = data[29]

				/* Obtenemos porcentaje de salvador. */
				this.salvador.porcentaje = data[33].toFixed(2)
				/* Obtenemos el monto de salvador. */
				this.salvador.monto = data[34].toFixed(2)
				/* Obtenemos el numero de proyecto de salvador. */
				this.salvador.proyectos = data[31]
				/* Obtenemos el nombre salvador. */
				this.barChartLabels.push(data[30])
				/* Obtenemos los tipos de monedas de salvador. */
				this.salvador.monedas = data[35]

				/* Obtenemos porcentaje de guatemala. */
				this.guatemala.porcentaje = data[39].toFixed(2)
				/* Obtenemos el monto de guatemala. */
				this.guatemala.monto = data[40].toFixed(2)
				/* Obtenemos el numero de proyecto de guatemala. */
				this.guatemala.proyectos = data[37]
				/* Obtenemos el nombre guatemala. */
				this.barChartLabels.push(data[36])
				/* Obtenemos los tipos de monedas de guatemala. */
				this.guatemala.monedas = data[41]

				/* Obtenemos porcentaje de honduras. */
				this.honduras.porcentaje = data[45].toFixed(2)
				/* Obtenemos el monto de honduras. */
				this.honduras.monto = data[46].toFixed(2)
				/* Obtenemos el numero de proyecto de honduras. */
				this.honduras.proyectos = data[43]
				/* Obtenemos el nombre honduras. */
				this.barChartLabels.push(data[42])
				/* Obtenemos los tipos de monedas de honduras. */
				this.honduras.monedas = data[47]

				/* Obtenemos porcentaje de costa. */
				this.costa.porcentaje = data[51].toFixed(2)
				/* Obtenemos el monto de costa. */
				this.costa.monto = data[52].toFixed(2)
				/* Obtenemos el numero de proyecto de costa. */
				this.costa.proyectos = data[49]
				/* Obtenemos el nombre costa. */
				this.barChartLabels.push(data[48])
				/* Obtenemos los tipos de monedas de costa. */
				this.costa.monedas = data[53]

				/* Obtenemos porcentaje de ecuador. */
				this.ecuador.porcentaje = data[57].toFixed(2)
				/* Obtenemos el monto de ecuador. */
				this.ecuador.monto = data[58].toFixed(2)
				/* Obtenemos el numero de proyecto de ecuador. */
				this.ecuador.proyectos = data[55]
				/* Obtenemos el nombre ecuador. */
				this.barChartLabels.push(data[54])
				/* Obtenemos los tipos de monedas de ecuador. */
				this.ecuador.monedas = data[59]

				/* Obtenemos porcentaje de argentina. */
				this.argentina.porcentaje = data[63].toFixed(2)
				/* Obtenemos el monto de argentina. */
				this.argentina.monto = data[64].toFixed(2)
				/* Obtenemos el numero de proyecto de argentina. */
				this.argentina.proyectos = data[61]
				/* Obtenemos el nombre argentina. */
				this.barChartLabels.push(data[60])
				/* Obtenemos los tipos de monedas de argentina. */
				this.argentina.monedas = data[65]

				/* Obtenemos porcentaje de usa. */
				this.usa.porcentaje = data[69].toFixed(2)
				/* Obtenemos el monto de usa. */
				this.usa.monto = data[70].toFixed(2)
				/* Obtenemos el numero de proyecto de usa. */
				this.usa.proyectos = data[67]
				/* Obtenemos el nombre usa. */
				this.barChartLabels.push(data[66])
				/* Obtenemos los tipos de monedas de usage(). */
				this.usa.monedas = data[71]

				/* Obtenemos porcentaje de bolivia. */
				this.bolivia.porcentaje = data[75].toFixed(2)
				/* Obtenemos el monto de bolivia. */
				this.bolivia.monto = data[76].toFixed(2)
				/* Obtenemos el numero de proyecto de bolivia. */
				this.bolivia.proyectos = data[73]
				/* Obtenemos el nombre bolivia. */
				this.barChartLabels.push(data[72])
				/* Obtenemos los tipos de monedas de bolivia. */
				this.bolivia.monedas = data[77]




				/* Obtenemos los porcentajes de los paises para mostrarlos en la grafica. */
				this.barChartData.forEach(
					(item) => {
						item.data.push(data[3])
						item.data.push(data[9])
						item.data.push(data[15])
						item.data.push(data[21])
						item.data.push(data[27])
						item.data.push(data[33])
						item.data.push(data[39])
						item.data.push(data[45])
						item.data.push(data[51])
						item.data.push(data[57])
						item.data.push(data[63])
						item.data.push(data[69])
						item.data.push(data[75])
					}
				)
			})
			.then(() => this.estadisticaService.porAnio())
			.then((response) => {
				this.anios = response
				console.log(this.anios)
			})

			.catch(e => console.log('Error ' + e))
	}

	modoPie = (): any => {
		this.navCtrl.push(PiePage)
	}
}
