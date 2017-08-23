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
	// data = []

	

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteServive : ReportesDbService, private modal: ModalController) {
		// this.data = [{
		// }]
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NuevoReportePage')
		this.getColumnas()
	}

	/* Funcion para conseguir columnas. */
	getColumnas = (): any => {
		this.reporteServive.getColumnas()
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
		modal_columnas.present()
		modal_columnas.onDidDismiss(data => {
			/* Muestro las columnas seleccionadas en la vista. */
			this.columnas_seleccionadas.splice(0, this.columnas_seleccionadas.length)
			data.forEach(items => {
				this.columnas_seleccionadas.push({items})
			})
			this.columnas_seleccionadas.forEach(items => {
				mis_columnas.push({items})
			})
			this.manageGrid(mis_columnas)
			this.getDataCampos(mis_columnas)
		})
		
	}
	/* Funcion para llegar el grid.  */
	manageGrid = (columnas: Array<any>): Object => {

		this.settings = {
			columns: {},
		}

		columnas.forEach(items => {
			this.settings['hideSubHeader'] = true
			this.settings['hideHeader'] = false
			this.settings['actions'] = false

			this.settings['actions'] = {
				columnTitle: 'Actionsgg',
				add: false,
				edit: false,
				delete: false,
				custom: true,
				// custom: [],
				position: 'right',
			}
			this.settings['add'] = {
				inputClass: '',
				addButtonContent: '',
				createButtonContent: '',
				cancelButtonContent: '',
				confirmCreate: false,
			}
			
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
		// console.log(this.settings)
		
		return this.settings
	}

	/* Funcion para traer los datos de los campos seleccionados. */
	getDataCampos = (columnas): void => {
		this.reporteServive.obtenerDataCampos(columnas)
		.then(response => {
			console.log(response)
		})
	}
}
