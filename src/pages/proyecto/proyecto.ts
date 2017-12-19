// https://github.com/ionic-team/cordova-plugin-wkwebview-engine
import { Component, NgZone , Output, EventEmitter, Input} from '@angular/core'
import { Proyecto } from '../../interfaces/proyecto'
import { DetalleProyectoPage } from './DetalleProyecto'
import { ModalController, LoadingController, NavController, Platform, NavParams, App, ViewController } from 'ionic-angular'
import { FiltrosPage } from './filtros/filtros'
import { DbService } from '../../services/db.service'
import { LoginPage } from '../../pages/login/login'
import { ApiService } from '../../services/api'
import { IonicPage } from 'ionic-angular';

@IonicPage()
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
		public zone: NgZone, private apiService: ApiService,
		private navParams: NavParams,
		public viewCtrl: ViewController,
		public app: App) {
	}
	proyectos = []
	items = []
	opciones = []
	@Output() ionCancel: EventEmitter<UIEvent> = new EventEmitter<UIEvent>()
	@Input() cancelButtonText: string = 'Cancel';

	ionViewDidLoad() {
		this.getProyectos()
	}
	/* Obtenemos los proyectos del servicio db.service de proyectos. */
	getProyectos() {
		let loading = this.loadingCtrl.create({
			content: 'Sincronizando información...'
		})
		loading.present()
			// Cuando mostramos la primera pantalla creaammos las tablas faltantes con registros para el manejo de los reportes.
		this.dbService.getProyectos()
			.then(proyectos => {
				this.zone.run(() => {
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
		let root = LoginPage
		// this.navCtrl.pop()
		// this.app.getRootNav().setRoot(LoginPage)
		//this.navCtrl.popToRoot()
		// this.navCtrl.setRoot(LoginPage)
		// let rootPage: any = LoginPage;

	}
}
