import {
	Component
} from '@angular/core';
import {
	LoadingController,
	NavController,
	Platform,
	AlertController,
	ToastController
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

	loader = this.loadinCtrl.create({
		content: 'Conectando ...',
	})

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
		public dbService: DbService,
		private toast: ToastController) {
		this.fechaActual = moment().format('YYYY-MM-DD h:mm:ss')
	}

	ionViewDidLoad() {}

	/* Funcion para loguar al usuario */
	login = (): void => {
		// En caso de que no se introduzca datos mostramos un mensaje.
		if (this.username == '' || this.password == '') {
			let msj = this.alertCtrl.create({
				title: 'Login',
				message: 'Debe completar el usuario y la clave de acceso',
				buttons: ['OK']
			})
			msj.present()
		} else {

			/* Resolvemos el api para loguer al usuario y obtener el token. */
			this.apiService.resolveApi(this.username, this.password)
				.then(response => {
					if (response === undefined) {
						/* En caso de error no autorizado mostramos una advertencia  */
						let msj = this.alertCtrl.create({
							title: 'Advertencia',
							message: 'El usuario o clave de acceso son incorrectos',
							buttons: ['OK']
						})
						msj.present()
							// loading.dismiss()
							// }, 5000)
					} else {
						let lastFecha: string = ''
							/* Si hay un token valido obtenemos la ultima fecha de sincronizacion. */
						this.reporteService.getLastDateSincronizacion()
							.then(response => {
								if (response.length === 0) {
									lastFecha = ''
								} else {
									lastFecha = response[0].fecha_registro
								}
								console.log('Ultima sincronizacion   ' + lastFecha)
									/* Funcion para resolver el endpoint del api y para validar las fechas de modificaciones. */
								this.loader.present()
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

		this.apiService.readerArchivoExcel(lastFecha)
			.then(response => {
				console.log(response)
				this.loader.dismiss()
					/*
					Si el status 200 no hay sincronisacion, en caso contrario sincronizamos
					 */
				response.status === 200 ? (
						setTimeout(() => {
							// construimos el origen de datos faltante para el modulo de reportes.
							this.navCtrl.push(TabsPage, {}, {
								animate: true,
								animation: 'ios-transition',
								direction: 'forward'
							})

							this.dbService.delete()
							this.dbService.creaTablaReportes()
							this.dbService.creaTablaReporteColumnas()
							this.dbService.creaTablaReporteFiltros()
							this.dbService.creaTablaReporteAgrupaciones()
							this.dbService.createTableAnios()
							this.dbService.createTableDireccionAnios()

							this.dbService.insertaDatosTablaReportes(),
								this.dbService.insertaDatosTablaReportesColunas(),
								this.dbService.insertaDatosTablaReportesAgrupacion(),
								this.dbService.insertAnios(),
								this.dbService.insertDireccionAnios()
						}, 1000)
					) :
					(
						this.sincronizar()
					)

			})
			.catch(error => {
				console.error.bind(console)
			})
	}

	/* Funcion para sincronizar la informacion con la aplicacion movil. */
	sincronizar() {
		this.apiService.fetch()
			.then(response => {
				this.navCtrl.push(TabsPage, {}, {
						animate: true,
						animation: 'ios-transition',
						direction: 'forward'
					})
					/* LLamar a la funcion que nos ayudara a registrar la informacion del endpoint a nuestra aplicacion movil. */
				this.apiService.regitrarData(response)
					/* Funcion para registrar un historial de la sincronizacion. */
				this.apiService.regitraSincronizacion()
					// construimos el origen de datos faltante para el modulo de reportes.
				this.dbService.delete()
				this.dbService.creaTablaReportes()
				this.dbService.creaTablaReporteColumnas()
				this.dbService.creaTablaReporteFiltros()
				this.dbService.creaTablaReporteAgrupaciones()
				this.dbService.createTableAnios()
				this.dbService.createTableDireccionAnios()
				this.dbService.insertaDatosTablaReportes()
				this.dbService.insertaDatosTablaReportesColunas()
				this.dbService.insertaDatosTablaReportesAgrupacion()
				this.dbService.insertAnios()
				this.dbService.insertDireccionAnios()
				this.loader.dismiss()
			})
	}
}