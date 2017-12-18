import { Component, EventEmitter, Output } from '@angular/core'
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
	visible: boolean = true
	@Output() open: EventEmitter < any > = new EventEmitter();
	@Output() close: EventEmitter < any > = new EventEmitter();

	constructor(public navParams: NavParams, public viewCtrl: ViewController) {
	}

	/* Declaramos nuestros filtros a mostrar en pantalla. */
	items = [
		{'opcion': 'unidad_negocio', 'texto': 'Unidad de negocio', 'checked': false},
		{'opcion': 'gerencia', 'texto': 'Gerencia', 'checked': false},
		{'opcion': 'producto', 'texto': 'Producto', 'checked': false},
		{'opcion': 'numero_propuesta', 'texto': 'Numero de propuesta', 'checked': false},
		{'opcion': 'contrato', 'texto': 'Contrato', 'checked': false},
		{'opcion': 'anio', 'texto': 'Año', 'checked': false},
		{'opcion': 'nombre_proyecto', 'texto': 'Nombre de proyecto', 'checked': false},
		{'opcion': 'nombre_corto', 'texto': 'Nombre corto', 'checked': false},
		{'opcion': 'contratante', 'texto': 'Contratante', 'checked': false},
		{'opcion': 'datos_cliente', 'texto': 'Datos de cliente', 'checked': false},
		{'opcion': 'fecha_inicio', 'texto': 'Fecha de inicio', 'checked': false},
		{'opcion': 'fecha_fin', 'texto': 'Fecha de término', 'checked': false},
		{'opcion': 'duracion', 'texto': 'Duración', 'checked': false},
		{'opcion': 'pais', 'texto': 'País', 'checked': false},
	]

	/* Funcion para el manejo de nuestros filtros individuales. */
	seleccionFiltros(event: any, opcion) {
		/* Cuando activamos y desactivamos un opncion actualizamos el evento checkhed. */
		this.items.forEach(
			(arg) => {
				if(arg.opcion == opcion) {
					arg.checked = event.value
				}
			}
		)

		/* Filtramos las opciones que esten activas */
		let data_filter = this.items.filter(function(item) {
			return item.checked == true
		})

		/* Almacenamos en un nuevo array las opciones activas para enviarlas y realizar la busqueda. */
		data_filter.forEach(
			(arg) => {
				return this.data_send[arg.opcion] = arg.opcion
			}
		)
	}

	/* Funcion para la opcion de que en caso seleccione todas las opciones. */
	seleccionAll(event: any) {
		/* En caso de que se seleccione todas las opciones. */
		event.value ?
		(
			/* Activamos todas las opciones. */
			this.items.forEach(
				(data) => {
					return(
						data.opcion = data.opcion,
						data.checked = true
					)
				}
			),
			/* Almacenamos nuestras opciones en un array para ser enviadas y realizar la busqueda. */
			this.items.forEach(
				(arg) => {
					this.data_send[arg.opcion] = arg.opcion
				}
			)
		) : (
			/* En caso de que la opcion de seleccionar todos sea desactivada. */
			this.items.forEach(
				(data) => {
					/* Desactivamos todas las opciones. */
					return(
						data.opcion = data.opcion,
						data.checked = false

					)
				},
				this.data_send = [],
			)
		)
	}

	/* Funcion para seleccionar opciones por default. */
	seleccionDefault(event: any) {
		/* Activamos las opciones por default. */
		event.value ?
		(
			this.items.filter(item => {
				return (
					item.opcion == 'producto' ||
					item.opcion == 'anio' ||
					item.opcion == 'nombre_proyecto' ||
					item.opcion == 'contratante' ||
					item.opcion == 'datos_cliente'
				)
				
			}).map((map) => {
				map.checked = true
			})
		) : (
			/* En caso de que desactive la opcion de busqueda por opciones por default, desactivamos las opciones. */
			this.items.forEach(
				(data) => {
					return(
						data.opcion = data.opcion,
						data.checked = false
					)
				},
				this.data_send = []
			)
		)
	}

	/* Funcion para cerrar la ventana de filtros. */
	cerrarFiltros() {
		/* Enviamos nuestras opciones para realizar la busqueda. */
		this.viewCtrl.dismiss(this.data_send)
	}

	/* Funcion para cancelar los filtros. */
	cancelar() {
		this.viewCtrl.dismiss(this.data_send)
	}
}