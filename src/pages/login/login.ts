import { Component } from '@angular/core';
import { LoadingController, NavController, Platform, AlertController } from 'ionic-angular';
import { TabsPage } from '../../pages/tabs/tabs';
import { HTTP } from '@ionic-native/http';

// @IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	username: string = ''
	password: string = ''

	constructor(
		public platform: Platform,
		private alertCtrl: AlertController,
		private loadinCtrl: LoadingController,
		private navCtrl: NavController,
		private http: HTTP) {

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
			this.resolveApi(this.username, this.password)
		}
	}

	/* Funcion para resolver al api y loguear al usuario */
	resolveApi = (usuario: string, password: string) => {
		let token = {}

		this.http.post(`http://qa.calymayor.com.mx/biprows/public/api/login`, {
			'username': usuario,
			'password': password
		}, {})
		.then(data => {
			/* Obtenemos el token de accseso. */
			let token = JSON.parse(data.data)

			let loader = this.loadinCtrl.create({
				content: 'Espere por favor...'
			})

			/* Entramos a la pantalla de inicio de la aplicacion. */
			setTimeout(() => {
				loader.dismiss()
			}, 3000)
			this.navCtrl.push(TabsPage, {})
		})
		.catch(error => {
			/* En caso de error */
			// console.log(JSON.parse(error.error))
			let alert = this.alertCtrl.create({
				title: 'Login',
				subTitle: 'Usuario o clave de acceso incorrectos',
				buttons: ['Aceptar']
			})
			alert.present()
		});
	}
}