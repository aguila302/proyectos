import { Component } from '@angular/core';

import { ReportePage } from '../reporte/reporte';
import { ProyectoPage } from '../proyecto/proyecto';
import { EstadisticaPage } from '../estadistica/estadistica';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = ProyectoPage;
	tab2Root = EstadisticaPage;
	tab3Root = ReportePage;

	constructor() {

	}
}
