import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { ProyectosAgrupadosPage } from '../../../estadistica/proyectos-agrupados/proyectos-agrupados'
import { ProyectosAgrupadosAnioPage } from '../../../estadistica/proyectos-agrupados/por-anio/proyectos-agrupados-anio'
import { ProyectosAgrupadosGerenciaPage } from '../../../estadistica/proyectos-agrupados/por-gerencia/proyectos-agrupados-gerencia'
import { DetalleReporteAgrupadoPage } from '../../../reporte/detalle-reporte/detalle-reporte-agrupado/detalle-reporte-agrupado'
import { Grafico } from '../../../../highcharts/modulo.reportes/Grafico'


@IonicPage()
@Component({
	selector: 'page-grafica-circular',
	templateUrl: 'grafica-circular.html',
})
export class GraficaCircularPage {
	proyectos = []
	data_grafica = []
	options: Object
	monto_total: string = ''
	total_proyectos: number
	groupBy = ''
	grafico: Grafico

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.proyectos = this.navParams.get('datos_circular')
		this.groupBy = this.navParams.get('groupBy')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaCircularPage');
		this.verGrafica()
	}

	/* Funcion para mostrar la grafica. */
	verGrafica = () => {
		this.proyectos.forEach(item => {
			this.data_grafica.push({
				name: item.campo,
				y: parseFloat(item.porcentaje)
			})
		})

		/*Realizamos la instancia a nuestra clase para contruir la grafica. */
		this.grafico = new Grafico(this.data_grafica, this.groupBy, 'Proyectos agrupados por '  + this.groupBy)
		this.options = this.grafico.graficaPie()

		// this.options = this.datosGrafica(this.data_grafica)

		const collection = collect(this.proyectos)
		this.monto_total = account.formatNumber(collection.sum('monto'))
		this.total_proyectos = collection.sum('numero_proyectos')

		let proyectos = collection.map(function(item) {
			return {
				'campo': item.campo,
				'porcentaje': item.porcentaje,
				'monto': account.formatNumber(item.monto),
				'numero_proyectos': item.numero_proyectos
			}
		})
		this.proyectos = proyectos
	}

	/* Funcion para ver el detalle de los proyectos segun la opcion que se escoja. */
	verProyectosAgrupados = (group_by: string, campo: string, monto_total: string): void => {

		if (group_by === 'pais') {
			this.navCtrl.push(ProyectosAgrupadosPage, {
				'pais' : campo,
				'monto_total': monto_total
			})
		} else if (group_by === 'anio') {
			this.navCtrl.push(ProyectosAgrupadosAnioPage, {
				'anio': campo,
				'monto_total': monto_total
			})
		} else if (group_by === 'gerencia') {
			this.navCtrl.push(ProyectosAgrupadosGerenciaPage, {
				'gerencia': campo,
				'monto_total': monto_total
			})
		}
		else {
			this.navCtrl.push(DetalleReporteAgrupadoPage, {
				'campo': campo,
				'monto_total': monto_total,
				'groupBy': this.groupBy
			})
		}
	}
}
