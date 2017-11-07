import { Component, NgZone } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular'
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import { SelectColumnasPage } from '../nuevo-reporte/select-columnas/select-columnas'
import { SelectAgrupacionesPage } from '../nuevo-reporte/select-agrupaciones/select-agrupaciones'
import { FiltrarColumnasPage } from '../nuevo-reporte/filtrar-columnas/filtrar-columnas'
import { DbService } from '../../../services/db.service'

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

			/* Mostrarlas en el grid. */ 
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
	filtrarColumnas = () => {
		/* Creamos la vista para mostrar los filtros*/
		let modalFilter = this.modal.create(FiltrarColumnasPage, {
			'filtros_seleccionadas' : this.filtrar_seleccionadas
		})
		/* Muestro el modal para seleccionar las filtros. */
		modalFilter.present()
		/* Cuando cierro mi modal recupero mis columnas que seleccione. */
		modalFilter.onDidDismiss(data => {
			let misCampos = []
			let cadena = 'select '
			this.filtrar_seleccionadas.forEach(items => {
				misCampos.push(items.columna)
				cadena += `${items.columna}`
			})
			console.log(cadena)
			
			data.forEach(function(items, index){
				console.log(items[misCampos[index]])
			})
		})
	}

	/* Funcion para administrar el grid.  */
	manageGrid = (columnas: Array < any > , title: Array < any >, data: Array < any > ): Object => {
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
}