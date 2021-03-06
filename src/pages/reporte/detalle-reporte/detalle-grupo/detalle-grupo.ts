import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams
} from 'ionic-angular';
import {
	ReportesDbService
} from '../../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { ProyectosAgrupadosPage } from '../../../estadistica/proyectos-agrupados/proyectos-agrupados'
import { ProyectosAgrupadosAnioPage } from '../../../estadistica/proyectos-agrupados/por-anio/proyectos-agrupados-anio'
import { ProyectosAgrupadosGerenciaPage } from '../../../estadistica/proyectos-agrupados/por-gerencia/proyectos-agrupados-gerencia'
import { DetalleReporteAgrupadoPage } from '../../../reporte/detalle-reporte/detalle-reporte-agrupado/detalle-reporte-agrupado'

@IonicPage()
@Component({
	selector: 'page-detalle-grupo',
	templateUrl: 'detalle-grupo.html',
})
export class DetalleGrupoPage {
	grupo: string = ''
	groupBy: string = ''
	select: string = ''
	reportes = []
	xy = []
	options = {}
	monto_total: number = 0
	total_proyectos: number = 0

	constructor(public navCtrl: NavController, public navParams: NavParams, private reporteService: ReportesDbService) {
		this.grupo = this.navParams.get('grupo')
		this.select = this.navParams.get('select')
		this.groupBy = this.navParams.get('groupBy')
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DetalleGrupoPage')
		this.verDetalle()
	}

	/* Funcion para mostrar el detalle de un grupo selecccionado. */
	async verDetalle() {
		var global = this

		this.grupo === 'monto_total' ? (
			/* Si el grupo es por monto total hacemos la consulta para obtener la informacion. */
			await this.reporteService.detallePorMontoTotal(this.select, this.groupBy)
			.then(response => {
				console.log(response)
				
				/* Obtenemos la informacion para construir la grafica. */
				response.forEach(items => {
						global.xy.push({
							'name': items.campo,
							'y': parseFloat(items.porcentaje)
						})
					})
					/* Obtenemos la informacion para la tabla informativa. */
				this.monto_total = account.formatNumber(collect(response).sum('monto'))
				this.total_proyectos = collect(response).sum('numero_proyectos')

				response.forEach(items => {
					global.reportes.push({
						'campo': items.campo,
						'porcentaje': items.porcentaje,
						'monto': account.formatNumber(items.monto),
						'numero_proyectos': items.numero_proyectos,
					})
				})
			}),

			/*Mostramos la grafca con los datos necesarios. */
			this.options = this.reporteService.datosGrafica(global.xy, 10, this.groupBy, 'Proyectos agrupados por ' + this.groupBy)
		) : (
			/* Si el grupo es por numero de proyectos hacemos la consulta para obtener la informacion. */
			await this.reporteService.detallePorNumeroProyectos(this.select, this.groupBy)
			.then(response =>{
				/* Obtenemos la informacion para construir la grafica. */
				response.forEach(items => {
						global.xy.push({
							'name': items.campo,
							'y': parseFloat(items.numero_proyectos)
						})
					})
				/* Obtenemos la informacion para la tabla informativa. */
				this.monto_total = account.formatNumber(collect(response).sum('monto'))
				this.total_proyectos = collect(response).sum('numero_proyectos')

				response.forEach(items => {
					global.reportes.push({
						'campo': items.campo,
						'porcentaje': items.porcentaje,
						'monto': account.formatNumber(items.monto),
						'numero_proyectos': items.numero_proyectos,
					})
				})
			}),
			/*Mostramos la grafca con los datos necesarios. */
			this.options = this.reporteService.datosGraficaGrupoNumeroProyecto(global.xy, 10, this.groupBy, 'Proyectos agrupados por ' + this.groupBy)
		)
	}

	/* Funcion para ver el detalle de los proyectos segun la opcion que se escoja. */
	verProyectosAgrupados = (group_by: string, campo: string, monto_total: string): void => {
		console.log(group_by, campo, monto_total);
		
		if (group_by === 'pais') {
			this.navCtrl.push(ProyectosAgrupadosPage, {
				'pais': campo,
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