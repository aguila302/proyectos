import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-filtrar-agrupacion',
	templateUrl: 'filtrar-agrupacion.html',
})
export class FiltrarAgrupacionPage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FiltrarAgrupacionPage');
	}

}
