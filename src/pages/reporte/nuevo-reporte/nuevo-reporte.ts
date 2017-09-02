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
			let segunda_agrupacion = collect(agrupacion).toArray()[1].items

			this.reporteService.paraGraficar(columnas, agrupacion)
				.then(response => {
					let mi_data = []
						/* Obtenemos las categorias para construir la grafica. */
					this.categories.splice(0, this.xy.length)
					response.forEach(item => {
						mi_data.push(item.data)
					})

					const collection_data = collect(mi_data)
					let keys = collection_data.keys().toArray()
					let encontrado_primer_agrupacion = keys.indexOf(primer_agrupacion)
					let r = keys[encontrado_primer_agrupacion]
					let arg = []
					if (encontrado_primer_agrupacion !== -1) {
						collection_data.each(function(item) {
							arg.push(item[r])
						})
					}
					this.categories = arg
						/* Para formar la data se la serie de la grafica. */
					let encontrado_segunda_agrupacion = keys.indexOf(segunda_agrupacion)
					let r2 = keys[encontrado_segunda_agrupacion]
					let arg2 = []
					if (encontrado_segunda_agrupacion !== -1) {
						let group = collection_data.groupBy(primer_agrupacion).toArray()
						group.map(function (item) {
							// console.log(item)
						})
						
					}
					this.categories = collect(this.categories).unique().all()
					this.options = this.reporteService.datosGraficaAgrupados(arg2, 0, this.categories, 'Proyectos agrupados por ' + title)
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