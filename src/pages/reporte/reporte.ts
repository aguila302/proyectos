import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams
} from 'ionic-angular';
import {
	DetalleReportePage
} from './detalle-reporte/detalle-reporte'
import {
	NuevoReportePage
} from './nuevo-reporte/nuevo-reporte'
import {
	ReportesDbService
} from '../../services/reportes.db.service'
import { ReporteDireccionAnioPage } from '../reporte/detalle-reporte/reporte-direccion-anio/reporte-direccion-anio'

@IonicPage()
@Component({
	selector: 'page-reporte',
	templateUrl: 'reporte.html',
})
export class ReportePage {
	reportes = []

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService: ReportesDbService) {}

	/* Cargamos los proyectos cuando la vista esta activa. */
	ionViewDidLoad() {
		console.log('ionViewDidLoad ReportePage');
		this.getReportes()
	}

	ionViewWillEnter() {
		this.getReportes()
	}
	/* Funcion para mostrar el detalle de un reporte. */
	detalleReporte = (id: number): void => {
		if(id !== 7) {
			this.navCtrl.push(DetalleReportePage, {
				'id': id
			})
		}
		else {
			this.reporteDireccionAnios()
		}
	}

	/* Funcion para consultar el reporte de direccion con anios. */
	reporteDireccionAnios() {
		this.navCtrl.push(ReporteDireccionAnioPage, {
		})
	}

	/* Funcion para crear nuevo reporte. */
	nuevoReporte = (): void => {
		this.navCtrl.push(NuevoReportePage, {})
	}

	/* Funcion para mostrar listado de reportes. */
	getReportes = (): void => {
		this.reporteService.getReportes()
			.then(response => {
				this.reportes = response
			})
	}
}