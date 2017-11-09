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

		/* Creamos la vista para mostrar los filtros*/
		let modalFilter = this.modal.create(FiltrarColumnasPage, {
			'filtros_seleccionadas' : this.filtrar_seleccionadas
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

			data.forEach(function(items, index){
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
	selectAgrupaciones = () => {
		console.log(this.filtrar_seleccionadas)
		let modalAgrupaciones =  this.modal.create(SelectAgrupacionesPage, {
			agrupaciones: this.filtrar_seleccionadas
		})
		modalAgrupaciones.present()
	}
}