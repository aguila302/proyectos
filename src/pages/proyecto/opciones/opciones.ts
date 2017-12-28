import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';

@IonicPage()
@Component({
	selector: 'page-opciones',
	templateUrl: 'opciones.html',
})
export class OpcionesPage {
	versionApp: string = ''
	nombreApp: string = ''

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private appVersion: AppVersion, private document: DocumentViewer, public viewCtrl: ViewController, public platform: Platform) {
	}

	// options: DocumentViewerOptions = {
	// 	title: 'My PDF'
	// }
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad OpcionesPage');
		this.detalleApp()
	}

	/* Funcion para obtener el detalle de la app*/
	detalleApp = () => {
		this.appVersion.getVersionNumber().then(version => {
			this.versionApp = version
		})
		this.appVersion.getAppName().then(nombre => {
			this.nombreApp = nombre
		})
	}

	/* Funcion para ver archivo pdf*/
	muestraPdf = () => {
		console.log('pdf')
		let path: string = ''

		if(this.platform.is('android')) {
			path = 'file:///android_asset/'
		}

		if(this.platform.is('ios')) {
			path = '/var/mobile/Applications/<UUID>/'
		}
		
		const options: DocumentViewerOptions = {
			title: 'My PDF'
		}
		this.document.viewDocument(path + 'assets/BIPRO.pdf', 'application/pdf', options)
	}

	/* Funcion para cerrar la ventana de opciones */
	cerrarOpciones = () => {
		this.viewCtrl.dismiss()
	}
}
