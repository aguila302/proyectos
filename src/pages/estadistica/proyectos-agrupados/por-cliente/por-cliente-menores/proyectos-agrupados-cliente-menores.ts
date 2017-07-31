import { Component, NgZone } from '@angular/core'
import { NavParams, LoadingController, NavController, ViewController } from 'ionic-angular'
// import { DbService } from '../../../../services/db.service'
// import { Proyecto } from '../../../../interfaces/proyecto'
// import { DetalleProyectoPage } from '../../../proyecto/DetalleProyecto'

@Component({
	selector: 'page-proyectos-agrupados-cliente-menores',
	templateUrl: 'proyectos-agrupados-cliente-menores.html',
})

/* Clase para mi componente del detalle de proyecto por pais. */
export class ProyectosAgrupadosClienteMenoresPage {
	proyectos = []
	proyectos_agrupados_detalle =  []

	constructor(private navParams: NavParams,
		public loadingCtrl: LoadingController,
		public navCtrl: NavController,
		private zone: NgZone,
		private viewCtrl: ViewController) {
		this.proyectos_agrupados_detalle = navParams.get('proyectos_agrupados_detalle')
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
		let loading = this.loadingCtrl.create({
			content: 'Por favor espere',
		})
		loading.present();
		this.zone.run(()=> {
			this.proyectos_agrupados_detalle.map(items => {
				return {
					'contratante': items.contratante,
					'numero_proyectos': items.numero_proyectos,
					'porcentaje': items.numero_proyectos,
					'suma_monto': items.suma_monto
				}
			})
			loading.dismiss()
		})
	}

	/* Funcion para ver el detalle de un proyecto. */
	// detalleProyecto = (_proyecto: Proyecto): void => {
	// 	this.navCtrl.push(DetalleProyectoPage, {
	// 		id: _proyecto
	// 	})
	// }
}
