import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
		private appVersion: AppVersion, private document: DocumentViewer) {
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
		const options: DocumentViewerOptions = {
			title: 'My PDF'
		}
		this.document.viewDocument('../../../../www/assets/BIPRO.pdf', 'application/pdf', options)
	}
}
