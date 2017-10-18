import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ModalController
} from 'ionic-angular';
import {
	ReportesDbService
} from '../../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import {
	ReporteDireccionAnioGrupoPage
} from '../../../reporte/detalle-reporte/reporte-direccion-anio-grupo/reporte-direccion-anio-grupo'
import {
	ProyectosAgrupadosAnioPage
} from '../.././../../pages/estadistica/proyectos-agrupados/por-anio/proyectos-agrupados-anio'
import {
	ModalFiltrosPage
} from '../../../reporte/detalle-reporte/reporte-direccion-anio/modal-filtros/modal-filtros'
import {
	DbService
} from '../../../../services/db.service'
import { GraficaFiltrosDireccionAnioPage } from '../../../reporte/detalle-reporte/reporte-direccion-anio/grafica-filtros-direccion-anio/grafica-filtros-direccion-anio'

@IonicPage()
@Component({
	selector: 'page-reporte-direccion-anio',
	templateUrl: 'reporte-direccion-anio.html',
})
export class ReporteDireccionAnioPage {
	options: Object
	monto_total: string = ''
	total_proyectos: number
	proyectos = []
	direccion_filtro = []
	anio_filtro = []
	data_grafica = []
	data_direcciones = []

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService: ReportesDbService, private modal: ModalController, public dbService: DbService, ) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ReporteDireccionAnioPage');
		this.reporteDireccionAnios()
	}

	/* Funcion para obtener la informacion para construir el reporte de direccicon con años. */
	reporteDireccionAnios() {
		var series = []
		var categorias = []
		this.reporteService.reportePorDireccion()
			.then(response => {
				categorias = [2017, 2016, 2015, 2014, 2013, 2012]
				response.forEach(item => {
					series.push({
						name: item.unidad_negocio,
						data: [item[2017], item[2016], item[2015], item[2014], item[2013], item[2012]]
					})
				})

				this.options = this.reporteService.graficaDireccionAniosGeneral(categorias, series, 'Direcciones por porcentaje de participación')
				console.log(this.options)
				/*Para obtener la informacion para visualizar la tabla informativa. */
				this.reporteService.reportePorDireccionTAbla()
					.then(response => {
						let micollect = collect(response)

						this.total_proyectos = micollect.sum('numero_proyectos')
						this.monto_total = account.formatNumber(micollect.sum('monto'))

						let proyectos = micollect.map(function(item) {
							return {
								'campo': item.anio,
								'porcentaje': parseFloat(item.porcentaje).toFixed(2),
								'monto': account.formatNumber(item.monto),
								'numero_proyectos': item.numero_proyectos,
								'group_by': item.anio,
							}
						})
						this.proyectos = proyectos
					})
			})
	}

	// Funcion para ver detalle por monto total o por numero de proyectos. 
	verDetalleGrupo = (grupo: string) => {
		this.navCtrl.push(ReporteDireccionAnioGrupoPage, {
			'grupo': grupo
		})
	}

	/* Funcion para ver el detalle general. */
	verDetalle = (group_by, campo, monto) => {
		this.navCtrl.push(ProyectosAgrupadosAnioPage, {
			'anio': group_by,
			'monto_total': monto
		})
	}

	/* Funcion para mostrar la ventana para filtrar las direcciones. */
	filtrarDireccion(filtro: string) {
		/*Creamos un modal retornando un view. */
		let filtrarModal = this.modal.create(ModalFiltrosPage, {
				'filtro': filtro
			})
			/* Cierra la ventana modal y recuperamos las opciones que se seleccionaron. */
		filtrarModal.onDidDismiss(data => {
				// this.graficar(data, [])
				this.direccion_filtro = data
			})
			/* Mostramos el modal. */
		filtrarModal.present()
	}

	/* Funcion para mostrar la ventana para filtrar los anios. */
	filtrarAnio = (filtro: string) => {
		// Creamos un modal retornando un view. 
		let filtrarModal = this.modal.create(ModalFiltrosPage, {
				'filtro': filtro
			})
			/* Cierra la ventana modal y recuperamos las opciones que se seleccionaron. */
		filtrarModal.onDidDismiss(data => {
				this.anio_filtro = data
					/* Funcion realizar la consulta necesaria al origen de datos y graficar*/
				this.graficar(this.direccion_filtro, this.anio_filtro)
			})
			/* Mostramos el modal. */
		filtrarModal.present()
	}

	/* Funcion para graficar. */
	graficar(direccion: any[], anios: any[]) {

		// miGlobal.data_grafica.splice(0, miGlobal.data_grafica.length)
		/* Contruimos los datos para graficar.*/
		// direccion.forEach(function callback(item, index) {
		// 	series.push({
		// 		'name': item,
		// 		'data': miGlobal.dataDirecciones(item, anios)
		// 	})
		// })
		this.navCtrl.push(GraficaFiltrosDireccionAnioPage, {
			'direccion': direccion,
			'anios': anios,
		})
		// this.options = this.reporteService.graficaDireccionAniosGeneral(anios, series, 'Direcciones')
		// console.log(this.options)
		
		// console.log(miGlobal.data_grafica)
	}

	/* Funcion realizar la consulta necesaria al origen de datos para obtener la data de las direccciones selecionadas.*/
	// dataDirecciones(direccion, anio) {
	// 	var miGlobal = this
	// 	miGlobal.data_direcciones.splice(0, miGlobal.data_direcciones.length)
	// 	this.reporteService.obtenerDataFiltracion(direccion, anio)
	// 	.then(response => {
	// 		response.forEach(item => {
	// 			miGlobal.data_direcciones.push(parseInt(item))
	// 		})
	// 	})
	// 	console.log('data')
	// 	console.log(miGlobal.data_direcciones)
		
	// 	return miGlobal.data_direcciones
		
	// }
}