import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'

@IonicPage()
@Component({
	selector: 'page-detalle-grupo',
	templateUrl: 'detalle-grupo.html',
})
export class DetalleGrupoPage {
	grupo: string = ''

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.grupo = this.navParams.get('grupo')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DetalleGrupoPage')
		this.verDetalle()
	}

	/* Funcion para mostrar el detalle de un grupo selecccionado. */
	verDetalle = (): void => {
		if(this.grupo === 'monto_total') {
			console.log('por monto')
			
		}
		else {
			console.log('por numero de proyectos')
		}
	}
}
