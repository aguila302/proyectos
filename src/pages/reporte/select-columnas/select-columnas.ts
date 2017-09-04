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

	items = [
		{'opcion': 'unidad_negocio', 'texto': 'Por unidad de negocio', 'checked': false},
		{'opcion': 'gerencia', 'texto': 'Por gerencia', 'checked': false},
		{'opcion': 'producto', 'texto': 'Por producto', 'checked': false},
		{'opcion': 'numero_propuesta', 'texto': 'Por numero de propuesta', 'checked': false},
		{'opcion': 'contrato', 'texto': 'Por contrato', 'checked': false},
		{'opcion': 'anio', 'texto': 'Por año', 'checked': false},
		{'opcion': 'nombre_proyecto', 'texto': 'Por nombre de proyecto', 'checked': false},
		{'opcion': 'nombre_corto', 'texto': 'Por nombre corto', 'checked': false},
		{'opcion': 'contratante', 'texto': 'Por contratante', 'checked': false},
		{'opcion': 'datos_cliente', 'texto': 'Por datos de cliente', 'checked': false},
		{'opcion': 'fecha_inicio', 'texto': 'Por fecha de inicio', 'checked': false},
		{'opcion': 'fecha_fin', 'texto': 'Por fecha de termino', 'checked': false},
		{'opcion': 'duracion', 'texto': 'Por duracion', 'checked': false},
	]

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private view: ViewController) {

		/* Recupero mis columnas antes recibidas. */
		this.columnas = this.navParams.get('columnas')
		this.columnas.shift()

		this.columnas = collect(this.columnas).sortBy('items').all()
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SelectColumnasPage');
	}

	seleccionColumnas = (event, columna: string): void => {
		if(event.value == true) {
			this.columnas_seleccionadas.push(columna)
		}
		/* En caso de que la columna este seleccionado y lo quiero desactivar lo
		quito de mi arreglo.
		*/
		else {
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
