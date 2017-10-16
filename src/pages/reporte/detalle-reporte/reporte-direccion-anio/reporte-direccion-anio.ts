import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams
} from 'ionic-angular';
import {
	ReportesDbService
} from '../../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import {
	ReporteDireccionAnioGrupoPage
} from '../../../reporte/detalle-reporte/reporte-direccion-anio-grupo/reporte-direccion-anio-grupo'


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

	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteService: ReportesDbService) {}

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

				this.options = this.reporteService.graficaDireccionAniosGeneral(categorias, series, 'Reporte de direcciones general')

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
		console.log(group_by, campo, monto)
		
	}
}