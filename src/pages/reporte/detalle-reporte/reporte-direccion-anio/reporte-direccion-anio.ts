import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ModalController,
	AlertController
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
import {
	GraficaFiltrosDireccionAnioPage
} from '../../../reporte/detalle-reporte/reporte-direccion-anio/grafica-filtros-direccion-anio/grafica-filtros-direccion-anio'

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
		private reporteService: ReportesDbService, private modal: ModalController, public dbService: DbService,
		public alertCtrl: AlertController) {}

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
		})
			/* Mostramos el modal. */
		filtrarModal.present()
	}

	/* Funcion para graficar. */
	graficar(direccion: any[], anios: any[]) {
		let alert: any
		this.direccion_filtro.length === 0 || this.anio_filtro.length === 0 ?
		(
			alert = this.alertCtrl.create({
				title: 'Advertencia!',
				subTitle: 'Por favor selecciona por lo menos una dirección y un año!',
				buttons: ['OK']
			}),
			alert.present()
		):(
			/* Creamos una vista para visualizar la grafica. */
			this.navCtrl.push(GraficaFiltrosDireccionAnioPage, {
				'direccion': this.direccion_filtro,
				'anios': this.anio_filtro,
			})
		)
	}
} 