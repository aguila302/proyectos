import { Component } from '@angular/core'
import { NavParams } from 'ionic-angular'

@Component({
	selector: 'page-detalle-proyecto',
	templateUrl: 'detalle-proyecto.html'
})

/* Clase para el detalle de un proyecto. */
export class DetalleProyectoPage {
	proyecto = {}
	constructor(private navParams: NavParams) {
		this.proyecto = navParams.get('id')
	}
}
