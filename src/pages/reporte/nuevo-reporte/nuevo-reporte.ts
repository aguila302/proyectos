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
		private reporteServive : ReportesDbService, private modal: ModalController) {
		this.settings = {
			columns: {
				id: {
					title: 'ID',
				},
				name: {
					title: 'Full Name',
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
				},
				email: {
					title: 'Email',
					filter: {
						type: 'completer',
						config: {
							completer: {
								data: this.data,
								searchFields: 'email',
								titleField: 'email',
							},
						},
					},
				},
				passed: {
					title: 'Passed',
					filter: {
						type: 'checkbox',
						config: {
							true: 'Yes',
							false: 'No',
							resetText: 'clear',
						},
					},
				},
			},
		};

		this.data = [{
			id: 4,
			name: 'Patricia Lebsack',
			email: 'Julianne.OConner@kory.org',
			passed: 'Yes',
		}, {
			id: 5,
			name: 'Chelsey Dietrich',
			email: 'Lucio_Hettinger@annie.ca',
			passed: 'No',
		}, {
			id: 6,
			name: 'Mrs. Dennis Schulist',
			email: 'Karley_Dach@jasper.info',
			passed: 'Yes',
		}, {
			id: 7,
			name: 'Kurtis Weissnat',
			email: 'Telly.Hoeger@billy.biz',
			passed: 'No',
		}, {
			id: 8,
			name: 'Nicholas Runolfsdottir V',
			email: 'Sherwood@rosamond.me',
			passed: 'Yes',
		}, {
			id: 9,
			name: 'Glenna Reichert',
			email: 'Chaim_McDermott@dana.io',
			passed: 'No',
		}, {
			id: 10,
			name: 'Clementina DuBuque',
			email: 'Rey.Padberg@karina.biz',
			passed: 'No',
		}, {
			id: 11,
			name: 'Nicholas DuBuque',
			email: 'Rey.Padberg@rosamond.biz',
			passed: 'Yes',
		}, ]
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
		})
	}
}
