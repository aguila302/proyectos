import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-grafica-filtros-direccion-anio-detalle',
	templateUrl: 'grafica-filtros-direccion-anio-detalle.html',
})
export class GraficaFiltrosDireccionAnioDetallePage {
	direccion: string = ''
	anio: number = 0
	monto: string = ''
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.direccion = this.navParams.get('direccion')
		this.anio = this.navParams.get('anio')
		this.monto = this.navParams.get('monto')
		console.log(this.direccion, this.anio, this.monto)
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaFiltrosDireccionAnioDetallePage');
	}

}
