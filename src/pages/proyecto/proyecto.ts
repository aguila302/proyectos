import { Component, OnInit } from '@angular/core'
import { NavController } from 'ionic-angular'
import { ProyectoService } from '../../services/proyecto.service'
import { Proyecto } from '../../interfaces/proyecto'
import { DetalleProyectoPage } from './DetalleProyecto'
import { ModalController, NavParams } from 'ionic-angular'
import { FiltrosPage } from './filtros/filtros'
import { DbService } from '../../services/db.service'
import * as collect from 'collect.js/dist'

@Component({
	selector: 'page-proyecto',
	templateUrl: 'proyecto.html'
})

/* Clase de mi componente proyecto.html */
export class ProyectoPage implements OnInit{

	proyectos = []
	items = []
	opciones = []

	ngOnInit(): void {
		this.getProyectos()
		this.opciones['nombre_proyecto'] = 'nombre_proyecto'
		// this.creaDB()
	}

	constructor(
		public navCtrl: NavController,
		private proyectoService: ProyectoService,
		public modalCtrl: ModalController,
		public dbService: DbService) {
		
	}

	/* Obtenemos los proyectos del servicio db.service de proyectos. */
	getProyectos = (): any => {
		setTimeout(() => {
			this.dbService.openDatabase()
			.then(() => this.dbService.getProyectos())
			.then(response => {
				this.proyectos = response
			}).catch(e => console.log(e))
		}, 0)

		// setTimeout (() => {
		// 	this.proyectoService.getProyectos()
		// 		.then(proyectos => this.proyectos = proyectos)
		// }, 100)
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
				this.proyectos = this.proyectoService.filtrarProyectos(val)
					.then(items => this.items = items)
					.then(() => this.proyectos = this.proyectoService.muestraProyecto(this.items, val, filtros))
			}, 500)
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

	// creaDB = (): void  => {
	// 	this.dbService.openDatabase()
	// 	.then(() => this.dbService.createTable())
	// 	.then(() => this.dbService.insertaDatos())
	// 	.then(() => this.dbService.getProyectos())
	// 	.then(response => {

	// 	})
	// }
}
