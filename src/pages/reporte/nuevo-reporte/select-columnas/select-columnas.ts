import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ViewController
} from 'ionic-angular';
import * as collect from 'collect.js/dist'

@IonicPage()
@Component({
	selector: 'page-select-columnas',
	templateUrl: 'select-columnas.html',
})
export class SelectColumnasPage {
	columnas_seleccionadas = []
	title = []

	columnas = [{
		'opcion': 'nombre_proyecto',
		'texto': 'Por nombre de proyecto',
		'checked': false,
		'title': 'Nombre de proyecto'
	}, {
		'opcion': 'nombre_corto',
		'texto': 'Por nombre corto',
		'checked': false,
		'title': 'Nombre corto'
	}, {
		'opcion': 'contrato',
		'texto': 'Por contrato',
		'checked': false,
		'title': 'Contrato'
	}, {
		'opcion': 'monto',
		'texto': 'Por monto USD',
		'checked': false,
		'title': 'Monto USD'
	}, {
		'opcion': 'monto_moneda_original',
		'texto': 'Por monto moneda original',
		'checked': false,
		'title': 'Monto moneda original'
	}, {
		'opcion': 'moneda',
		'texto': 'Por moneda',
		'checked': false,
		'title': 'Moneda'
	}, {
		'opcion': 'pais',
		'texto': 'Por país',
		'checked': false,
		'title': 'País'
	}, {
		'opcion': 'gerencia',
		'texto': 'Por gerencia',
		'checked': false,
		'title': 'Gerencia'
	}, {
		'opcion': 'unidad_negocio',
		'texto': 'Por unidad de negocio',
		'checked': false,
		'title': 'Unidad de negocio'
	}, {
		'opcion': 'numero_contrato',
		'texto': 'Por numero de contrato',
		'checked': false,
		'title': 'Numero de contrato'
	}, {
		'opcion': 'producto',
		'texto': 'Por producto',
		'checked': false,
		'title': 'Producto'
	}, {
		'opcion': 'anio',
		'texto': 'Por año',
		'checked': false,
		'title': 'Año'
	}, {
		'opcion': 'duracion',
		'texto': 'Por duracion',
		'checked': false,
		'title': 'Duracion'
	}, {
		'opcion': 'contratante',
		'texto': 'Por contratante',
		'checked': false,
		'title': 'Contratante'
	}, {
		'opcion': 'datos_cliente',
		'texto': 'Por datos de cliente',
		'checked': false,
		'title': 'Datos de cliente'
	}, {
		'opcion': 'fecha_inicio',
		'texto': 'Por fecha de inicio',
		'checked': false,
		'title': 'Fecha de inicio'
	}, {
		'opcion': 'fecha_fin',
		'texto': 'Por fecha de termino',
		'checked': false,
		'title': 'Fecha de termino'
	}, {
		'opcion': 'numero_propuesta',
		'texto': 'Por numero de propuesta',
		'checked': false,
		'title': 'Propuesta'
	}, {
		'opcion': 'anticipo',
		'texto': 'Por anticipo',
		'checked': false,
		'title': 'Anticipo'
	}, ]

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private view: ViewController) {
		this.columnas = collect(this.columnas).sortBy('texto').all()
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SelectColumnasPage');
	}

	seleccionColumnas = (event, columna: string, title: string): void => {

		this.columnas_seleccionadas.push({
				columna: columna,
				title: title
			})
	}

	/* Funcion para enviar columnas seleccionadas. */
	aceptar() {
		this.view.dismiss(this.columnas_seleccionadas)
			// this.columnas_seleccionadas.splice(0, this.columnas_seleccionadas.length)
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.view.dismiss()
	}
}