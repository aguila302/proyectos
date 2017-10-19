import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams
} from 'ionic-angular';
import {
	ReportesDbService
} from '../../../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

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
	title: string = ''
	proyectos = []
	reporte_tablero = []
	monto_total: string = ''
	total_proyectos: number

	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteService: ReportesDbService) {
		this.direcciones = navParams.get('direccion')
		this.anios = navParams.get('anios')
		this.title = collect(this.anios).implode(',');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaFiltrosDireccionAnioPage');
		this.cargaGrafica()
	}

	/* Funcion que nos ayuda a obtener las datos para graficar. */
	async cargaGrafica() {
			var miGlobal = this
			var series = []
			series.splice(0, series.length)
				/*Iteramos las direcciones seleccionadas y vamos obteniendo la informacion necesaria para graficar.*/
			await this.direcciones.forEach(function callback(item, index) {
				var res = []
					/* Funcion para obtener la informacion por dirección selecconado. */
				miGlobal.dataDirecciones(item, miGlobal.anios).then(x => {
					x.forEach(item => {
						res.push(parseFloat(item))
					})
				})
				series.push({
					'name': item,
					'data': res
				})
				/* Funcion para obtener la informacion del tablero informativo*/
				miGlobal.tableroInfomativo(item, miGlobal.anios).then(response => {
					miGlobal.proyectos = collect(response).sortByDesc('anio').all()
					/* Obtenemos el total de proyectos.*/
					miGlobal.total_proyectos = collect(response).sum('numero_proyectos')
					/* Obtenemos la suma total del monto en USD*/
					miGlobal.monto_total = account.formatNumber(collect(response).sum('monto'))
				})
			})

			/*Lamamos la funcion para graficar. */
			setTimeout(() => {
				this.options = this.reporteService.graficaDireccionAniosGeneral(this.anios.sort((function(a, b) {
					return b - a
				})), series, 'Direcciones por porcentaje de participación')
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

	/* Funcion para obtener la informacion del tablero informativo*/
	async tableroInfomativo(direcciones: string, anios: number[]) {
		var miGlobal = this
		this.reporte_tablero.splice(0, this.reporte_tablero.length)
		/* Funcion para hacer la consulta al origen de datos y obtener la data para el tablero. */
		await this.reporteService.tableroDireccionAniosGeneral(direcciones, anios)
			.then(response => {
				response.forEach(item => {
					miGlobal.reporte_tablero.push({
						'porcentaje': item.porcentaje,
						'anio': item.anio,
						'unidad_negocio': item.unidad_negocio,
						'monto': item.monto,
						'numero_proyectos': item.numero_proyectos,
						'total': item.total,
					})
				})
			})
		return miGlobal.reporte_tablero
	}
}