import { Injectable } from '@angular/core'
import { Proyecto } from '../interfaces/proyecto'
import { PROYECTOS } from '../services/mocks/proyectos'

/* Clase para la funcionalidad de mi componenete proyectos. */
@Injectable()
export class ProyectoService {

	/* Obtenemos los proyectos. */
	getProyectos = (): Promise <Proyecto[]> => {

		let arreglo = []
		Promise.resolve(PROYECTOS)
			.then((response) => {
				response.forEach(
					(arg) => {
						let arr = [{}]
						arg.monto == 'Sin dato' ? arg.monto = '0' : ''
						
						arr['nombre_proyecto'] = arg.nombre_proyecto
						arr['monto'] = parseInt(arg.monto)
						arr['moneda'] = arg.moneda
						arr['pais'] = arg.pais
						arr['gerencia'] = arg.gerencia
						arr['unidad_negocio'] = arg.unidad_negocio
						arr['numero_contrato'] = arg.numero_contrato
						arr['nombre_corto'] = arg.nombre_corto
						arr['contrato'] = arg.contrato
						arr['producto'] = arg.producto
						arr['anio'] = arg.anio
						arr['duracion'] = arg.duracion
						arr['contratante'] = arg.contratante
						arr['datos_cliente'] = arg.datos_cliente
						arr['fecha_inicio'] = arg.fecha_inicio
						arr['fecha_fin'] = arg.fecha_fin
						arr['duracion'] = arg.duracion
						arr['numero_propuesta'] = arg.numero_propuesta
						arr['anticipo'] = arg.anticipo
						arreglo.push(arr)
							// arreglo.sort((proyectoAnterior, proyectoActual) => {
							// 	if (proyectoActual['nombre_proyecto'] < proyectoAnterior['nombre_proyecto']) {

						// 		return 1
						// 	}
						// 	return -1
						// })
					}
				)
			})
		return Promise.resolve(arreglo)
	}

	/* Funcion para obtener los proyectos para filtrarlos. */
		filtrarProyectos = (val): any => {
		/* Obtenemos todos datos del proyecto. */
		return this.getProyectos()
	}

	/* Funcion para filtrar los proyectos dado a un valor. */
	muestraProyecto = (arreglo, val, filtros): any => {
		console.log(filtros)
		/* Filtramos el arreglo de proyectos. */
		return arreglo.filter(item => {
			for (var i in filtros) {
				/* Devolvemos los datos que cunplan con los criterios de busqueda. */
				if (item[i].toLowerCase().indexOf(val.toLowerCase()) > -1 == true) {
					return (
						item[i].toLowerCase().indexOf(val.toLowerCase()) > -1
					)
				}
			}
		})
	}
}