// https://github.com/ionic-team/cordova-plugin-wkwebview-engine
import { Component, NgZone } from '@angular/core'
import { Proyecto } from '../../interfaces/proyecto'
import { DetalleProyectoPage } from './DetalleProyecto'
import { ModalController, LoadingController, NavController, Platform, NavParams, App, ViewController, AlertController } from 'ionic-angular'
import { FiltrosPage } from './filtros/filtros'
import { DbService } from '../../services/db.service'
import { LoginPage } from '../../pages/login/login'
import { ApiService } from '../../services/api'
import { IonicPage } from 'ionic-angular';
import { TabsPage } from '../../pages/tabs/tabs';
import { OpcionesPage } from '../../pages/proyecto/opciones/opciones'
import { ReportesDbService } from '../../services/reportes.db.service'
import * as collect from 'collect.js/dist'

@Component({
	selector: 'page-proyecto',
	templateUrl: 'proyecto.html'
})

/* Clase de mi componente proyecto.html */
export class ProyectoPage {
	lastFechaSincronizacion: string = ''

	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public dbService: DbService,
		public loadingCtrl: LoadingController,
		public platform: Platform,
		public zone: NgZone, private apiService: ApiService,
		private navParams: NavParams,
		public viewCtrl: ViewController,
		public app: App,
		private alert: AlertController,
		private reporteService: ReportesDbService,) {
	}

	proyectos = []
	items = []
	opciones = []
	textoBusqueda: string = ''

	ionViewDidLoad() {
		this.getProyectos()
		this.obtenerUltimaFechaSincronizacion()
	}
	/* Obtenemos los proyectos del servicio db.service de proyectos. */
	getProyectos() {
		let loading = this.loadingCtrl.create({
			content: 'Cargando proyectos, por favor espere...'
		})
		loading.present()
			// Cuando mostramos la primera pantalla creaammos las tablas faltantes con registros para el manejo de los reportes.
		this.dbService.getProyectos()
			.then(proyectos => {
				this.zone.run(() => {
					let order = collect(proyectos).sortBy(function(item, key) {
						return item['nombre_proyecto']
					})
					console.log(order.all())
					
					this.proyectos = proyectos
					loading.dismiss()
				})
			})
			.catch(console.error.bind(console))
	}

	/* Funcion para ver el detalle de un proyecto. */
	detalleProyecto = (_proyecto: Proyecto): void => {
		this.navCtrl.push(DetalleProyectoPage, {
			id: _proyecto
		})
	}

	/* Funcion para filtar los proyectos. */
	buscaProyectos = (event: any, filtros = this.opciones): void => {
		// Cuando inicia la aplicacion establecemos valores definidos para la busqueda.
		this.opciones.length === 0 ? (
			this.opciones['anio'] = 'anio',
			this.opciones['contratante'] = 'contratante',
			this.opciones['datos_cliente'] = 'datos_cliente',
			this.opciones['nombre_proyecto'] = 'nombre_proyecto',
			this.opciones['pais'] = 'pais',
			this.opciones['producto'] = 'producto'
			
		): ''
		console.log(this.opciones)
		
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
		this.app.getRootNav().setRoot(LoginPage, {}, {animate: true, animation: 'ios-transition', direction: 'forward'})
	}

	/* Funcion para mostrar las opciones de ayuda */
	mostrarOpciones = () => {
		let ventana = this.modalCtrl.create(OpcionesPage, {lastFechaSincronizacion: this.lastFechaSincronizacion})
		ventana.present()
	}
	/* Funcion para obtener la ultima fecha de sincronizacion. */
	obtenerUltimaFechaSincronizacion = () => {
		this.reporteService.getLastDateSincronizacion()
		.then(response => {
			console.log(response[0].fecha_registro)
			this.lastFechaSincronizacion = response[0].fecha_registro
		})
	}

	/*Funcion para buscar proyectos relacionados en texto que se tecleo. */
	busquedaProyectos = () => {
		let alert = this.alert.create({
			title: 'Advertencia',
			subTitle: 'El valor de la búsqueda no puede ser vacío, por favor introduce un valor',
			buttons: ['OK']
		})
		this.textoBusqueda === '' ? (alert.present()):
		(
			this.dbService.busquedaProyectos(this.textoBusqueda)
			.then(response => {
				console.log(response)
				this.proyectos = response
			})
			.catch(console.error.bind(console))
		)
	}
}
