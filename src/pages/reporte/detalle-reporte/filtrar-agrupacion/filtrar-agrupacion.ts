import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ViewController
} from 'ionic-angular';
import {
	DetalleReportePage
} from '../../../../pages/reporte/detalle-reporte/detalle-reporte'

@IonicPage()
@Component({
	selector: 'page-filtrar-agrupacion',
	templateUrl: 'filtrar-agrupacion.html',
})
export class FiltrarAgrupacionPage {
	registros = []
	id: number
	campo_select: any
	campo_agrupacion: any
	filtros_seleccionadas = []

	constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
		this.registros = navParams.get('registros')
		// this.id = navParams.get('id')
		// this.campo_select = navParams.get('campo_select')
		// this.campo_agrupacion = navParams.get('campo_agrupacion')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FiltrarAgrupacionPage');
	}

	/* Funcion para controlar los filtros seleccionados. */
	seleccionFiltros = (event: any, filtros: string) => {
			let encontrado

			event.value ? (
				this.filtros_seleccionadas.push(filtros)
			) : (
				encontrado = this.filtros_seleccionadas.indexOf(filtros),
				encontrado !== -1 ? (
					this.filtros_seleccionadas.splice(encontrado, 1)
				) : ''
			);
		}
		/* Funcion para enviar columnas seleccionadas. */
	aceptar() {
		this.view.dismiss(this.filtros_seleccionadas)
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.navCtrl.pop()
	}
}