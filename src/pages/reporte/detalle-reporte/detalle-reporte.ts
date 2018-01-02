import { Component, NgZone } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular'
import { ReportesDbService } from '../../../services/reportes.db.service'
import * as collect from 'collect.js/dist'
import * as account from 'accounting-js'
import { ProyectosAgrupadosPage } from '../../estadistica/proyectos-agrupados/proyectos-agrupados'
import { ProyectosAgrupadosAnioPage } from '../../estadistica/proyectos-agrupados/por-anio/proyectos-agrupados-anio'
import { ProyectosAgrupadosClientePage } from '../../estadistica/proyectos-agrupados/por-cliente/proyectos-agrupados-cliente'
import { ProyectosAgrupadosGerenciaPage } from '../../estadistica/proyectos-agrupados/por-gerencia/proyectos-agrupados-gerencia'
import { DbService } from '../../../services/db.service'
import { ProyectosAgrupadosClienteMenoresPage } from '../../estadistica/proyectos-agrupados/por-cliente/por-cliente-menores/proyectos-agrupados-cliente-menores'
import { DetalleReporteAgrupadoPage } from '../../reporte/detalle-reporte/detalle-reporte-agrupado/detalle-reporte-agrupado'
import { FiltrarAgrupacionPage } from '../../reporte/detalle-reporte/filtrar-agrupacion/filtrar-agrupacion'
import { GraficaFiltradaPage } from '../../reporte/detalle-reporte/grafica-filtrada/grafica-filtrada'
import { DetalleGrupoPage } from '../../reporte/detalle-reporte/detalle-grupo/detalle-grupo'
import { GraficaCircularPage } from '../../reporte/detalle-reporte/grafica-circular/grafica-circular'
import { Grafico } from '../../../highcharts/modulo.reportes/Grafico'

