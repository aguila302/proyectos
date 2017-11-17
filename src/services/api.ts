import {
	Injectable
} from '@angular/core'
import {
	HTTP
} from '@ionic-native/http';

@Injectable()
/* Clase para el manejo de la api. */
export class ApiService {
	
	constructor(private http: HTTP) {}
	/* Funcion para resolver al api y loguear al usuario */
	resolveApi(usuario: string, password: string) {
		let token = {}
		// this.http.post(`http://qa.calymayor.com.mx/biprows/public/api/login`, {
		return this.http.post(`http://11.11.1.157/laravel5.5/public/api/login`, {
				'username': usuario,
				'password': password
			}, {})
			.then(function (response) { /* Responde con http 200 */
				/* Obtenemos el token de accseso. */
				return JSON.parse(response.data)
			})
			.catch(error => { /* Response un 404 en caso de no autorizado. */
				console.error.bind(console)
			});
	}

	/* Funcion para cargar el archivo excel al origen de datos en el servidor. */
	readerArchivoExcel = () => {
		let status = {}
		this.http.setRequestTimeout(15000)
		return this.http.post('http://11.11.1.157/laravel5.5/public/api/proyectos', {}, {})
			.then(response => {
				return JSON.parse(response.data)
			}).catch(error => {
				console.log(error.error)
			})
	}

	/* Funcion para obtener los proyectos en el api. */
	sincronizar = () => {
		let proyectos = []
		this.http.get('http://11.11.1.157/laravel5.5/public/api/proyectos', {}, {})
			.then(response => {
				proyectos.push(JSON.parse(response.data))
				console.log(proyectos)
			})
			.catch(error => {
				console.log(error.error)
			})
	}
}