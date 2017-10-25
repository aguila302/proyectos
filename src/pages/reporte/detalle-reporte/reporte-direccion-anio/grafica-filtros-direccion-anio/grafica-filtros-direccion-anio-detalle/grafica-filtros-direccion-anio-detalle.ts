import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
	ReportesDbService
} from '../../../../../../services/reportes.db.service'

@IonicPage()
@Component({
	selector: 'page-grafica-filtros-direccion-anio-detalle',
	templateUrl: 'grafica-filtros-direccion-anio-detalle.html',
})
export class GraficaFiltrosDireccionAnioDetallePage {
	direccion: string = ''
	anio: number = 0
	monto: string = ''
	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteService: ReportesDbService) {
		this.direccion = this.navParams.get('direccion')
		this.anio = this.navParams.get('anio')
		this.monto = this.navParams.get('monto')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaFiltrosDireccionAnioDetallePage');
	}

	/* Funcion para obtener los proyectos de una direccion y un ano de acuerdo al filtro. */
	detalleReporte = () => {
		this.reporteService.reporteDireccionAnioDetalle(this.anio, this.direccion)
		.then(response => {
			console.log(response)
			
		})
	}
}
