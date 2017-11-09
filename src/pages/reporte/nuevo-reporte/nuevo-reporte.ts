import { Component, NgZone } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular'
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { SelectColumnasPage } from '../nuevo-reporte/select-columnas/select-columnas'
import { SelectAgrupacionesPage } from '../nuevo-reporte/select-agrupaciones/select-agrupaciones'
import { FiltrarColumnasPage } from '../nuevo-reporte/filtrar-columnas/filtrar-columnas'
import { DbService } from '../../../services/db.service'
import { Bar } from '../../../highcharts/modulo.estadisticas/bar'

// @IonicPage()
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
	bar: Bar

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService: ReportesDbService, private modal: ModalController,
		public zone: NgZone, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private dbService: DbService) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NuevoReportePage')
	}

	/* Funcion para mostrar las comunas y escoger*/
	selectColumnas = (): void => {
		var miGlobal = this
		/* Pasamos las columnas a la vista de seleeccion de columnas. */
		let modal_columnas = this.modal.create(SelectColumnasPage, {})
		/* Muestro el modal para seleccionar las columnas. */
		modal_columnas.present()
		/* Cuando cierro mi modal recupero mis columnas que seleccione. */
		modal_columnas.onDidDismiss(data => {
			/* Reseteamos los arreglos para actualizar las opciones seleccionadas. */
			this.columnas_seleccionadas.splice(0, this.columnas_seleccionadas.length)
			miGlobal.filtrar_seleccionadas.splice(0, this.filtrar_seleccionadas.length)

			/* Mostrarmos la grid. */ 
			this.manageGrid(data.columnas, data.title, [])

			/* Hacemos una copia de data para filtrar las columnas */
			data.columnas.forEach(function(item, index) {
				miGlobal.filtrar_seleccionadas.push({
					columna: item,
					title: data.title[index]
				})
			})
		})
	}

	/* Funcion para filtar mis columnas seleccionadas.*/
	filtrarColumnas() {
		if(this.filtrar_seleccionadas.length === 0) {
			let alert = this.alertCtrl.create({
				title: 'Aviso!',
				subTitle: 'Por favor seleccione los columnas para visualizar la grafica!',
				buttons: ['OK']
			});
			alert.present();
		}
		else {
			/* Creamos la vista para mostrar los filtros*/
			let modalFilter = this.modal.create(FiltrarColumnasPage, {
					'filtros_seleccionadas': this.filtrar_seleccionadas
				})
				/* Muestro el modal para seleccionar las filtros. */
			modalFilter.present()
				/* Cuando cierro mi modal recupero mis columnas que seleccione. */
			modalFilter.onDidDismiss(data => {
				let misCampos = []
				let cadena: string = `select `
				let nuevaCadena: string = ``
				let valoresIn: string = ''
				let values: string = ''
				let nuevoValues: string = ''

				this.filtrar_seleccionadas.forEach(items => {
					misCampos.push(items.columna)
					cadena += `${items.columna},`
					nuevaCadena = cadena.slice(0, -1)
					nuevaCadena += ` from proyectos where `
				})

				data.forEach(function(items, index) {
						let keys = Object.keys(items)
						items[`${keys}`].forEach(item => {
							values += `'${item}',`
							nuevoValues = values.slice(0, -1)
						})
						nuevaCadena += `${Object.keys(items)} in (${nuevoValues}) and `
					})
					/* Llamar a la funcion que nos ayudara a realizar la consulta para llenar la grid. */
				this.llenarGrid(nuevaCadena.slice(0, -5), this.filtrar_seleccionadas)
			})
		}
	}

	/* Funcion para realizar la consulta y obtener los datos para llegar nuestra grid. */
	llenarGrid = (consulta: string, filtros) => {
		let filtrosNew = []
		let titleNew = []
		filtros.forEach(item => {
			filtrosNew.push(item.columna)
		})
		filtros.forEach(item => {
			titleNew.push(item.title)
		})
		this.reporteService.getDataGrid(consulta, filtrosNew)
		.then(response => {
			this.data = response
			/* Mostrarmos la grid. */ 
			this.manageGrid(filtrosNew, titleNew, response)
		})
	}

	/* Funcion para administrar el grid.  */
	manageGrid = (columnas?: Array < any > , title?: Array < any >, data?: Array < any > ): Object => {
		this.settings = {
			columns: {}
		}
		var miGlobal = this
		this.data = data
		let contador = 0
		for(let opcion of columnas) {
			miGlobal.settings['hideSubHeader'] = false
			miGlobal.settings['hideHeader'] = false

			miGlobal.settings['columns'][opcion] = {
				title: title[contador],
				filter: false
			}
			contador ++
		}
		return miGlobal.settings
	}

	/* Funcion para mostrar las opciones para agrupar la grafica. */
	selectAgrupaciones() {
		console.log(this.filtrar_seleccionadas)
		if(this.filtrar_seleccionadas.length === 0) {
			let alert = this.alertCtrl.create({
				title: 'Aviso!',
				subTitle: 'Por favor seleccione los columnas y los filtros para visualizar la grafica!',
				buttons: ['OK']
			});
			alert.present();
		}
		else {
			/* Preparamos nuestras columnas para construir la grafica. */
			this.filtrar_seleccionadas.forEach(items => {
				this.columnas_seleccionadas.push(items.columna)
			})
			let modalAgrupaciones = this.modal.create(SelectAgrupacionesPage, {
					agrupaciones: this.filtrar_seleccionadas
				})
				/* Activamos la vista para seleccionar nuestra agrupacion. */
			modalAgrupaciones.present()

			/* Cuando cerramos la vista de agrapaciones recuperamos la agruapacion seleccionada. */
			modalAgrupaciones.onDidDismiss(response => {
				this.visible = false
				console.log('normal' + this.visible)
				console.log('!' + !this.visible)
				this.agrupacion_seleccionada = response

				/* Llamar a la funcion que se encarga de graficar. */
				this.graficar(this.columnas_seleccionadas, response)
			})
		}
	}

	/* Funcion que nos servira para graficar la informacion. */
	graficar(columnas: Array < any > , agrupacion: Array < any > ) {
		this.visible = !this.visible
		this.agrupacion_seleccionada = agrupacion
		this.reporteService.paraGraficar(columnas, agrupacion)
			.then(res => {
				/* refrescamos el arreglo de la grafica. */
				this.xy.splice(0, this.xy.length)

				let resultado = []
					/* Refactorizamos la data obtenida por la consulta. */
				for (var i = 0; i < res.rows.length; i++) {
					resultado.push({
						'campo': res.rows.item(i).campo,
						'monto': account.formatNumber(parseInt(res.rows.item(i).monto)),
						'total': res.rows.item(i).total,
						'numero_proyectos': res.rows.item(i).numero_proyectos,
						'monto_filtrado': res.rows.item(i).monto_filtrado,
						'porcentaje': account.toFixed((res.rows.item(i).numero_proyectos / res.rows.item(i).total) * 100, 2)
					})
				}
				/* Obtenemos la data final para construir la grafica */
				resultado.forEach(item => {
					this.xy.push({
						name: item.campo,
						y: parseFloat(item.porcentaje)
					})
				})
				this.zone.run(() => {
					/*Realizamos la instancia a nuestra clase para contruir la grafica. */
					this.bar = new Bar(this.xy, this.agrupacion_seleccionada[0], 'Proyectos agrupados por ' + this.agrupacion_seleccionada[0])
					this.options = this.bar.graficaBar()
					console.log(this.options)

					this.visible_boton = !this.visible_boton
				})
			})

	}
	/* Funcion para guardar un reporte. */
	guardarReporte = (): void => {
		let title = this.agrupacion_seleccionada[0]
		console.log(this.agrupacion_seleccionada[0])
		let confirmacion = this.alertCtrl.create({
			title: 'Registro de reporte',
			message: 'Introduce un nombre para este nuevo reporte',
			inputs: [{
				name: 'title',
				placeholder: 'Nombre del reporte'
			},],
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
}