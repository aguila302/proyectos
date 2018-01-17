import { Component } from '@angular/core'
import { ViewController, NavParams } from 'ionic-angular'

@Component({
	selector: 'page-filtros',
	templateUrl: 'filtros.html',
	
})
/*
	Clase para el manejo de los filtros de busqueda de proyectos.
 */
export class FiltrosPage {

	data_send = []
	selectDefault: boolean
	selectAll: boolean
	// select: boolean = true

	constructor(public navParams: NavParams, public viewCtrl: ViewController) {
		this.selectDefault = true
		// this.selectAll = false
	}

	/* Declaramos nuestros filtros a mostrar en pantalla. */
	items = [
		{'opcion': 'unidad_negocio', 'texto': 'Unidad de negocio', 'checked': false},
		{'opcion': 'gerencia', 'texto': 'Gerencia', 'checked': false},
		{'opcion': 'producto', 'texto': 'Producto', 'checked': true},
		{'opcion': 'numero_propuesta', 'texto': 'Numero de propuesta', 'checked': false},
		{'opcion': 'contrato', 'texto': 'Contrato', 'checked': false},
		{'opcion': 'anio', 'texto': 'Año', 'checked': true},
		{'opcion': 'nombre_proyecto', 'texto': 'Nombre de proyecto', 'checked': true},
		{'opcion': 'nombre_corto', 'texto': 'Nombre corto', 'checked': false},
		{'opcion': 'contratante', 'texto': 'Contratante', 'checked': true},
		{'opcion': 'datos_cliente', 'texto': 'Datos de cliente', 'checked': true},
		{'opcion': 'fecha_inicio', 'texto': 'Fecha de inicio', 'checked': false},
		{'opcion': 'fecha_fin', 'texto': 'Fecha de término', 'checked': false},
		{'opcion': 'duracion', 'texto': 'Duración', 'checked': false},
		{'opcion': 'pais', 'texto': 'País', 'checked': true},
	]


	/* Funcion para la opcion de que en caso seleccione todas las opciones. */
	seleccionAll() {
		this.selectAll = true
		/* En caso de que se seleccione todas las opciones. */
		if(this.selectAll){
			console.log('select all ' + this.selectAll)
			/* Desactivamos la opcion default */
			// this.selectDefault = !this.selectDefault

			/* Activamos todas las opciones. */
			this.items.forEach(item => {
					// item.opcion = item.opcion,
					item.checked = this.selectAll
				}
			)
			console.log(this.items)
			

			/* Almacenamos nuestras opciones en un array para ser enviadas y realizar la busqueda. */
			// this.items.forEach(
			// 	(arg) => {
			// 		this.data_send[arg.opcion] = arg.opcion
			// 	}
			// )
		}
		else {
			console.log('select all else ' + this.selectAll),
			
			/* En caso de que la opcion de seleccionar todos sea desactivada. */
			this.items.forEach(
				(data) => {
					/* Desactivamos todas las opciones. */
					return(
						data.opcion = data.opcion,
						data.checked = this.selectAll

					)
				},
				this.data_send = [],
			)
			console.log(this.items)
			
		}
	}

	/* Funcion para seleccionar opciones por default. */
	seleccionDefault() {
		/* Activamos las opciones por default. */
		if(this.selectDefault){
			console.log('select default ' + this.selectDefault);
			
			this.items.forEach(item => {
				item.checked = false
			})

			this.items.filter(item => {
				return (
					item.opcion == 'producto' ||
					item.opcion == 'anio' ||
					item.opcion == 'nombre_proyecto' ||
					item.opcion == 'contratante' ||
					item.opcion == 'datos_cliente' ||
					item.opcion == 'pais'
				)
				
			}).map((map) => {
				map.checked = this.selectDefault
			})
			console.log(this.items)
			
		} else {
			console.log('select default else ' + this.selectDefault);
			/* En caso de que desactive la opcion de busqueda por opciones por default, desactivamos las opciones. */
			this.items.forEach(
				(data) => {
					return(
						data.opcion = data.opcion,
						data.checked = this.selectDefault
					)
				},
				this.data_send = []
			)
		}
	}

	// Funcion para filtrar en forma personalizada
	seleccionLibre = () => {
		this.items.forEach(item => {
			item.checked = false
		})
	}

	/* Funcion para cerrar la ventana de filtros. */
	cerrarFiltros() {
		let data_filter = this.items.filter(function(item) {
			return item.checked == true
		})

		data_filter.forEach(
			(arg) => {
				return this.data_send[arg.opcion] = arg.opcion
		})

		/* Enviamos nuestras opciones para realizar la busqueda. */
		this.viewCtrl.dismiss(this.data_send)
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.viewCtrl.dismiss()
	}
}