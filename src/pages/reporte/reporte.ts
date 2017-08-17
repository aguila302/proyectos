import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetalleReportePage } from './detalle-reporte/detalle-reporte'
import { NuevoReportePage } from './nuevo-reporte/nuevo-reporte'
/**
 * Generated class for the ReportePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-reporte',
	templateUrl: 'reporte.html',
})
export class ReportePage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {}

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
}
