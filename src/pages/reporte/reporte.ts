import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetalleReportePage } from './detalle-reporte/detalle-reporte'
import { NuevoReportePage } from './nuevo-reporte/nuevo-reporte'
import { ReportesDbService } from '../../services/reportes.db.service'

@IonicPage()
@Component({
	selector: 'page-reporte',
	templateUrl: 'reporte.html',
})
export class ReportePage {
	reportes = []

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService : ReportesDbService) {
	}

	/* Cargamos los proyectos cuando la vista esta activa. */
	ionViewDidLoad() {
		console.log('ionViewDidLoad ReportePage');
		this.getReportes()
		this.reporteDireccion()
	}

	ionViewWillEnter() {
		console.log('volviste')
		this.getReportes()
	}
	/* Funcion para mostrar el detalle de un reporte. */
	detalleReporte = (id: number): void => {
		console.log('show detalle')
		this.navCtrl.push(DetalleReportePage, {'id': id})
	}

	/* Funcion para crear nuevo reporte. */
	nuevoReporte = (): void => {
		this.navCtrl.push(NuevoReportePage, {})
	}

	/* Funcion para mostrar listado de reportes. */
	getReportes = (): void => {
		this.reporteService.getReportes()
		.then(response => {
			this.reportes = response
		})
	}

	/* Funcion para le reporte de direccion. */
	reporteDireccion() {
		var array_anios = []
		var data_salida = []
		this.reporteService.selectDistinctAnio()
		.then(response => {
			array_anios = response
			this.reporteService.reportePorDireccion()
			.then(direcciones => {
				array_anios.forEach(anio => {
					// console.log(anio.anio)
					direcciones.forEach(direccion => {
						// console.log(direct.anio)
						if(anio.anio === direccion.anio) {
							// console.log(direccion.anio);
							// console.log(direccion.anio, direccion.porcentaje)
							data_salida.push(anio.anio)
							console.log(data_salida)
							
							// array_anios.push({
							// 	anio: direccion.anio,
							// 	porcentaje: direccion.porcentaje
							// })
						}
					})
					// console.log(anio)
					
				})
				console.log(array_anios)
				
			})
		}) 
	}
}
