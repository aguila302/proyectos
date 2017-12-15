import {
	Component
} from '@angular/core';
import {
	LoadingController,
	NavController,
	Platform,
	AlertController
} from 'ionic-angular';
import {
	TabsPage
} from '../../pages/tabs/tabs';
import {
	ApiService
} from '../../services/api'
import {
	DbService
} from '../../services/db.service'
import * as collect from 'collect.js/dist'
import {
	ReportesDbService
} from '../../services/reportes.db.service'
import * as moment from 'moment'

@Component({
		selector: 'page-login',
		templateUrl: 'login.html',
	})
	/**
	 * Componenete para el manejo de sesion.
	 */
export class LoginPage {

	username: string = ''
	password: string = ''
	fechaActual = ''

	constructor(
		public platform: Platform,
		private alertCtrl: AlertController,
		private loadinCtrl: LoadingController,
		private navCtrl: NavController,
		private apiService: ApiService,
		private reporteService: ReportesDbService,
		public dbService: DbService) {
		this.fechaActual = moment().format('YYYY-MM-DD h:mm:ss')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	/* Funcion para loguar al usuario */
	login = (): void => {
		if (this.username == '' || this.password == '') {
			let alert = this.alertCtrl.create({
				title: 'Login',
				subTitle: 'Debe completar el usuario y la clave de acceso',
				buttons: ['Aceptar']
			})
			alert.present()
		} else {
			/* Resolvemos el api para loguer al usuario y obtener el token. */
			this.apiService.resolveApi(this.username, this.password)
				.then(response => {
					if (response === undefined) {
						/* En caso de error */
						let alert = this.alertCtrl.create({
							title: 'Login',
							subTitle: 'Usuario o clave de acceso incorrectos',
							buttons: ['Aceptar']
						})
						alert.present()
					} else {

						let lastFecha: string = ''
							/* Si hay un token valido obtenemos la ultima fecha de sincronizacion. */
						this.reporteService.getLastDateSincronizacion()
							.then(response => {
								response.length === 0 ? lastFecha = this.fechaActual : lastFecha = response[0].fecha_registro
								console.log('Ultima sincronizacion   ' + lastFecha)

								/* Funcion para resolver el endpoint del api y para validar las fechas de modificaciones. */
								this.validarRecursos(lastFecha)
							})
					}
				})
				.catch(error => {
					console.error.bind(console)
				})
		}
	}

	/* Funcion para resolver el endpoint para cargar el archivo excel al origen de datos. */
	validarRecursos(lastFecha: string) {
		let loader = this.loadinCtrl.create({
			content: 'Verificando información',
		})
		loader.present()

		this.apiService.readerArchivoExcel(lastFecha)
			.then(response => {
				console.log(response)
					/*
					Si el status 200 no hay sincronisacion, en caso contrario sincronizamos
					 */
				response.status === 200 ? (
						setTimeout(() => {
							this.navCtrl.setRoot(TabsPage)
							loader.dismiss()
						}, 1000)
					) :
					(
						loader.dismiss(),
						this.sincronizar()
					)

			})
			.catch(error => {
				console.error.bind(console)
			})
	}

	/* Funcion para sincronizar la informacion con la aplicacion movil. */
	sincronizar() {
		// let loaderSincronizacion = this.loadinCtrl.create({
		// 	content: 'Sincronizando información...',
		// })
		// loaderSincronizacion.present()
		this.apiService.fetch()
			.then(response => {
				this.navCtrl.setRoot(TabsPage, {})
				/* LLamar a la funcion que nos ayudara a registrar la informacion del endpoint a nuestra aplicacion movil. */
				this.apiService.regitrarData(response)
				/* Funcion para registrar un historial de la sincronizacion. */
				this.apiService.regitraSincronizacion()

			})
	}
}