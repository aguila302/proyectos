import { Component, NgZone } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular'
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import { SelectColumnasPage } from '../select-columnas/select-columnas'
import { FiltrarColumnasPage } from './filtrar-columnas/filtrar-columnas'
import { DbService } from '../../../services/db.service'

// import {
// 	SelectAgrupacionesPage
// } from '../select-agrupaciones/select-agrupaciones'

@IonicPage()
@Component({
	selector: 'page-nuevo-reporte',
	templateUrl: 'nuevo-reporte.html',
})
export class NuevoReportePage {
	columnas = []
	columnas_seleccionadas = []
	filtrar_seleccionadas = []
	agrupacion_seleccionada = []
	settings = {}
	data = []
	xy = []
	categories = []
	options = {}
	visible: boolean = false
	visible_boton: boolean = false

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService: ReportesDbService, private modal: ModalController,
		public zone: NgZone, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private dbService: DbService) {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NuevoReportePage')
			// this.getColumnas()
	}

	/* Funcion para mostrar las comunas y escoger*/
	selectColumnas = (): void => {
		/* Pasamos las columnas a la vista de seleeccion de columnas. */
		let modal_columnas = this.modal.create(SelectColumnasPage, {})
		/* Muestro el modal para seleccionar las columnas. */
		modal_columnas.present()
		/* Cuando cierro mi modal recupero mis columnas que seleccione. */
		modal_columnas.onDidDismiss(data => {
			/* Aqui acomodo las columnas seleccionandas para mostrarlas en el grid. */
			this.columnas_seleccionadas.splice(0, this.columnas_seleccionadas.length)
			data.forEach(items => {
				this.columnas_seleccionadas.push({
					items
				})
			})

			/* Hacemos una copia de data para filtrar las columnas */
			this.filtrar_seleccionadas.splice(0, this.filtrar_seleccionadas.length)
			data.forEach(items => {
				this.filtrar_seleccionadas.push({
					items
				})
			})

			this.manageGrid(this.columnas_seleccionadas, [])
			this.columnas_seleccionadas.splice(0, this.columnas_seleccionadas.length)
		})
	}

	/* Funcion para filtar mis columnas seleccionadas.*/
	filtrarColumnas = () => {
		this.navCtrl.push(FiltrarColumnasPage, {
			'columnas-seleccionadas' : this.filtrar_seleccionadas
		})
	}

	/* Funcion que nos servira para graficar la informacion. */
	graficar = (columnas: Array < any > , agrupacion ? : Array < any > ): void => {
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

			this.reporteService.paraGraficar(columnas, agrupacion, [])
				.then(response => {
					let mi_data = []
					response.forEach(items => {
							mi_data.push(items.data)
						})
						/* monto total de todos los proyectos. */
					const collection_data = collect(mi_data)
					// let monto_total = collection_data.sum('monto')

					let keys = collection_data.keys().toArray()
					let encontrado_primer_agrupacion = keys.indexOf(primer_agrupacion)
					let r = keys[encontrado_primer_agrupacion]

					if (encontrado_primer_agrupacion !== -1) {
						let agrupados = collection_data.groupBy(primer_agrupacion).toArray()

						let datos = agrupados.map(function(item, monto) {
							// console.log(item[0])
							let num_proyectos = item[0]['numero_proyectos']
							let total = item[0]['total']

							// let suma_montos = item.reduce(function(index, proyecto) {
							// 	return index + parseInt(proyecto.monto)
							// }, 0)
							return {
								name: item[0][r],
								y: parseFloat(((num_proyectos / total) * 100).toFixed(2)),
							}
						})
						// this.options = this.reporteService.datosGrafica(datos, 10, '', 'Proyectos agrupados por ' + title.charAt(0).toUpperCase() + title.slice(1))
						this.visible_boton = !this.visible_boton
					}
				})
		}
	}

	/* Funcion para guardar un reporte. */
	guardarReporte = (agrupacion: Array < any > , Object): void => {
		let title = collect(agrupacion).implode('items', ',')
		let confirmacion = this.alertCtrl.create({
			title: 'Registro de reporte',
			message: 'Introduce un nombre para este nuevo reporte',
			inputs: [{
				name: 'title',
				placeholder: 'Nombre del reporte'
			}, ],
			buttons: [{
				text: 'Cancelar',
				handler: () => {
					console.log('Disagree clicked')
					confirmacion.dismiss()
				}
			}, {
				text: 'Guardar',
				handler: data => {
					console.log(data['title'])

					console.log('Agree clicked')
						/* Consigo el total del monto y numero de proyectos para registrar el reporte. */
					this.reporteService.paraGuardarReporte(title)
						.then(response => {
							let mi_collect = collect(response)
							let monto_total = mi_collect.sum('monto')
							let numero_proyectos = mi_collect.sum('numero_proyectos')

							this.reporteService.saveReporte(data['title'], monto_total, numero_proyectos)
								.then(response => {
									let last_id = response[0]['id']
									this.reporteService.insertarReporteAgrupado(last_id, title)
										.then(response => {
											console.log('insertarReporteAgrupado')
											console.log(response.insertId)
											this.reporteService.insertReporteColumnas(response.insertId, title)
												.then(response => {
													console.log('insertReporteColumnas')
													console.log(response.insertId)
													if (response.insertId !== 0) {
														console.log('regustro Exitoso')
														this.navCtrl.pop()
													}
												})
										})
								})
						})
				}
			}]
		})
		confirmacion.present()
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

			this.settings['columns'][items.items.columna] = {
				title: items.items.title,
				filter: false
			}
		})
		return this.settings
	}
}