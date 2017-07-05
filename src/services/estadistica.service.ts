import { Injectable } from '@angular/core'
import { Proyecto } from '../interfaces/proyecto'
import { PROYECTOS } from '../services/mocks/proyectos'
import * as collect from 'collect.js/dist'

/* Clase para la funcionalidad de mi componenete estadistica. */
@Injectable()
export class EstadisticaService {

	getProyectos = (): Promise <Proyecto[]> => {
		let arreglo = []
		Promise.resolve(PROYECTOS)
			.then((response) => {
				response.forEach(
					(arg) => {
						let arr = [{}]
						arg.monto == 'Sin dato' ? arg.monto = '0' : ''
						arr['monto'] = arg.monto
						arr['moneda'] = arg.moneda
						arr['pais'] = arg.pais
						arr['anio'] = arg.anio
						arreglo.push(arr)
					}
				)
			})
		return Promise.resolve(arreglo)
	}
	porPais = (arreglo): any[] => {
		let data_send: any[]
		let mexico = this.obtieneDatosMexico(arreglo)
		let colombia = this.obtieneDatosColombia(arreglo)
		let venenzuela = this.obtieneDatosVenenzuela(arreglo)
		let peru = this.obtieneDatosPeru(arreglo)
		let panama = this.obtieneDatosPanama(arreglo)
		let salvador = this.obtieneDatosSalvador(arreglo)
		let guatemala = this.obtieneDatosGuatemala(arreglo)
		let honduras = this.obtieneDatosHonduras(arreglo)
		let costa = this.obtieneDatosCostaRica(arreglo)
		let ecuador = this.obtieneDatosEcuador(arreglo)
		let argentina = this.obtieneDatosArgentina(arreglo)
		let usa = this.obtieneDatosUsa(arreglo)
		let bolivia = this.obtieneDatosBolivia(arreglo)

		data_send = mexico.concat(colombia)
		data_send = mexico.concat(colombia, venenzuela, peru, panama, salvador, guatemala, honduras, costa, ecuador, argentina, usa, bolivia)
		return data_send

	}

