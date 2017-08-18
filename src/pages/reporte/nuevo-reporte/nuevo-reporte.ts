import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { SelectColumnasPage } from '../select-columnas/select-columnas'


@IonicPage()
@Component({
	selector: 'page-nuevo-reporte',
	templateUrl: 'nuevo-reporte.html',
})
export class NuevoReportePage {
	columnas = []
	columnas_seleccionadas = []
	columnDefs: any[];
    rowData: any[];

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteServive : ReportesDbService, private modal: ModalController) {
		this.columnDefs = [
            {headerName: "Make", field: "make"},
            {headerName: "Model", field: "model"},
            {headerName: "Price", field: "price"}
        ];

        this.rowData = [
            {make: "Toyota", model: "Celica", price: 35000},
            {make: "Ford", model: "Mondeo", price: 32000},
            {make: "Porsche", model: "Boxter", price: 72000}
        ]
	}
	onGridReady(params) {
        params.api.sizeColumnsToFit();
    }

	ionViewDidLoad() {
		console.log('ionViewDidLoad NuevoReportePage');
		this.getColumnas()
	}

	/* Funcion para conseguir columnas. */
	getColumnas = (): any => {
		
		this.reporteServive.getColumnas()
			.then(response => {
				response.forEach(items => {
					this.columnas.push({items})
				})
			})
	}

	/* Funcion para mostrar las comunas y escoger*/
	selectColumnas = (): void => {
		let modal_columnas = this.modal.create(SelectColumnasPage, {
			'columnas': this.columnas
		})
		modal_columnas.present()
		modal_columnas.onDidDismiss(data => {
			this.columnas_seleccionadas = data
		});
	}
}
