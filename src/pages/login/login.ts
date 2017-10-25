import { Component } from '@angular/core';
import { LoadingController, NavController, Platform, AlertController } from 'ionic-angular';
import { TabsPage } from '../../pages/tabs/tabs';

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
		private navCtrl: NavController) {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	login = (): void => {
		if (this.username == '' || this.password == '') {
			let alert = this.alertCtrl.create({
				title: 'Login',
				subTitle: 'Debe completar el usuario y la clave de acceso',
				buttons: ['Aceptar']
			})
			alert.present()
		} else {
			let loader = this.loadinCtrl.create({
				content: 'Espere por favor...'
			})
			if(this.username === 'developer' && this.password === 'developer'){
				loader.present()
				setTimeout(() => {
				loader.dismiss()
				}, 3000)
				this.navCtrl.push(TabsPage,{})
			}
			else {
				let alert = this.alertCtrl.create({
					title: 'Login',
					subTitle: 'Usuario o clave de acceso incorrectos',
					buttons: ['Aceptar']
				})
				alert.present()
			}
		}
	}
}