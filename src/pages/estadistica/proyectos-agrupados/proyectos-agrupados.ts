import { Component } from '@angular/core'
import { NavParams } from 'ionic-angular'
import { DbService } from '../../../services/db.service'

@Component({
	selector: 'page-proyectos-agrupados',
	templateUrl: 'proyectos-agrupados.html',
})

/* Clase para mi componente del detalle de proyecto por pais. */
export class ProyectosAgrupadosPage {
	proyectos = []
	pais: string = '' 

	constructor(private navParams: NavParams,
		private dbService: DbService) {
		this.pais = navParams.get('pais')
		this.detallePorPais()
	}

	/* Funcion para obtener las proyectos de un pais es especial. */
	detallePorPais = () => {
		setTimeout(() => {
			this.dbService.openDatabase()
			.then(() => this.dbService.consultaPaisAgrupado(this.pais))
			.then(proyectos => {
				this.proyectos = proyectos
			})
			.catch(e => console.log(e))
		}, 0)
	}
}
