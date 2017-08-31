import { Component, NgZone } from '@angular/core'
import { IonicPage, NavController,NavParams, ModalController } from 'ionic-angular'
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { SelectColumnasPage } from '../select-columnas/select-columnas'
import { SelectAgrupacionesPage } from '../select-agrupaciones/select-agrupaciones'


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
	options = {}

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService: ReportesDbService, private modal: ModalController,
		public zone: NgZone) {

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
		this.reporteService.obtenerDataCampos(data)
			.then(response => {
				this.zone.run(() => {
					this.manageGrid(columnas, response)
				})
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
		let title = collect(agrupacion).implode('items', ',');
		
		this.reporteService.paraGraficar(columnas, agrupacion)
			.then(response => {
				this.xy.splice(0, this.xy.length)
				response.forEach(item => {
					this.xy.push({
						name: item.campo,
						y: parseFloat(item.porcentaje)
					})

				})

				this.options = this.reporteService.datosGrafica(this.xy, 2, '', 'Proyectos agrupados por ' + title)

			})
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