/**
 * Clase para la funcionalidad de la graficar la grafica principal del grupo direccion, año.
 */
export class GraficoGrupo {
	categorias = []
	serie = []
	title: string = ''
	/**
	 * @param {any[]}  categorias
	 * @param {any[]}  serie
	 * @param {string} title
	 */
	constructor(categorias: any[], serie: any[], title: string) {
		this.categorias = categorias
		this.serie = serie
		this.title = title
	}
	/**
	 * Funcion para graficar la graficas principal del grupo direccion, año
	 */
	graficaBasicColumn = () => {
		let options = {
			chart: {
				type: 'column'
			},
			title: {
				text: this.title
			},
			xAxis: {
				categories: this.categorias,
				crosshair: true
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Porcentaje total de participación'
				}
			},
			tooltip: {
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
					'<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0
				}
			},
			series: this.serie
		}
		return options
	}
}