import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReportesDbService } from '../../../../../services/reportes.db.service'

@IonicPage()
@Component({
	selector: 'page-modal-filtros',
	templateUrl: 'modal-filtros.html',
})
export class ModalFiltrosPage {
	filtro: string
	opciones = []

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
		private reporteService: ReportesDbService) {
		this.filtro = this.navParams.get('filtro')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ModalFiltrosPage')
		this.filtro === 'Direcciones' ? this.filtrarPorDireccion() : this.filtrarPorAnio()
	}

	/* Filtrar por anios. */
	filtrarPorAnio = () => {
		this.reporteService.distinctAnio()
		.then(response => {
			response.forEach(item => {

				this.opciones.push({
					'item': item
				})
			})
			console.log(this.opciones);
			
		})
	}

	/* Filtrar por direcciones. */
	filtrarPorDireccion = () => {
		this.reporteService.distinctDirecciones()
		.then(response => {
			response.forEach(item => {
				this.opciones.push({
					'item': item.unidad_negocio
				})
			})
			console.log(this.opciones);
		})
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.viewCtrl.dismiss()
	}
}
