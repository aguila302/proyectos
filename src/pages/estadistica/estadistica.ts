import { Component, OnInit } from '@angular/core'
import { DbService } from '../../services/db.service'
import * as collect from 'collect.js/dist'

@Component({
	selector: 'page-estadistica',
	templateUrl: 'estadistica.html',
})

export class EstadisticaPage {
	pais: string = 'pais'
	proyectos = []

	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public barChartData: any[] = [{
		data: [65, 59, 80, 81, 56, 55, 40],
		label: 'Series A'
	}, {
		data: [28, 48, 40, 19, 86, 27, 90],
		label: 'Series B'
	}];

	// events
	public chartClicked(e: any): void {
		console.log(e);
	}

	public chartHovered(e: any): void {
		console.log(e);
	}
	ionViewDidLoad (): void {
		console.log('Iniciando estadisticas ')
	}

	constructor(private dbService: DbService) {
		this.getDatosXPais()
	}

	getDatosXPais = (): any => {
		let data = this.dbService.consultaXPais()
		console.log(data)
	}
}
