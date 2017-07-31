import { Component, NgZone } from '@angular/core'
import { IonicPage, NavParams, LoadingController, NavController, ViewController } from 'ionic-angular'
import * as account from 'accounting-js'

// @IonicPage()
@Component({
	selector: 'page-proyectos-agrupados-cliente-menores',
	templateUrl: 'proyectos-agrupados-cliente-menores.html',
})

/* Clase para mi componente del detalle de proyecto por pais. */
export class ProyectosAgrupadosClienteMenoresPage {
	proyectos = []
	proyectos_agrupados: any

	constructor(private navParams: NavParams,
		public loadingCtrl: LoadingController,
		public navCtrl: NavController,
		private zone: NgZone) {
			this.proyectos_agrupados = navParams.get('proyectos_agrupados_detalle')
	}
	
	/* Cuando la vista esta activa mostramos el detalle de un anio. */
	ionViewDidLoad () {
		console.log('mostrando el detalle')
		// this.navCrtl.pop()
		this.detalleProyectosMenores()
	}

	ionViewDidLeave() {
		console.log('removiendo la vista')
	}

	/* Funcion para obtener las proyectos de un anio. */
	detalleProyectosMenores = () => {
		this.proyectos = this.proyectos_agrupados.toArray()
	}

	/* Funcion para ver los proyectos de un contratante agrupado. */
	detalleProyectosMenoresPorContratante = (contratante): void => {
		console.log(contratante)
		// this.navCtrl.push(DetalleProyectoPage, {
		// 	id: _proyecto
		// })
	}
}
