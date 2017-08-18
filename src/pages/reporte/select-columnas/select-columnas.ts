import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as collect from 'collect.js/dist'

@IonicPage()
@Component({
	selector: 'page-select-columnas',
	templateUrl: 'select-columnas.html',
})
export class SelectColumnasPage {
	columnas = []
	columnas_seleccionadas = []

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private view: ViewController) {

		/* Recupero mis columnas antes recibidas. */
		this.columnas = this.navParams.get('columnas')
		this.columnas.shift()
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SelectColumnasPage');
	}

	seleccionColumnas = (event, columna: string): void => {
		if(event.value == true) {
			this.columnas_seleccionadas.push({columna})
		}
		else {
			/* En caso de que la columna este seleccionado y lo quiero desactivar lo
			quito de mi arreglo.
			*/
			let encontrado = this.columnas_seleccionadas.indexOf(columna)
			if(encontrado !== -1) {
				this.columnas_seleccionadas.splice(encontrado, 1)
			}
		}
	}

	/* Funcion para enviar columnas seleccionadas. */
	aceptar() {
		this.view.dismiss(this.columnas_seleccionadas)
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.view.dismiss()
	}
}
