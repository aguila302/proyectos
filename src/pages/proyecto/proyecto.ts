// https://github.com/ionic-team/cordova-plugin-wkwebview-engine
import { Component, NgZone } from '@angular/core'
import { Proyecto } from '../../interfaces/proyecto'
import { DetalleProyectoPage } from './DetalleProyecto'
import { ModalController, LoadingController, NavController, Platform } from 'ionic-angular'
import { FiltrosPage } from './filtros/filtros'
import { DbService } from '../../services/db.service'
import { LoginPage } from '../../pages/login/login'

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
		public zone: NgZone) {
	}
	proyectos = []
	items = []
	opciones = []


	ngOnInit(): void {
		console.log('iniciando aplicacion')
	}

	ionViewDidLoad() {
		this.platform.ready().then(() => {
			this.getProyectos()
		})
	}
	ionViewWillEnter() {
		console.log('volviste')
		this.getProyectos()
	}

	/* Obtenemos los proyectos del servicio db.service de proyectos. */
	getProyectos() {
		// let loading = this.loadingCtrl.create({
		// 	content: 'Por favor espere...'
		// })
		// loading.present()
		setTimeout(() => {
			this.dbService.openDatabase()
				.then(() => this.dbService.getProyectos())
				.then(proyectos => {
					console.log('mis proyectos')
					console.log(proyectos)
					this.zone.run(() => {
						console.log('running zone')
						this.proyectos = proyectos
						// if (this.proyectos.length > 1330)
						// loading.dismiss()
					})
				})
				.catch(console.error.bind(console))
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

	/* Funcion para cerrar sesion. */
	logout = () => {
		this.navCtrl.setRoot(LoginPage)
	}
}
