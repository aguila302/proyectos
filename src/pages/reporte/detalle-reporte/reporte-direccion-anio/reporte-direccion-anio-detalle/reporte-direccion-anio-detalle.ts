import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbService } from '../.././../../../services/db.service'
import { ProyectosAgrupadosAnioPage } from '../.././../../../pages/estadistica/proyectos-agrupados/por-anio/proyectos-agrupados-anio'

@IonicPage()
@Component({
  selector: 'page-reporte-direccion-anio-detalle',
  templateUrl: 'reporte-direccion-anio-detalle.html',
})
export class ReporteDireccionAnioDetallePage {
	group_by: number = 0
	campo: string = ''
	monto: number = 0

	constructor(public navCtrl: NavController, public navParams: NavParams, private dbService: DbService) {
		this.group_by = navParams.get('group_by')
		this.campo = navParams.get('campo')
		this.monto = navParams.get('monto')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ReporteDireccionAnioDetallePage');
		console.log(this.group_by)
		console.log(this.campo)
		console.log(this.monto)
	}

}