@IonicPage()
@Component({
	selector: 'page-detalle-reporte',
	templateUrl: 'detalle-reporte.html',
})
export class DetalleReportePage {
	porcentaje: string = 'porcentaje'
	campo_agrupacion: string = ''
	campo_select: string = ''
	xy = []
	options: Object
	monto_total: string = ''
	total_proyectos: number
	proyectos = []
	id: number = 0
	proyectos_agrupados = []
	proyectos_agrupados_detalle = []
	filtros = []
	resultado = []
	data_circular = []
	con: number = 1
	visible: boolean = false
	grafico: Grafico

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private reporteService : ReportesDbService, private dbService: DbService, public zone: NgZone,
		public modalCtrl: ModalController) {
		this.id = navParams.get('id')
	}

	ionViewDidLoad() {
		this.getAgrupacion()
	}

	/* Funcion para obtener la agrupacion y campos del select del reporte a consultar. */
	getAgrupacion = (): void => {
		this.reporteService.obtenerAgrupacionDetalle(this.id)
			.then(response => {
				console.log(response)
				let agrupacion = collect(response)
				this.campo_agrupacion = agrupacion.implode('nombre_columna', ',')
			})
			.then(() => this.reporteService.obtenerCamposDetalle(this.id)
				.then(response => {
					console.log(response)
					let campos = collect(response)
					this.campo_select = campos.implode('nombre_columna', ',')
				})
				.then(() => this.reporteService.obtenerFiltros(this.id)
					.then(response => {
						console.log(response)
						this.filtros = response
					}))
			)
			.then(() => this.getReporteDetalle())
	}

	/* Funcion para reporte por año. */
	getReporteDetalle = (): void => {
		if(this.campo_agrupacion === 'contratante') {
			this.visible = !this.visible

			let data_cliente = []

			this.dbService.openDatabase()
			.then(() => this.dbService.consultaXCliente())
			.then(response => {
				this.zone.run(() => {
					let data = collect(response)

					/* monto total de todos los proyectos. */
					let monto_total = data.sum('monto')

					/* Agrupo mi data por contratante. */
					let agrupados = data.groupBy('contratante').toArray()

					let datos = agrupados.map(function(contratante, monto) {
						let num_proyectos = contratante.length
						
						let suma_montos = contratante.reduce(function(index, proyecto) {
							return index + parseInt(proyecto.monto)
						}, 0)

						return {
							id: contratante[0].id,
							contratante: contratante[0].contratante,
							suma_monto: suma_montos,
							porcentaje: parseFloat(((suma_montos / monto_total) * 100).toFixed(2)),
							numero_proyectos: num_proyectos
						}
					})
					/* Ordeno por porcentaje de mayor a menor. */
					let ordenados = collect(datos).sortByDesc('porcentaje')

					/* Clasifico los proyectos por porcentaje mayor a 1 y menores de 1. */
					let mayores_de_uno = ordenados.where('porcentaje', '>', 1)
					let menores_de_uno = ordenados.where('porcentaje', '<', 1)

					/* Suma de los montos y porcentajes de porcentaje  menores de 1. */
					let suma_porcentajes_menores_de_uno = menores_de_uno.sum('porcentaje').toFixed(2)
					mayores_de_uno.toArray()

					/* Consigo el porcentaje y cliente para formar mi grafica. */
					this.xy.splice(0, this.xy.length)
					mayores_de_uno.map(function(contratante, monto) {
						data_cliente.push({
							name: contratante.contratante,
							y: parseFloat(contratante.porcentaje)
						})
					})
					this.xy = data_cliente
					/*Realizamos la instancia a nuestra clase para contruir la grafica. */
					this.grafico = new Grafico(this.xy, 'Clientes', 'Proyectos agrupados por clientes', '', 'Porcentaje total de participación')
					
					this.options = this.grafico.graficaBar()

					/* Para mostrar la tabla de informacion */
					this.monto_total = account.formatNumber(data.sum('monto'))
					this.total_proyectos = response.length

					let proyectos = mayores_de_uno.map(function(item) {
						return {
							'campo': item.contratante,
							'porcentaje': item.porcentaje,
							'monto': account.formatNumber(item.suma_monto),
							'numero_proyectos': item.numero_proyectos,
							'group_by': 'contratante',
						}
					})

					this.proyectos = proyectos
					this.proyectosAgrupados(menores_de_uno, suma_porcentajes_menores_de_uno)
				})
			})
		}
		else {
			/* Opcion para seleccionar la opcion reporte de direccicon con años. */
			/* En caso de visualizar algun reporte que no sea de direccion con años. */
			this.reporteService.detalleReporte(this.campo_select, this.campo_agrupacion, this.filtros)
				.then(response => {
					console.log(this.campo_select, this.campo_agrupacion, this.filtros)
					this.campo_agrupacion === 'anio' ? this.campo_agrupacion = 'año' : this.campo_agrupacion === 'unidad_negocio' ? this.campo_agrupacion = 'dirección': ''
					// Para mostrar la informacion de la grafica.
					this.xy.splice(0, this.xy.length)
					response.forEach(item => {
						this.xy.push({
							name: item.campo,
							y: parseFloat(item.porcentaje)
						})

					})

					/*Realizamos la instancia a nuestra clase para contruir la grafica. */
					this.grafico = new Grafico(this.xy, this.campo_select, 'Proyectos agrupados por ' + this.campo_agrupacion, '', 'Porcentaje total de participación')
					this.options = this.grafico.graficaBar()

					/* Para mostrar la tabla de informacion */
					const collection = collect(response)
					this.monto_total = account.formatNumber(collection.sum('monto'))
					this.total_proyectos = collection.sum('numero_proyectos')

					let proyectos = collection.map(function(item) {
						return {
							'campo': item.campo,
							'porcentaje': item.porcentaje,
							'monto': account.formatNumber(item.monto),
							'numero_proyectos': item.numero_proyectos,
							'group_by': item.group_by,
						}
					})
					this.proyectos = proyectos
					this.data_circular = response
				})

		}
	}

	/* Funcion para filtrar la argrupacion de mi grafica. */
	filtrar = (): void => {
		this.campo_agrupacion === 'año' ? this.campo_agrupacion = 'anio' : this.campo_agrupacion === 'dirección' ? this.campo_agrupacion = 'unidad_negocio': ''
		/* Hacemos una consulta para obtener los distintos valores de la agrupacion. */
		this.reporteService.selectDistinct(this.campo_agrupacion)
		.then(response => {
			let modal = this.modalCtrl.create(FiltrarAgrupacionPage, {
				'registros': response,
				'agrupacion': this.campo_agrupacion
			})
			modal.present()
			modal.onDidDismiss(data => {
				/* Una vez cerrada la ventana de filtros validamos que se haya seleccionado alguna opcion. */
				this.resultado.splice(0, this.resultado.length)
				/* En caso de que haya opciones seleccionadas nos vamos a graficar. */

				data.length > 0 ? (this.paraGraficarFiltrado(data)) : ''
			})
		})
	}

	/* Funcion para graficar los filtros seleccionados. */
	async paraGraficarFiltrado(data) {
		var numero_proyectos: number = 0
		var monto_total: string =''

		var miglobal = this
		for (let index in data) {
			await  this.reporteService.paraGraficar(this.campo_select, this.campo_agrupacion, data[index])
				.then(res => {
					for (var i = 0; i < res.rows.length; i++) {
						miglobal.resultado.push({
							'campo': res.rows.item(i).campo,
							'monto':  account.formatNumber(parseInt(res.rows.item(i).monto)),
							'total': res.rows.item(i).total,
							'numero_proyectos': res.rows.item(i).numero_proyectos,
							'monto_filtrado': res.rows.item(i).monto_filtrado,
							'porcentaje': account.toFixed((res.rows.item(i).numero_proyectos / res.rows.item(i).total) * 100, 2)
						})
					}
				})
		}
		monto_total = account.formatNumber(collect(miglobal.resultado).sum('monto_filtrado'))
		numero_proyectos = collect(miglobal.resultado).sum('numero_proyectos')

		this.navCtrl.push(GraficaFiltradaPage, {
			'data_grafica' : miglobal.resultado,
			'monto_total': monto_total,
			'total_proyectos': numero_proyectos,
			'groupBy': this.campo_agrupacion
		})
	}

	/* Funcion para ver detalle de los proyectos agrupados que tienen menos de 1 %. */
	verProyectosAgrupadosClientePorcentajeMenosAUno = (monto_total: string): void => {
		let proyectos = this.proyectos_agrupados_detalle.map(function(item) {
			return {
				'id': item.id,
				'contratante': item.contratante,
				'porcentaje': item.porcentaje,
				'monto': account.formatNumber(item.suma_monto),
				'numero_proyectos': item.numero_proyectos
			}
		})

		this.navCtrl.push(ProyectosAgrupadosClienteMenoresPage, {
			'proyectos_agrupados_detalle': proyectos,
			'monto_total': monto_total
		})
	}
	
	/* Funcion para visualizar los proyectos agrupados por contratante. */
	verProyectosAgrupadosCliente = (contratante: string, monto_total: string): void => {
		this.navCtrl.push(ProyectosAgrupadosClientePage, {
			'contratante': contratante,
			'monto_total': monto_total
		})
	}

	/* Funcion para los proyectos que tienen menos de 1 porcentaje. */
	async proyectosAgrupados(menores_de_uno, suma_porcentajes_menores_de_uno) {
		/* Para mostras la informacion agrupada con los proyectos menores del 1 %. */
		/* Consigo el porcentaje y cliente para formar mi grafica. */
		this.xy.push({
			name: 'Proyectos agrupados',
			y: parseFloat(suma_porcentajes_menores_de_uno)
		})

		/* Construyo la informacion para mi tablero. */
		this.proyectos_agrupados['suma_montos_menores_de_uno'] = account.formatNumber(menores_de_uno.sum('suma_monto'))
		this.proyectos_agrupados['porcentaje'] = suma_porcentajes_menores_de_uno
		this.proyectos_agrupados['numero_proyectos'] = menores_de_uno.count()

		this.proyectos_agrupados_detalle = menores_de_uno
	}

	/* Funcion para ver el detalle de los proyectos segun la opcion que se escoja. */
	verProyectosAgrupados = (group_by: string, campo: string, monto_total: string): void => {
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
		} else if (group_by === 'contratante') {
			this.verProyectosAgrupadosCliente(campo, monto_total)
		} else {
			this.navCtrl.push(DetalleReporteAgrupadoPage, {
				'campo': campo,
				'monto_total': monto_total,
				'groupBy': this.campo_agrupacion
			})
		}
	}

	/* Funcion para ver detalle por monto total o por numero de proyectos. */
	verDetalleGrupo = (grupo: string) => {
		this.navCtrl.push(DetalleGrupoPage, {
			'select': this.campo_select,
			'grupo': grupo,
			'groupBy': this.campo_agrupacion,
			'id': this.id,
			'filtros': this.filtros
		})
	}

	/* Funcion para ver la grafica circular. */
	modoCircular(select: string, group_by: string) {
		this.navCtrl.push(GraficaCircularPage, {
			'datos_circular': this.data_circular,
			'groupBy': this.campo_agrupacion
		})
	}
}