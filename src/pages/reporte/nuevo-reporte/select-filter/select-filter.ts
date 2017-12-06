import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ReportesDbService } from '../../../../services/reportes.db.service'

@IonicPage()
@Component({
	selector: 'page-select-filter',
	templateUrl: 'select-filter.html',
})
export class SelectFilterPage {
	filtro = {}
	opciones = []
	opcionesSelected = []

	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteDb: ReportesDbService,
		public view: ViewController, public loadingCtrl: LoadingController, public zone: NgZone) {
		/* Recuperamos los filtros. */
		this.filtro = navParams.get('filtro')
	}

	/* Cuando la vista es activa cargamos los filtros de seleccion. */
	ionViewDidLoad() {
		this.getDataFilter(this.filtro)
	}
	/* Funcion para obtener la data del filtro seleccionado. */
	getDataFilter = (filtro: {}) => {
		let loading = this.loadingCtrl.create({
			content: 'Por favor espere...'
		})
		loading.present()
		setTimeout(() => {
			this.reporteDb.getFilterData(filtro)
			.then(response => {
				console.log(response)
				
				this.zone.run(() => {
					this.opciones = response
					loading.dismiss()
				})
			})
		}, 4000)
	}

	selectOpcion = (event, campo) => {
		let opcionEncontrado
		let columnas = []
		let titles = []

		event.value ? (
			this.opcionesSelected.push(campo)
		) : (
			opcionEncontrado = this.opcionesSelected.indexOf(campo),
			opcionEncontrado !== -1 ? (
				this.opcionesSelected.splice(opcionEncontrado, 1)
			) : ''
		)
	}

	/* Funcion para enviar columnas seleccionadas. */
	aceptar() {
		this.view.dismiss({[this.filtro['columna']]: this.opcionesSelected})
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.view.dismiss()
	}
}
