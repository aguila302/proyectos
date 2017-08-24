import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular'
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { SelectColumnasPage } from '../select-columnas/select-columnas'


@IonicPage()
@Component({
	selector: 'page-nuevo-reporte',
	templateUrl: 'nuevo-reporte.html',
})
export class NuevoReportePage {
	columnas = []
	columnas_seleccionadas = []
	settings = {}
	data = []

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService : ReportesDbService, private modal: ModalController) {
		
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
					this.columnas.push({items})
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
				this.columnas_seleccionadas.push({items})
			})

			/* Aqui acomodo las columnas seleccionandas para mostrarlas en el grid. */
			this.columnas_seleccionadas.forEach(items => {
				mis_columnas.push({items})
			})
			// this.manageGrid(mis_columnas)
			/* Voy a la funcion que me ayudara a conseguir la data de mis columnas. */
			this.getDataCampos(mis_columnas, data)
		})
	}

	/* Funcion para traer los datos de los campos seleccionados. */
	getDataCampos = (columnas, data): any => {
		this.reporteService.obtenerDataCampos(data)
		.then(response => {
			this.manageGrid(columnas, response)
		})
	}

		/* Funcion para llegar el grid.  */
	manageGrid = (columnas: Array<any>, data: Array<any>): Object => {

		this.settings = {
			columns: {},
		}
		this.data = data
		// console.log(this.data)
		

		columnas.forEach(items => {
			this.settings['hideSubHeader'] = false
			this.settings['hideHeader'] = false
	
			this.settings['columns'][items.items.items] = {
				title: items.items.items,
				filter: {
					type: 'list',
					config: {
						selectText: 'Select...',
						list: [{
							value: 'Glenna Reichert',
							title: 'Glenna Reichert'
						}, {
							value: 'Kurtis Weissnat',
							title: 'Kurtis Weissnat'
						}, {
							value: 'Chelsey Dietrich',
							title: 'Chelsey Dietrich'
						}, ],
					},
				},
			}
		})
		return this.settings
	}
}
