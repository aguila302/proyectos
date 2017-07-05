import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { ProyectoPage } from '../proyecto/proyecto';
import { EstadisticaPage } from '../estadistica/estadistica';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = ProyectoPage;
	tab2Root = EstadisticaPage;
	tab3Root = ContactPage;

	constructor() {

	}
}
