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
	proyectos_agrupados = []
	segmento: number = 0
	visible: boolean = false

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.proyectos = this.navParams.get('datos_circular')
		this.groupBy = this.navParams.get('groupBy')
		this.segmento = this.navParams.get('segmento')
	
		if(this.groupBy === 'contratante') {
			this.verGraficaContratante()
		}
		else {
			this.verGrafica()
		}
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad GraficaCircularPage');
	}

	/* Funcion para ver la grafica para la seccion de contratante */
	verGraficaContratante = () => {
		if(this.segmento === 3) {
			var miglobal = this
			this.visible = true
			let data = collect(this.proyectos)

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
			let numero_proyectos = menores_de_uno.sum('numero_proyectos')
			mayores_de_uno.toArray()

			/* Consigo el porcentaje y cliente para formar mi grafica. */
			this.data_grafica.splice(0, this.data_grafica.length)
			mayores_de_uno.map(function(contratante, monto) {
				
				miglobal.data_grafica.push({
					name: contratante.contratante,
					y: parseInt(contratante.numero_proyectos)
				})
			})

			/*Realizamos la instancia a nuestra clase para contruir la grafica. */
			this.grafico = new Grafico(this.data_grafica, 'Clientes', 'Proyectos agrupados por clientes', '#', 'Numero de proyectos'),
			this.options = this.grafico.graficaPie()

			/* Para mostrar la tabla de informacion */
			this.monto_total = account.formatNumber(data.sum('monto'))
			this.total_proyectos = this.proyectos.length

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
			this.proyectosAgrupados(menores_de_uno, suma_porcentajes_menores_de_uno, numero_proyectos)
		}
		/* para la seccion de por monto USD*/
		if (this.segmento === 2) {
			var miglobal = this
			this.visible = true
			let data = collect(this.proyectos)

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
			let monto_menores_a_uno = menores_de_uno.sum('suma_monto').toFixed(2)
				// let numero_proyectos = menores_de_uno.sum('numero_proyectos')
			mayores_de_uno.toArray()

			/* Consigo el porcentaje y cliente para formar mi grafica. */
			this.data_grafica.splice(0, this.data_grafica.length)
			mayores_de_uno.map(function(contratante, monto) {
				miglobal.data_grafica.push({
					name: contratante.contratante,
					y: parseFloat(contratante.suma_monto)
				})
			})

			// this.xy = data_cliente
				/*Realizamos la instancia a nuestra clase para contruir la grafica. */
			this.grafico = new Grafico(this.data_grafica, 'Clientes', 'Proyectos agrupados por clientes', 'USD', 'Numero de proyectos'),
			this.options = this.grafico.graficaPie()

			/* Para mostrar la tabla de informacion */
			this.monto_total = account.formatNumber(data.sum('monto'))
			this.total_proyectos = this.proyectos.length

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
			this.proyectosAgrupados(menores_de_uno, suma_porcentajes_menores_de_uno, monto_menores_a_uno)
		}
	}

	/* Funcion para mostrar la grafica. */
	verGrafica = () => {
		if(this.segmento === 3) {
			this.proyectos.forEach(item => {

				this.data_grafica.push({
					name: item.campo,
					y: parseFloat(item.numero_proyectos)
				})
			})

			/*Realizamos la instancia a nuestra clase para contruir la grafica. */
			this.grafico = new Grafico(this.data_grafica, this.groupBy, 'Proyectos agrupados por ' + this.groupBy, '#', 'Numero de proyectos'),
			this.options = this.grafico.graficaPie()

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
		
	}
		/* Funcion para los proyectos que tienen menos de 1 porcentaje. */
	async proyectosAgrupados(menores_de_uno, suma_porcentajes, indicador) {
		/* Para mostras la informacion agrupada con los proyectos menores del 1 %. */
		/* Consigo el porcentaje y cliente para formar mi grafica. */
		this.data_grafica.push({
			name: 'Proyectos agrupados',
			y: parseInt(indicador)
		})

		/* Construyo la informacion para mi tablero. */
		this.proyectos_agrupados['suma_montos_menores_de_uno'] = account.formatNumber(menores_de_uno.sum('suma_monto'))
		this.proyectos_agrupados['porcentaje'] = suma_porcentajes
		// this.proyectos_agrupados['numero_proyectos'] = menores_de_uno.count()
		this.proyectos_agrupados['numero_proyectos'] = menores_de_uno.sum('numero_proyectos')
		// this.proyectos_agrupados['numero_proyectos'] = numero_proyectos

		// this.proyectos_agrupados_detalle = menores_de_uno

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
