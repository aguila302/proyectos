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

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService : ReportesDbService) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ReportePage');
	}

	/* Funcion para mostrar el detalle de un reporte. */
	detalleReporte = (): void => {
		console.log('show detalle')
		this.navCtrl.push(DetalleReportePage, {})
	}

	/* Funcion para crear nuevo reporte. */
	nuevoReporte = (): void => {
		this.navCtrl.push(NuevoReportePage, {})
	}

	getReportes = (): void => {
		this.reporteService.getReportes()
	}
}
