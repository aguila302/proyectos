import { Component } from '@angular/core';
import { LoadingController, NavController, Platform, AlertController } from 'ionic-angular';
import { TabsPage } from '../../pages/tabs/tabs';
import { ApiService } from '../../services/api'

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

	constructor(
		public platform: Platform,
		private alertCtrl: AlertController,
		private loadinCtrl: LoadingController,
		private navCtrl: NavController,
		private apiService: ApiService) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
		this.sincronizar()
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
				if(response === undefined ) {
					/* En caso de error */
					let alert = this.alertCtrl.create({
						title: 'Login',
						subTitle: 'Usuario o clave de acceso incorrectos',
						buttons: ['Aceptar']
					})
					alert.present()
				}
				else {
					/* Funcion para resolver el endpoint para cargar el excel. */
					this.cargarExcel()
				}
			})
			.catch(error => {
				console.error.bind(console)
			})
		}
	}
	/* Funcion para resolver el endpoint para cargar el archivo excel al origen de datos. */
	cargarExcel = () => {
		let loader = this.loadinCtrl.create({
				content: 'Espere por favor...'
		})
		loader.present()

		this.apiService.readerArchivoExcel()
		.then(response => {
			loader.dismiss()
			/* Sincronizamos la informacion del excel con la aplicacion movil. */
			this.sincronizar()
		})
		.catch(error => {
			console.error.bind(console)
		})
	}

	/* Funcion para sincronizar la informacion con la aplicacion movil. */
	sincronizar = () => {
		this.apiService.sincronizar()
	}
}