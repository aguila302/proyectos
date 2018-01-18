import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
	Grafico
} from '../../../../../highcharts/modulo.reportes/Grafico'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@IonicPage()
@Component({
	selector: 'page-grafica-circular-filtrada',
	templateUrl: 'grafica-circular-filtrada.html',
})
export class GraficaCircularFiltradaPage {

	dataGrafica = []
	segmento: string = ''
	options: Object
	grafico: Grafico
	groupBy: string = ''
	subtituloSegmento: string = ''
	title: string = ''
	nombreReporte: string = ''
	proyectos = []
	monto_total: string = ''
	total_proyectos: number

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.dataGrafica = navParams .get('data_grafica')
		this.segmento = navParams.get('segmento')
		this.groupBy = navParams.get('groupBy')
		// this.nombreReporte = navParams.get('nombreReporte')

		this.title = collect(this.dataGrafica).implode('campo', ',');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaCircularFiltradaPage');
		this.muestraGrafica()
	}

	/* Funcion para mostrar la grafica filtrada. */
	muestraGrafica = () => {
		let dataPie = []
		this.dataGrafica.forEach(item => {
			dataPie.push({
				name: item.campo,
				y: parseFloat(item.porcentaje)
			})
		})
		/*Realizamos la instancia a nuestra clase para contruir la grafica. */
		this.grafico = new Grafico(dataPie, this.groupBy, 'Proyectos agrupados por '  +this.groupBy, '%', 'Numero de proyectos'),
		this.options = this.grafico.graficaPie(this.subtituloSegmento = 'Porcentaje total de participación por ' + this.groupBy)

		/* Acomo la data para mostrar el tablero indicativo. */
		const collection = collect(this.dataGrafica)
		// this.monto_total = account.unformat(collection.sum('monto'))
		let monto_total = account.unformat(collection.sum('monto'))
		this.monto_total = account.formatNumber(monto_total),

		this.total_proyectos = collection.sum('numero_proyectos')
		let proyectos = collection.map(function(item) {
				console.log(item)
				
				return {
					'campo': item.campo,
					'porcentaje': item.porcentaje,
					'monto': account.formatNumber(item.monto),
					'numero_proyectos': item.numero_proyectos
				}
			})
			this.proyectos = proyectos
	}
}
