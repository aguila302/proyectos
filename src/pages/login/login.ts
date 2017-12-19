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
	ProyectoPage
} from '../../pages/proyecto/proyecto';

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

	loader = this.loadinCtrl.create({
		content: 'Verificando información',
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
		private toast : ToastController) {
		this.fechaActual = moment().format('YYYY-MM-DD h:mm:ss')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	/* Funcion para loguar al usuario */
	login = (): void => {
		// En caso de que no se introduzca datos mostramos un mensaje.
		if (this.username == '' || this.password == '') {
			let msj = this.toast.create({
				message: 'Debe completar el usuario y la clave de acceso',
				duration: 4000,
				position: 'middle'
			})
			msj.present()
		} else {

			/* Resolvemos el api para loguer al usuario y obtener el token. */
			this.apiService.resolveApi(this.username, this.password)
				.then(response => {
					if (response === undefined) {
						/* En caso de error no autorizado mostramos una advertencia  */
						 let loading  = this.loadinCtrl.create({
						 	spinner: 'crescent',
							content: 'Conectando ...'
						})
						loading.present()
						setTimeout(() => {
							let msj = this.toast.create({
								message: 'Usuario o clave de acceso incorrectos',
								duration: 4000,
								position: 'middle'
							})
							msj.present()
							loading.dismiss()
						}, 5000)
					} else {

						let lastFecha: string = ''
							/* Si hay un token valido obtenemos la ultima fecha de sincronizacion. */
						this.reporteService.getLastDateSincronizacion()
							.then(response => {
								// Si la ultima fecha de sincronizacion es vacio se la asigna la fecha actual, en caso
								// contrario obtenemos la ultima fecha de sincronizacion registrado en el origen de datos.
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
		
		this.loader.present()

		this.apiService.readerArchivoExcel(lastFecha)
			.then(response => {
				console.log(response)
				/*
				Si el status 200 no hay sincronisacion, en caso contrario sincronizamos
				 */
				response.status === 200 ? (
						setTimeout(() => {
							// construimos el origen de datos faltante para el modulo de reportes.
							this.navCtrl.setRoot(ProyectoPage)
							this.loader.dismiss(),
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
				this.navCtrl.setRoot(ProyectoPage, {})
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