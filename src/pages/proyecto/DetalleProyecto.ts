import { Component } from '@angular/core'
import { NavParams, NavController } from 'ionic-angular'

@Component({
	selector: 'page-detalle-proyecto',
	templateUrl: 'detalle-proyecto.html'
})

/* Clase para el detalle de un proyecto. */
export class DetalleProyectoPage {

	
	proyecto = {}
	constructor(private navParams: NavParams,
		private navCtrl: NavController) {
		this.proyecto = navParams.get('id')
		// console.log(this.proyecto)
	}

	ionViewWillLeave () {
		console.log('me dejas')
		this.navCtrl.pop()
	}
}
