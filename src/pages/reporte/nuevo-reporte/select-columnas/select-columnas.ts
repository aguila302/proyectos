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
	titles_segleccionadas = []
	columnas_preselecccionadas = []
	preseleccion = []

	columnas = [{
		'opcion': 'nombre_proyecto',
		'texto': 'Nombre de proyecto',
		'checked': true,
		'title': 'Nombre de proyecto'
	}, {
		'opcion': 'nombre_corto',
		'texto': 'Nombre corto',
		'checked': true,
		'title': 'Nombre corto'
	}, {
		'opcion': 'contrato',
		'texto': 'Contrato',
		'checked': true,
		'title': 'Contrato'
	}, {
		'opcion': 'monto',
		'texto': 'Monto USD',
		'checked': true,
		'title': 'Monto USD'
	}, {
		'opcion': 'monto_moneda_original',
		'texto': 'Monto moneda original',
		'checked': true,
		'title': 'Monto moneda original'
	}, {
		'opcion': 'moneda',
		'texto': 'Moneda',
		'checked': true,
		'title': 'Moneda'
	}, {
		'opcion': 'pais',
		'texto': 'País',
		'checked': true,
		'title': 'País'
	}, {
		'opcion': 'gerencia',
		'texto': 'Grencia',
		'checked': true,
		'title': 'Gerencia'
	}, {
		'opcion': 'unidad_negocio',
		'texto': 'Unidad de negocio',
		'checked': true,
		'title': 'Unidad de negocio'
	}, {
		'opcion': 'numero_contrato',
		'texto': 'Numero de contrato',
		'checked': true,
		'title': 'Numero de contrato'
	}, {
		'opcion': 'producto',
		'texto': 'Producto',
		'checked': true,
		'title': 'Producto'
	}, {
		'opcion': 'anio',
		'texto': 'Año',
		'checked': true,
		'title': 'Año'
	}, {
		'opcion': 'duracion',
		'texto': 'Duración',
		'checked': true,
		'title': 'Duracion'
	}, {
		'opcion': 'contratante',
		'texto': 'Contratante',
		'checked': true,
		'title': 'Contratante'
	}, {
		'opcion': 'datos_cliente',
		'texto': 'Datos de cliente',
		'checked': true,
		'title': 'Datos de cliente'
	}, {
		'opcion': 'fecha_inicio',
		'texto': 'Fecha de inicio',
		'checked': true,
		'title': 'Fecha de inicio'
	}, {
		'opcion': 'fecha_fin',
		'texto': 'Fecha de término',
		'checked': true,
		'title': 'Fecha de termino'
	}, {
		'opcion': 'numero_propuesta',
		'texto': 'Numero de propuesta',
		'checked': true,
		'title': 'Propuesta'
	}, {
		'opcion': 'anticipo',
		'texto': 'Anticipo',
		'checked': true,
		'title': 'Anticipo'
	}, ]
	ionViewDidLoad() {
		this.validaSeleccionInit()
	}
	constructor(public navCtrl: NavController, public navParams: NavParams,
		private view: ViewController) {
		this.columnas = collect(this.columnas).sortBy('texto').all()
		this.columnas_preselecccionadas = this.navParams.get('columnas_preselecccionadas')
	}

	/* Funcion para validar si hay columnas preseleccionadas anteriormente. */
	validaSeleccionInit() {
		this.columnas_preselecccionadas.length !== 0 ? (
			this.columnas.splice(0, this.columnas.length),
			this.columnas = this.columnas_preselecccionadas
		) : ''
	}

	/* Funcion para seleccionar las columnas. */
	seleccionColumnas = (event, columna: string, title: string): void => {
		event.value ? (
			this.columnas.forEach(item => {
				if(item.opcion === columna) {
					item.checked =  true
				}
			})
		): (
			this.columnas.forEach(item => {
				if(item.opcion === columna) {
					item.checked =  false
				}
			})
		)
	}

	/* Funcion para enviar columnas seleccionadas. */
	aceptar() {
		// Extraemos las columnas seleccionadas
		this.columnas.filter(function(value, key) {
			return value.checked === true
		}).map(item => {
			this.columnas_seleccionadas.push(item.opcion)
			this.titles_segleccionadas.push(item.texto)
		})
		this.view.dismiss({
			columnas: this.columnas_seleccionadas,
			title: this.titles_segleccionadas,
			preseleccion: this.columnas
		})
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.view.dismiss()
	}
}