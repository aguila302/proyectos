// https://github.com/ionic-team/cordova-plugin-wkwebview-engine
import { Component, NgZone } from '@angular/core'
import { Proyecto } from '../../interfaces/proyecto'
import { DetalleProyectoPage } from './DetalleProyecto'
import { ModalController, LoadingController, NavController, Platform } from 'ionic-angular'
import { FiltrosPage } from './filtros/filtros'
import { DbService } from '../../services/db.service'
import { LoginPage } from '../../pages/login/login'
import { ApiService } from '../../services/api'

@Component({
	selector: 'page-proyecto',
	templateUrl: 'proyecto.html'
})

/* Clase de mi componente proyecto.html */
export class ProyectoPage {

	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public dbService: DbService,
		public loadingCtrl: LoadingController,
		public platform: Platform,
		public zone: NgZone, private apiService: ApiService) {
	}
	proyectos = []
	items = []
	opciones = []

	ionViewDidLoad() {
		this.getProyectos()
	}
	/* Obtenemos los proyectos del servicio db.service de proyectos. */
	getProyectos() {
		let loading = this.loadingCtrl.create({
			content: 'Actualizando proyectos...'
		})
		loading.present()
		setTimeout(() => {
			// Cuando mostramos la primera pantalla creaammos las tablas faltantes con registros para el manejo de los reportes.
			this.dbService.openDatabase()
				.then(() => this.dbService.getProyectos())
				.then(proyectos => {
				this.dbService.creaTablaReportes()
					// .then(() => this.dbService.creaTablaReporteColumnas())
					// .then(() => this.dbService.creaTablaReporteFiltros())
					// .then(() => this.dbService.creaTablaReporteAgrupaciones())
					.then(() => this.dbService.insertaDatosTablaReportes())
					.then(() => this.dbService.insertaDatosTablaReportesColunas())
					.then(() => this.dbService.insertaDatosTablaReportesAgrupacion())
					// .then(() => this.dbService.createTableAnios())
					.then(() => this.dbService.insertAnios())
					// .then(() => this.dbService.createTableDireccionAnios())
					.then(() => this.dbService.insertDireccionAnios())

					this.zone.run(() => {
						this.proyectos = proyectos
					})

					/* Funcion para registrar un log de la sincronizacion. */
					this.apiService.regitraSincronizacion(proyectos.length)
					loading.dismiss()
				})
				.catch(console.error.bind(console))
		}, 15000)
	}

	/* Funcion para ver el detalle de un proyecto. */
	detalleProyecto = (_proyecto: Proyecto): void => {
		this.navCtrl.push(DetalleProyectoPage, {
			id: _proyecto
		})
	}

	/* Funcion para filtar los proyectos. */
	buscaProyectos = (event: any, filtros = this.opciones): void => {
		// Obtenemos el valor del input.
		let val = event.target.value

		// Si el valor no es vacio filtra los proyectos.
		val && val.trim() != '' ? (
			setTimeout(() => {
				this.dbService.openDatabase()
					.then(() => this.dbService.buscaProyecto(val, filtros))
					.then(proyectos => {
						this.proyectos = proyectos
					})
					.catch(e => console.log(e))
			}, 0)
		) : (
			/* Si no hay ningun valor en el campo muestra el listado de los proyectos. */
			this.getProyectos()
		)
	}

	/* Funcion que muestra los filtros de busqueda. */
	muestraFiltros = (): void => {
		/* Creamos una ventana modal.*/
		let filterModal = this.modalCtrl.create(FiltrosPage)
		/* Mostramos la ventana modal. */
		filterModal.present()
		/* Cierra la ventana modal y recuperamos las opciones que se seleccionaron. */
		filterModal.onDidDismiss(data => {
			this.opciones = data
		})
	}

	/* Funcion para cerrar sesion. */
	logout = () => {
		this.navCtrl.setRoot(LoginPage)
	}
}
