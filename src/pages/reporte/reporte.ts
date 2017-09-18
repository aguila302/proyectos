import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetalleReportePage } from './detalle-reporte/detalle-reporte'
import { NuevoReportePage } from './nuevo-reporte/nuevo-reporte'
import { ReportesDbService } from '../../services/reportes.db.service'
import * as collect from 'collect.js/dist'

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
		this.reporteService.reportePorDireccion()
			.then(response => {
				// console.log(response)
			})
	}
}
