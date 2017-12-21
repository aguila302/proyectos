import {
	Component, NgZone
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ViewController
} from 'ionic-angular';
import * as collect from 'collect.js/dist'
import { DbService } from '../../../../services/db.service'

@IonicPage()
@Component({
	selector: 'page-filtrar-agrupacion',
	templateUrl: 'filtrar-agrupacion.html',
})
export class FiltrarAgrupacionPage {
	registros = []
	agrupacion: string = ''
	id: number
	campo_select: any
	campo_agrupacion: any
	filtros_seleccionadas = []
	columnas = []
	filter_menores_uno = []
	visible: boolean = false

	constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController, private dbService: DbService,
		public zone: NgZone) {
		this.agrupacion = navParams.get('agrupacion')
		// this.agrupacion !== 'contratante' ? 
		this.columnas = navParams.get('registros')
	}

	ionViewDidLoad() {
		this.loadOpciones()
	}

	/* Funcion para visualizar los valores de los filtros. */
	loadOpciones () {
		if(this.agrupacion !== 'contratante'){
			this.registros = this.columnas
		}
		else {
			// para la opcion de contratante agrupamos por aquellos que tienen mayor a 1 % de participacion aplica el mismo proceso para graficar.
			this.dbService.openDatabase()
			.then(() => this.dbService.consultaXCliente())
			.then(response => {
				this.zone.run(() => {
					let data = collect(response)

					/* monto total de todos los proyectos. */
					let monto_total = data.sum('monto')

					/* Agrupo mi data por contratante. */
					let agrupados = data.groupBy('contratante').toArray()
					let datos = agrupados.map(function(contratante, monto) {
						let suma_montos = contratante.reduce(function(index, proyecto) {
							return index + parseInt(proyecto.monto)
						}, 0)

						return {
							id: contratante[0].id,
							contratante: contratante[0].contratante,
							suma_monto: suma_montos,
							porcentaje: parseFloat(((suma_montos / monto_total) * 100).toFixed(2)),
						}
					})

					/* Ordeno por porcentaje de mayor a menor. */
					let ordenados = collect(datos).sortByDesc('porcentaje')

					/* Clasifico los proyectos por porcentaje mayor a 1 y menores de 1. */
					let mayores_de_uno = ordenados.where('porcentaje', '>', 1)
					let menores_de_uno = ordenados.where('porcentaje', '<', 1)

					mayores_de_uno.toArray()
					/* Para visualizar los contratantes mayores de 1% */
					mayores_de_uno.map(item => {
						this.registros.push({
							'registros': item.contratante
						})
					})
					/* Para visualizar los contratantes menores de 1% */
					this.filter_menores_uno = menores_de_uno.toArray()
				})
			})
		}
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