import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	App, ViewController
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
import { LoginPage } from '../../pages/login/login'

@IonicPage()
@Component({
	selector: 'page-reporte',
	templateUrl: 'reporte.html',
})
export class ReportePage {
	reportes = []

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService: ReportesDbService, public viewCtrl: ViewController,
		public app: App) {}

	/* Cargamos los proyectos cuando la vista esta activa. */
	ionViewDidLoad() {
		this.getReportes()
	}

	ionViewWillEnter() {
		this.getReportes()
	}
	/* Funcion para mostrar el detalle de un reporte. */
	detalleReporte = (id: number, nombreReporte: string): void => {
		if(id !== 7) {
			this.navCtrl.push(DetalleReportePage, {
				'id': id,
				'nombre_reporte': nombreReporte
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
				console.log(response)
				
				this.reportes = response
			})
	}
	
	/* Funcion para cerrar sesion. */
	logout = () => {
		this.app.getRootNav().setRoot(LoginPage, {}, {animate: true, animation: 'ios-transition', direction: 'forward'})
	}
}