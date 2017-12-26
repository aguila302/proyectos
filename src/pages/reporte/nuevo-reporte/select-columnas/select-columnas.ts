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

	columnas = [{
		'opcion': 'nombre_proyecto',
		'texto': 'Nombre de proyecto',
		'checked': false,
		'title': 'Nombre de proyecto'
	}, {
		'opcion': 'nombre_corto',
		'texto': 'Nombre corto',
		'checked': false,
		'title': 'Nombre corto'
	}, {
		'opcion': 'contrato',
		'texto': 'Contrato',
		'checked': false,
		'title': 'Contrato'
	}, {
		'opcion': 'monto',
		'texto': 'Monto USD',
		'checked': false,
		'title': 'Monto USD'
	}, {
		'opcion': 'monto_moneda_original',
		'texto': 'Monto moneda original',
		'checked': false,
		'title': 'Monto moneda original'
	}, {
		'opcion': 'moneda',
		'texto': 'Moneda',
		'checked': false,
		'title': 'Moneda'
	}, {
		'opcion': 'pais',
		'texto': 'País',
		'checked': false,
		'title': 'País'
	}, {
		'opcion': 'gerencia',
		'texto': 'Grencia',
		'checked': false,
		'title': 'Gerencia'
	}, {
		'opcion': 'unidad_negocio',
		'texto': 'Unidad de negocio',
		'checked': false,
		'title': 'Unidad de negocio'
	}, {
		'opcion': 'numero_contrato',
		'texto': 'Numero de contrato',
		'checked': false,
		'title': 'Numero de contrato'
	}, {
		'opcion': 'producto',
		'texto': 'Producto',
		'checked': false,
		'title': 'Producto'
	}, {
		'opcion': 'anio',
		'texto': 'Año',
		'checked': false,
		'title': 'Año'
	}, {
		'opcion': 'duracion',
		'texto': 'Duración',
		'checked': false,
		'title': 'Duracion'
	}, {
		'opcion': 'contratante',
		'texto': 'Contratante',
		'checked': false,
		'title': 'Contratante'
	}, {
		'opcion': 'datos_cliente',
		'texto': 'Datos de cliente',
		'checked': false,
		'title': 'Datos de cliente'
	}, {
		'opcion': 'fecha_inicio',
		'texto': 'Fecha de inicio',
		'checked': false,
		'title': 'Fecha de inicio'
	}, {
		'opcion': 'fecha_fin',
		'texto': 'Fecha de término',
		'checked': false,
		'title': 'Fecha de termino'
	}, {
		'opcion': 'numero_propuesta',
		'texto': 'Numero de propuesta',
		'checked': false,
		'title': 'Propuesta'
	}, {
		'opcion': 'anticipo',
		'texto': 'Anticipo',
		'checked': false,
		'title': 'Anticipo'
	}, ]

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private view: ViewController) {
		this.columnas = collect(this.columnas).sortBy('texto').all()
	}
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
		// let columnaEncontrado
		// let titleEncontrado
		// let columnas = []
		// let titles = []
		// event.value ? (
		// 	this.columnas_seleccionadas.push(columna),
		// 	this.titles_segleccionadas.push(title)
		// ): (
		// 	columnaEncontrado = this.columnas_seleccionadas.indexOf(columna),
		// 	columnaEncontrado !== -1 ? (
		// 		this.columnas_seleccionadas.splice(columnaEncontrado, 1)
		// 	): '',

		// 	titleEncontrado = this.titles_segleccionadas.indexOf(title),

		// 	titleEncontrado !== -1 ? (
		// 		this.titles_segleccionadas.splice(titleEncontrado, 1)
		// 	) : ''
		// )
	}

	/* Funcion para enviar columnas seleccionadas. */
	aceptar() {
		// Extraemos las columnas seleccionadas
		let filtrado = this.columnas.filter(function(value, key) {
			return value.checked === true
		}).map(item => {
			this.columnas_seleccionadas.push(item.opcion)
			this.titles_segleccionadas.push(item.texto)
		})

		this.view.dismiss({
			columnas: this.columnas_seleccionadas,
			title: this.titles_segleccionadas
		})
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.view.dismiss()
	}
}