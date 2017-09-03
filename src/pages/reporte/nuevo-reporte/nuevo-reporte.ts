import {
	Component,
	NgZone
} from '@angular/core'
import {
	IonicPage,
	NavController,
	NavParams,
	ModalController,
	AlertController,
	LoadingController
} from 'ionic-angular'
import {
	ReportesDbService
} from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'

import {
	SelectColumnasPage
} from '../select-columnas/select-columnas'
import {
	SelectAgrupacionesPage
} from '../select-agrupaciones/select-agrupaciones'


@IonicPage()
@Component({
	selector: 'page-nuevo-reporte',
	templateUrl: 'nuevo-reporte.html',
})
export class NuevoReportePage {
	columnas = []
	columnas_seleccionadas = []
	agrupacion_seleccionada = []
	settings = {}
	data = []
	xy = []
	categories = []
	options = {}
	visible: boolean = false

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService: ReportesDbService, private modal: ModalController,
		public zone: NgZone, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NuevoReportePage')
		this.getColumnas()
	}

	/* Funcion para conseguir columnas. */
	getColumnas = (): any => {
		this.reporteService.getColumnas()
			.then(response => {
				response.forEach(items => {
					this.columnas.push({
						items
					})
				})
			})
	}

	/* Funcion para mostrar las comunas y escoger*/
	selectColumnas = (): void => {
		let mis_columnas = []
			/* Pasamos las columnas a la vista de seleeccion de columnas. */
		let modal_columnas = this.modal.create(SelectColumnasPage, {
				'columnas': this.columnas
			})
			/* Muestro el modal para seleccionar las columnas. */
		modal_columnas.present()
			/* Cuando cierro mi modal recupero mis columnas que seleccione. */
		modal_columnas.onDidDismiss(data => {
			/* Muestro las columnas seleccionadas en la vista. */
			this.columnas_seleccionadas.splice(0, this.columnas_seleccionadas.length)
			data.forEach(items => {
				this.columnas_seleccionadas.push({
					items
				})
			})

			/* Aqui acomodo las columnas seleccionandas para mostrarlas en el grid. */
			this.columnas_seleccionadas.forEach(items => {
				mis_columnas.push({
					items
				})
			})

			/* Voy a la funcion que me ayudara a conseguir la data de mis columnas. */
			this.getDataCampos(mis_columnas, data)
		})
	}

	/* Funcion para traer los datos de los campos seleccionados. */
	getDataCampos = (columnas, data): any => {
		let loader = this.loadingCtrl.create({
			content: "Please wait...",
		});
		loader.present();
		this.reporteService.obtenerDataCampos(data)
			.then(response => {
				this.zone.run(() => {
					this.manageGrid(columnas, response)
				})
				loader.dismiss()
			})
	}

	/* Funcion para mostrar las agrupaciones y escoger*/
	selectAgrupaciones = (columnas: Array < any > ): void => {
		/* Pasamos las columnas antes seleccionadas para las agruapciones. */
		let modal_agrupacion = this.modal.create(SelectAgrupacionesPage, {
				'agrupaciones': columnas
			})
			/* Muestro el modal para seleccionar las agrupaciones. */
		modal_agrupacion.present()

		modal_agrupacion.onDidDismiss(data => {
			/* Muestro las agruapciones seleccionadas en la vista. */
			this.agrupacion_seleccionada.splice(0, this.agrupacion_seleccionada.length)
			data.forEach(items => {
				this.agrupacion_seleccionada.push({
					items
				})
			})
		})
	}

	/* Funcion que nos servira para graficar la informacion. */
	graficar = (columnas: Array < any > , agrupacion: Array < any > ): void => {
		if (columnas.length === 0 || agrupacion.length === 0) {
			let alert = this.alertCtrl.create({
				title: 'Aviso!',
				subTitle: 'Por favor seleccione los columnas y la agrupación para visualizar la grafica!',
				buttons: ['OK']
			});
			alert.present();
		} else {
			this.visible = !this.visible
			let title = collect(agrupacion).implode('items', ',');
			let primer_agrupacion = collect(agrupacion).toArray()[0].items

			this.reporteService.paraGraficar(columnas, agrupacion)
				.then(response => {
					let mi_data = []
					response.forEach(items => {
						mi_data.push(items.data)
					})
					/* monto total de todos los proyectos. */
					const collection_data = collect(mi_data)
					let monto_total = collection_data.sum('monto')
	
					let keys = collection_data.keys().toArray()
					let encontrado_primer_agrupacion = keys.indexOf(primer_agrupacion)
					let r = keys[encontrado_primer_agrupacion]
					let arg = []
					if (encontrado_primer_agrupacion !== -1) {
						let agrupados = collection_data.groupBy(primer_agrupacion).toArray()

						let datos = agrupados.map(function(item, monto) {
							// console.log(item[0])
							let num_proyectos = item[0]['numero_proyectos']
							let total = item[0]['total']
			
							let suma_montos = item.reduce(function(index, proyecto) {
								return index + parseInt(proyecto.monto)
							}, 0)
							// 'porcentaje': account.toFixed((response.rows.item(index).numero_proyectos / response.rows.item(index).total) * 100, 2)
							return {
								name: item[0][r],
								y: parseFloat(((num_proyectos / total) * 100).toFixed(2)),
							}
						})
					this.options = this.reporteService.datosGrafica(datos, 10, '', 'Proyectos agrupados por ' + title.charAt(0).toUpperCase() + title.slice(1))
					}

				})
		}
	}

	/* Funcion para guardar un reporte. */
	guardarReporte = (agrupacion: Array < any > ): void => {
		let title = collect(agrupacion).implode('items', ',')
	}

	/* Funcion para llegar el grid.  */
	manageGrid = (columnas: Array < any > , data: Array < any > ): Object => {
		this.settings = {
			columns: {}
		}
		this.data = data

		columnas.forEach(items => {
			this.settings['hideSubHeader'] = false
			this.settings['hideHeader'] = false

			this.settings['columns'][items.items.items] = {
				title: items.items.items,
			}
			this.settings['pager'] = {
				display: true,
				perPage: 20,
			}
		})
		return this.settings
	}
}