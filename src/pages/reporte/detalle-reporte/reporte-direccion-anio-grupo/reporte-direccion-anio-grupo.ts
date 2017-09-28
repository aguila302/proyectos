import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportesDbService } from '../../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@IonicPage()
@Component({
	selector: 'page-reporte-direccion-anio-grupo',
	templateUrl: 'reporte-direccion-anio-grupo.html',
})
export class ReporteDireccionAnioGrupoPage {

	grupo: string = ''
	options: Object
	monto_total: string = ''
	total_proyectos: number
	proyectos = []

	series = []
	categorias = []

	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteService: ReportesDbService) {
		this.grupo = navParams.get('grupo')
		console.log(this.grupo)
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ReporteDireccionAnioGrupoPage');
		this.verReporteGrupo()
	}

	/* Funcion para ver el detalle del reporte segun el grupo seleccionado. */
	async verReporteGrupo() {
		var miglobal = this
		if (this.grupo === 'monto_total') {
			this.reporteService.distinctAnio()
				.then(response => {
					miglobal.categorias = response
					// this.options = this.reporteService.graficaDireccionAnios(categorias, series, 'Direcciones por monto total USD')
					/*Para obtener la informacion para visualizar la tabla informativa. */
				})
			await this.reporteService.distinctDirecciones()
				.then(response => {
					response.forEach(item => {
						miglobal.series.push({
							name: item.unidad_negocio,
							data: []
						})
					})
				})
			// console.log(miglobal.categorias)
			console.log(miglobal.series)
			this.reporteService.getmontosDirecciones()
			.then(response => {
				// console.log(response)
				console.log(miglobal.series[0]['data'])
				
				// miglobal.series.forEach(function callback(items, index, array) {
				// 	console.log(items[0])
				// })
			})
		}
		else {
			this.reporteService.reporteDireccionAnioGrupoNumeroProyectos()
			.then(response => {
				miglobal.categorias = [2017, 2016, 2015, 2014, 2013, 2012]
				response.forEach(item => {
					miglobal.series.push({
						name: item.unidad_negocio,
						data: [item[2017], item[2016], item[2015], item[2014], item[2013], item[2012]]
					})
				})

				this.options = this.reporteService.graficaDireccionAnios(this.categorias, this.series, 'Direcciones por número de proyectos')

				/*Para obtener la informacion para visualizar la tabla informativa. */
				this.reporteService.reporteDireccionAnioGrupoNumeroProyectosTAbla()
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
	}
}
