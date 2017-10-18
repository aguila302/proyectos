import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportesDbService } from '../../../../../services/reportes.db.service'

@IonicPage()
@Component({
	selector: 'page-grafica-filtros-direccion-anio',
	templateUrl: 'grafica-filtros-direccion-anio.html',
})
export class GraficaFiltrosDireccionAnioPage {
	direcciones = []
	anios = []
	options = {}
	data_direcciones = []

	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteService: ReportesDbService) {
		this.direcciones = navParams.get('direccion')
		this.anios = navParams.get('anios')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaFiltrosDireccionAnioPage');
		this.cargaGrafica()
	}

	async cargaGrafica(){
		var miGlobal = this
		var series = []
		series.splice(0, series.length)
		await this.direcciones.forEach(function callback(item, index) {
			var res = []
			miGlobal.dataDirecciones(item, miGlobal.anios).then(x => {
				x.forEach(item => {
				console.log('res')
					res.push(parseFloat(item))
					
				})
			})
			// console.log(res)
			
			series.push({
				'name': item,
				'data': res
			})
		})
		console.log(series);

		setTimeout(() => {
			this.options = this.reporteService.graficaDireccionAniosGeneral(this.anios, series, 'Direcciones')
			console.log(this.options)
		}, 2000)
	}
	/* Funcion realizar la consulta necesaria al origen de datos para obtener la data de las direccciones selecionadas.*/
	async dataDirecciones(direccion, anio) {
		var miGlobal = this
		this.data_direcciones.splice(0, this.data_direcciones.length)

		await this.reporteService.obtenerDataFiltracion(direccion, anio)
			.then(response => {
				// console.log(response)
				miGlobal.data_direcciones = response
				// response.forEach(item => {
				// 	miGlobal.data_direcciones.push(parseInt(item))
				// })
			})
		// console.log('data')
		// console.log(miGlobal.data_direcciones)
		
		return miGlobal.data_direcciones
		
	}
}