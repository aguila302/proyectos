import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SelectAgrupacionesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-select-agrupaciones',
	templateUrl: 'select-agrupaciones.html',
})
export class SelectAgrupacionesPage {
	agrupaciones = []
	agrupacion_seleccionada = []

	constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
		this.agrupaciones = navParams.get('agrupaciones')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SelectAgrupacionesPage');
	}

	seleccionAgrupacion = (event, agruacion: string): void => {
		if(event.value == true) {
			this.agrupacion_seleccionada.push(agruacion)
		}
		/* En caso de que la agrupacion este seleccionado y lo quiero desactivar lo
		quito de mi arreglo.
		*/
		else {
			let encontrado = this.agrupacion_seleccionada.indexOf(agruacion)
			if(encontrado !== -1) {
				this.agrupacion_seleccionada.splice(encontrado, 1)
			}
		}
	}

	/* Funcion para enviar agrupaciones seleccionadas. */
	aceptar() {
		this.view.dismiss(this.agrupacion_seleccionada)
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.view.dismiss()
	}

}