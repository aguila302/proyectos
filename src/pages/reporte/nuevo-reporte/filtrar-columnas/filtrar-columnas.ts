import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-filtrar-columnas',
	templateUrl: 'filtrar-columnas.html',
})
export class FiltrarColumnasPage {

	columnas_seleccionadas = []

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		/* Recuperamos las columnas para mostralas en la vista. */
		this.columnas_seleccionadas = navParams.get('columnas-seleccionadas')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FiltrarColumnasPage')
		console.log(this.columnas_seleccionadas)
	}
}
