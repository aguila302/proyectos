import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

// @IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	email: string = ''
	password: string = ''

	constructor(
		public platform: Platform,
		private alertCtrl: AlertController,
		private loadinCtrl: LoadingController) {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	login = (): void => {
		if (this.email == '' || this.password == '') {
			let alert = this.alertCtrl.create({
				title: 'Login',
				subTitle: 'Debe completar el usuario y contraseña',
				buttons: ['Aceptar']
			})
			alert.present()
		} else {
			let loader = this.loadinCtrl.create({
				content: 'Logging in...'
			})
			loader.present()
		}
	}
}