	/* Funcion para obbtener los datos de mexico.*/
	obtieneDatosMexico = (arreglo): any[] => {
		let monto_mexico = []
		let get_moneda_mexico = []
		let data_mexico: any []
		let filter_moneda_mexico = []

		let mexico = arreglo.filter(item => {
			return (
				item.pais == 'México'
			)
		})


		for (let i in mexico) {
			mexico[i].monto == 'Sin dato' ? mexico[i].monto = '0' : '0'
			parseInt(mexico[i].monto)

			monto_mexico.push(parseInt(mexico[i].monto))
		}

		let suma_total = monto_mexico.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = mexico.filter((item) =>{
			get_moneda_mexico.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_mexico.length; i ++) {
			let el = get_moneda_mexico[i]
			if(filter_moneda_mexico.indexOf(el) === -1) {
				filter_moneda_mexico.push(el)
			}
		}

		data_mexico = ['México', mexico.length, arreglo.length, ((mexico.length / arreglo.length) * 100), suma_total, filter_moneda_mexico]
		return data_mexico
	}

	/* Funcion para obbtener los datos de colombia.*/
	obtieneDatosColombia = (arreglo): any[] => {
		let monto_colombia = []
		let get_moneda_colombia = []
		let filter_moneda_colombia = []
		let data_colombia: any[]

		let colombia = arreglo.filter(item => {
			return (
				item.pais == 'Colombia'
			)
		})


		for (let i in colombia) {
			colombia[i].monto == 'Sin dato' ? colombia[i].monto = '0' : '0'
			parseInt(colombia[i].monto)
			monto_colombia.push(parseInt(colombia[i].monto))
		}
		let suma_total = monto_colombia.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = colombia.filter((item) =>{
			get_moneda_colombia.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_colombia.length; i ++) {
			let el = get_moneda_colombia[i]
			if(filter_moneda_colombia.indexOf(el) === -1) {
				filter_moneda_colombia.push(el)
			}
		}

		data_colombia = ['Colombia', colombia.length, arreglo.length, ((colombia.length / arreglo.length) * 100), suma_total, filter_moneda_colombia]
		return data_colombia
	}

	/* Funcion para obbtener los datos de venenzuela.*/
	obtieneDatosVenenzuela = (arreglo) => {
		let monto_venenzuela = []
		let get_moneda_venenzuela = []
		let filter_moneda_venenzuela = []
		let data_venenzuela: any[]

		let venenzuela = arreglo.filter(item => {
			return (
				item.pais == 'Venezuela'
			)
		})


		for (let i in venenzuela) {
			venenzuela[i].monto == 'Sin dato' ? venenzuela[i].monto = '0' : '0'
			parseInt(venenzuela[i].monto)
			monto_venenzuela.push(parseInt(venenzuela[i].monto))
		}
		let suma_total = monto_venenzuela.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = venenzuela.filter((item) =>{
			get_moneda_venenzuela.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_venenzuela.length; i ++) {
			let el = get_moneda_venenzuela[i]
			if(filter_moneda_venenzuela.indexOf(el) === -1) {
				filter_moneda_venenzuela.push(el)
			}
		}

		data_venenzuela = ['Venezuela', venenzuela.length, arreglo.length, ((venenzuela.length / arreglo.length) * 100), suma_total, filter_moneda_venenzuela]
		return data_venenzuela
	}

	/* Funcion para obbtener los datos de peru.*/
	obtieneDatosPeru = (arreglo) => {
		let monto_peru = []
		let get_moneda_peru = []
		let filter_moneda_peru = []
		let data_peru: any[]

		let peru = arreglo.filter(item => {
			return (
				item.pais == 'Perú'
			)
		})


		for (let i in peru) {
			peru[i].monto == 'Sin dato' ? peru[i].monto = '0' : '0'
			parseInt(peru[i].monto)
			monto_peru.push(parseInt(peru[i].monto))
		}
		let suma_total = monto_peru.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = peru.filter((item) =>{
			get_moneda_peru.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_peru.length; i ++) {
			let el = get_moneda_peru[i]
			if(filter_moneda_peru.indexOf(el) === -1) {
				filter_moneda_peru.push(el)
			}
		}

		data_peru = ['Perú', peru.length, arreglo.length, ((peru.length / arreglo.length) * 100), suma_total, filter_moneda_peru]
		return data_peru
	}

	/* Funcion para obbtener los datos de panama.*/
	obtieneDatosPanama = (arreglo) => {
		let monto_panama = []
		let get_moneda_panama = []
		let filter_moneda_panama = []
		let data_panama: any[]

		let panama = arreglo.filter(item => {
			return (
				item.pais == 'Panamá'
			)
		})


		for (let i in panama) {
			panama[i].monto == 'Sin dato' ? panama[i].monto = '0' : '0'
			parseInt(panama[i].monto)
			monto_panama.push(parseInt(panama[i].monto))
		}
		let suma_total = monto_panama.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = panama.filter((item) =>{
			get_moneda_panama.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_panama.length; i ++) {
			let el = get_moneda_panama[i]
			if(filter_moneda_panama.indexOf(el) === -1) {
				filter_moneda_panama.push(el)
			}
		}

		data_panama = ['Panamá', panama.length, arreglo.length, ((panama.length / arreglo.length) * 100), suma_total, filter_moneda_panama]
		return data_panama
	}

	/* Funcion para obbtener los datos de salvador.*/
	obtieneDatosSalvador = (arreglo) => {
		let monto_salvador = []
		let get_moneda_salvador = []
		let filter_moneda_salvador = []
		let data_salvador: any[]

		let salvador = arreglo.filter(item => {
			return (
				item.pais == 'El Salvador'
			)
		})


		for (let i in salvador) {
			salvador[i].monto == 'Sin dato' ? salvador[i].monto = '0' : '0'
			parseInt(salvador[i].monto)
			monto_salvador.push(parseInt(salvador[i].monto))
		}
		let suma_total = monto_salvador.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = salvador.filter((item) =>{
			get_moneda_salvador.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_salvador.length; i ++) {
			let el = get_moneda_salvador[i]
			if(filter_moneda_salvador.indexOf(el) === -1) {
				filter_moneda_salvador.push(el)
			}
		}

		data_salvador = ['El salvador', salvador.length, arreglo.length, ((salvador.length / arreglo.length) * 100), suma_total, filter_moneda_salvador]
		return data_salvador
	}

	/* Funcion para obbtener los datos de guatemala .*/
	obtieneDatosGuatemala = (arreglo) => {
		let monto_guatemala = []
		let get_moneda_guatemala = []
		let filter_moneda_guatemala = []
		let data_guatemala: any[]

		let guatemala = arreglo.filter(item => {
			return (
				item.pais == 'Guatemala'
			)
		})


		for (let i in guatemala) {
			guatemala[i].monto == 'Sin dato' ? guatemala[i].monto = '0' : '0'
			parseInt(guatemala[i].monto)
			monto_guatemala.push(parseInt(guatemala[i].monto))
		}
		let suma_total = monto_guatemala.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = guatemala.filter((item) =>{
			get_moneda_guatemala.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_guatemala.length; i ++) {
			let el = get_moneda_guatemala[i]
			if(filter_moneda_guatemala.indexOf(el) === -1) {
				filter_moneda_guatemala.push(el)
			}
		}

		data_guatemala= ['Guatemala', guatemala.length, arreglo.length, ((guatemala.length / arreglo.length) * 100), suma_total, filter_moneda_guatemala]
		return data_guatemala
	}

	/* Funcion para obbtener los datos de honduras .*/
	obtieneDatosHonduras = (arreglo) => {
		let monto_honduras = []
		let get_moneda_honduras = []
		let filter_moneda_honduras = []
		let data_honduras: any[]

		let honduras = arreglo.filter(item => {
			return (
				item.pais == 'Honduras'
			)
		})


		for (let i in honduras) {
			honduras[i].monto == 'Sin dato' ? honduras[i].monto = '0' : '0'
			parseInt(honduras[i].monto)
			monto_honduras.push(parseInt(honduras[i].monto))
		}
		let suma_total = monto_honduras.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = honduras.filter((item) =>{
			get_moneda_honduras.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_honduras.length; i ++) {
			let el = get_moneda_honduras[i]
			if(filter_moneda_honduras.indexOf(el) === -1) {
				filter_moneda_honduras.push(el)
			}
		}

		data_honduras= ['Honduras', honduras.length, arreglo.length, ((honduras.length / arreglo.length) * 100), suma_total, filter_moneda_honduras]
		return data_honduras
	}
	/* Funcion para obbtener los datos de costa rica .*/
	obtieneDatosCostaRica = (arreglo) => {
		let monto_costa = []
		let get_moneda_costa = []
		let filter_moneda_costa = []
		let data_costa: any[]

		let costa = arreglo.filter(item => {
			return (
				item.pais == 'Costa Rica'
			)
		})


		for (let i in costa) {
			costa[i].monto == 'Sin dato' ? costa[i].monto = '0' : '0'
			parseInt(costa[i].monto)
			monto_costa.push(parseInt(costa[i].monto))
		}
		let suma_total = monto_costa.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = costa.filter((item) =>{
			get_moneda_costa.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_costa.length; i ++) {
			let el = get_moneda_costa[i]
			if(filter_moneda_costa.indexOf(el) === -1) {
				filter_moneda_costa.push(el)
			}
		}

		data_costa = ['Costa Rica', costa.length, arreglo.length, ((costa.length / arreglo.length) * 100), suma_total, filter_moneda_costa]
		return data_costa
	}

	/* Funcion para obbtener los datos de ecuador .*/
	obtieneDatosEcuador = (arreglo) => {
		let monto_ecuador = []
		let get_moneda_ecuador = []
		let filter_moneda_ecuador = []
		let data_ecuador: any[]

		let ecuador = arreglo.filter(item => {
			return (
				item.pais == 'Ecuador'
			)
		})


		for (let i in ecuador) {
			ecuador[i].monto == 'Sin dato' ? ecuador[i].monto = '0' : '0'
			parseInt(ecuador[i].monto)
			monto_ecuador.push(parseInt(ecuador[i].monto))
		}
		let suma_total = monto_ecuador.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = ecuador.filter((item) =>{
			get_moneda_ecuador.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_ecuador.length; i ++) {
			let el = get_moneda_ecuador[i]
			if(filter_moneda_ecuador.indexOf(el) === -1) {
				filter_moneda_ecuador.push(el)
			}
		}

		data_ecuador = ['Ecuador', ecuador.length, arreglo.length, ((ecuador.length / arreglo.length) * 100), suma_total, filter_moneda_ecuador]
		return data_ecuador
	}

	/* Funcion para obbtener los datos de argentina .*/
	obtieneDatosArgentina = (arreglo) => {
		let monto_argentina = []
		let get_moneda_argentina = []
		let filter_moneda_argentina = []
		let data_argentina: any[]

		let argentina = arreglo.filter(item => {
			return (
				item.pais == 'Argentina'
			)
		})


		for (let i in argentina) {
			argentina[i].monto == 'Sin dato' ? argentina[i].monto = '0' : '0'
			parseInt(argentina[i].monto)
			monto_argentina.push(parseInt(argentina[i].monto))
		}
		let suma_total = monto_argentina.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = argentina.filter((item) =>{
			get_moneda_argentina.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_argentina.length; i ++) {
			let el = get_moneda_argentina[i]
			if(filter_moneda_argentina.indexOf(el) === -1) {
				filter_moneda_argentina.push(el)
			}
		}

		data_argentina = ['Argentina', argentina.length, arreglo.length, ((argentina.length / arreglo.length) * 100), suma_total, filter_moneda_argentina]
		return data_argentina
	}

	/* Funcion para obbtener los datos de usa .*/
	obtieneDatosUsa = (arreglo) => {
		let monto_usa = []
		let get_moneda_usa = []
		let filter_moneda_usa = []
		let data_usa: any[]

		let usa = arreglo.filter(item => {
			return (
				item.pais == 'México - USA'
			)
		})


		for (let i in usa) {
			usa[i].monto == 'Sin dato' ? usa[i].monto = '0' : '0'
			parseInt(usa[i].monto)
			monto_usa.push(parseInt(usa[i].monto))
		}
		let suma_total = monto_usa.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = usa.filter((item) =>{
			get_moneda_usa.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_usa.length; i ++) {
			let el = get_moneda_usa[i]
			if(filter_moneda_usa.indexOf(el) === -1) {
				filter_moneda_usa.push(el)
			}
		}

		data_usa = ['México - USA', usa.length, arreglo.length, ((usa.length / arreglo.length) * 100), suma_total, filter_moneda_usa]
		return data_usa
	}

	/* Funcion para obbtener los datos de bolivia .*/
	obtieneDatosBolivia = (arreglo) => {
		let monto_bolivia = []
		let get_moneda_bolivia = []
		let filter_moneda_bolivia = []
		let data_bolivia: any[]

		let bolivia = arreglo.filter(item => {
			return (
				item.pais == 'Bolivia'
			)
		})


		for (let i in bolivia) {
			bolivia[i].monto == 'Sin dato' ? bolivia[i].monto = '0' : '0'
			parseInt(bolivia[i].monto)
			monto_bolivia.push(parseInt(bolivia[i].monto))
		}
		let suma_total = monto_bolivia.reduce(function(valorAnterior, valorActual, indice, vector) {

			return valorAnterior + valorActual
		})

		let monedas = bolivia.filter((item) =>{
			get_moneda_bolivia.push(item.moneda)
		})

		for (let i = 0; i < get_moneda_bolivia.length; i ++) {
			let el = get_moneda_bolivia[i]
			if(filter_moneda_bolivia.indexOf(el) === -1) {
				filter_moneda_bolivia.push(el)
			}
		}

		data_bolivia = ['Bolivia', bolivia.length, arreglo.length, ((bolivia.length / arreglo.length) * 100), suma_total, filter_moneda_bolivia]
		return data_bolivia
	}

	/*Funcion para consultar por anio. */
	porAnio = (): any => {

		let proyectos = PROYECTOS

		const agrupados = collect(proyectos).groupBy('anio').toArray()
		let tamanio = proyectos.length

		let data = agrupados.map(function(proyectos, anio) {
			let num = proyectos.length
			let anios = proyectos[0].anio
			let montos = proyectos.reduce(function(carry, proyecto) {
				return carry + parseInt(proyecto.monto)
			}, 0);

			return {
				anio: parseInt(anios),
				num_proyectos: num,
				monto: montos,
				porcentaje: ((num / tamanio) * 100).toFixed(2)
			}
		})
		return data
	}
}