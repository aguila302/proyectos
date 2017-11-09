import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular'
import { SelectFilterPage } from '../select-filter/select-filter'

@IonicPage()
@Component({
	selector: 'page-filtrar-columnas',
	templateUrl: 'filtrar-columnas.html',
})
export class FiltrarColumnasPage {

	filtros_seleccionadas = []
	prueba = []

	constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController,
		public view: ViewController) {
		/* Recuperamos las columnas para mostralas en la vista. */
		this.filtros_seleccionadas = navParams.get('filtros_seleccionadas')
	}

	/* Cuando cargue la vista mostramos los filtros seleccionados. */
	ionViewDidLoad() {
		// console.log(this.filtros_seleccionadas)
	}

	/* Funcion para seleccionas las opsiones del filtro.*/
	obtenerDataFiltrado = (item: {}) => {
		let misFiltros = []
		/* Creamos el modal para ver las opciones de un filtro. */
		let modalSelectFilter = this.modal.create(SelectFilterPage, {
			filtro: item
		})
		/* mostramos el modal. */
		modalSelectFilter.present()

		/* Cuando cerramos la vista de los filtros recuperamos las opciones seleccionadas. */
		modalSelectFilter.onDidDismiss(data => {
			this.prueba.push(data)
		})
	}

	regresar = () => {
		this.view.dismiss(this.prueba)
	}
}