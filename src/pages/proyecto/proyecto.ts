import { Component, OnInit } from '@angular/core'
import { NavController } from 'ionic-angular'
import { Proyecto } from '../../interfaces/proyecto'
import { DetalleProyectoPage } from './DetalleProyecto'
import { ModalController, LoadingController } from 'ionic-angular'
import { FiltrosPage } from './filtros/filtros'
import { DbService } from '../../services/db.service'

@Component({
	selector: 'page-proyecto',
	templateUrl: 'proyecto.html'
})

/* Clase de mi componente proyecto.html */
export class ProyectoPage {

	proyectos = []
	items = []
	opciones = []


	ionViewDidLoad(): void {
		//
		this.creaDB()
		this.getProyectos()
	}

	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public dbService: DbService,
		public loadingCtrl: LoadingController) {

	}

	/* Obtenemos los proyectos del servicio db.service de proyectos. */
	getProyectos() {
		setTimeout(() => {
			this.dbService.openDatabase()
			.then(() => this.dbService.getProyectos())
			.then(proyectos => {
				this.proyectos = proyectos
			})
			.catch(e => console.log(e))
			//this.loading.dismiss()
		}, 0)
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

	/* Funcion para inicializar la base de datos. */
	creaDB = (): void  => {
		
		// let loading = this.loadingCtrl.create({
		// 	content: 'Por favor espere',
		// })
		// loading.present()
		this.dbService.openDatabase()
		//.then(() => this.dbService.revisionDatos())
		// .then(() => this.dbService.resetTable())
		.then(() => this.dbService.createTable())
		.then(() => this.dbService.insertaDatos())

		.then(() => {
			//this.getProyectos()
		})
		// loading.dismiss()

		//.then(() => this.dbService.getProyectos())
		//.then(() => this.getProyectos())
	}

}
