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

	/* Funcion que nos ayuda a obtener las datos para graficar. */
	async cargaGrafica(){
		var miGlobal = this
		var series = []
		series.splice(0, series.length)
		/*Iteramos las direcciones seleccionadas y vamos obteniendo la informacion necesaria para graficar.*/
		await this.direcciones.forEach(function callback(item, index) {
			var res = []
			/* Funcion para obtener la informacion por dirección selecconado. */
			miGlobal.dataDirecciones(item, miGlobal.anios).then(x => {
				x.forEach(item => {
				console.log('res')
					res.push(parseFloat(item))
					
				})
			})
			series.push({
				'name': item,
				'data': res
			})
		})
		/*Lamamos la funcion para graficar. */
		setTimeout(() => {
			this.options = this.reporteService.graficaDireccionAniosGeneral(this.anios.sort((function(a, b) { return b-a})), series, 'Direcciones')
			console.log(this.options)
		}, 2000)
	}
	/* Funcion realizar la consulta necesaria al origen de datos para obtener la data de las direccciones selecionadas.*/
	async dataDirecciones(direccion, anio) {
		var miGlobal = this
		this.data_direcciones.splice(0, this.data_direcciones.length)
		/* Funcion que nos ayudara a obtener la data por direccion y anio*/
		await this.reporteService.obtenerDataFiltracion(direccion, anio)
			.then(response => {
				miGlobal.data_direcciones = response
			})
		return miGlobal.data_direcciones
	}
}