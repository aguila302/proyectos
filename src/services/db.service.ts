import { Injectable } from '@angular/core'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'

import { Proyecto } from '../interfaces/proyecto'
import { PROYECTOS } from '../services/mocks/proyectos'
import * as collect from 'collect.js/dist'

@Injectable()

/* Clase para crear la base de datos. */
export class DbService {
	db: SQLiteObject = null

	constructor (public sqlite: SQLite) {
	}

	/* Creamos la base de datos. */
	openDatabase() {
		return this.sqlite.create({
			name: 'data.db',
			location: 'default'
		})
	}

	/* Creamos la tabla. */
	createTable() {
		let sql = `
			create table if not exists proyectos(
				id integer primary key autoincrement,
				name text,
				monto integer,
				moneda text)
		`;
		this.openDatabase()
			.then((db: SQLiteObject) => {
				db.executeSql(sql, {})
				.then(() => console.log('tabla creada'))
				.catch(e => console.log(e))
			}
		)
		.catch(e => console.log(e))
	}

	/* Insertamos los datos. */
	insertaDatos() {
		let origen = collect(PROYECTOS)
		origen.each(item => {
			//let db = this.db
			let sql = 'insert into proyectos(name, monto, moneda) values(?, ?, ?)'
			this.openDatabase()
			.then((db: SQLiteObject) => {
				setTimeout(() => {
					db.executeSql(sql, [
						item.nombre_proyecto,
						parseInt(item.monto),
						item.moneda,
					]).then(() => console.log('regustros insertados'))
					.catch(e => console.log(e))
				}, 0)
			}).catch(e => console.log(e))
		})
	}

	/* Obtenemos las datos de los proyectos. */
	getProyectos(): Array<any> {
		let proyectos = []
		let sql = 'select * from proyectos'
		this.openDatabase()
		.then((db: SQLiteObject) => {
			db.executeSql(sql, {})
			.then((response) => {
				console.log(response)
				for (let index = 0; index < response.rows.length; index++) {
					proyectos.push(response.rows.item(index))
				}
				Promise.resolve(proyectos)
			})
		}).catch(e => console.log(e))
		return proyectos
	}
}
