import { Component } from '@angular/core'
import { NavParams, LoadingController, NavController } from 'ionic-angular'
import { DbService } from '../../../services/db.service'
import { Proyecto } from '../../../interfaces/proyecto'
import { DetalleProyectoPage } from '../../proyecto/DetalleProyecto'

@Component({
	selector: 'page-proyectos-agrupados',
	templateUrl: 'proyectos-agrupados.html',
})

/* Clase para mi componente del detalle de proyecto por pais. */
export class ProyectosAgrupadosPage {
	proyectos = []
	pais: string = '' 

	constructor(private navParams: NavParams,
		private dbService: DbService,
		public loadingCtrl: LoadingController,
		public navCtrl: NavController,) {
		this.pais = navParams.get('pais')
		this.detallePorPais()
	}

	/* Funcion para obtener las proyectos de un pais es especial. */
	detallePorPais = () => {
		let loading = this.loadingCtrl.create({
			content: 'Por favor espere',
		})
		loading.present();

		setTimeout(() => {
			this.dbService.openDatabase()
			.then(() => this.dbService.consultaPaisAgrupado(this.pais))
			.then(proyectos => {
				this.proyectos = proyectos
				loading.dismiss();
			})
			.catch(e => console.log(e))
		}, 0)
	}

	/* Funcion para ver el detalle de un proyecto. */
	detalleProyecto = (_proyecto: Proyecto): void => {
		this.navCtrl.push(DetalleProyectoPage, {
			id: _proyecto
		})
	}
}
