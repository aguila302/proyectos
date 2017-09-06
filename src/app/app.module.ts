import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { EstadisticaPage } from '../pages/estadistica/estadistica';
import { ReportePage } from '../pages/reporte/reporte';
import { ProyectoPage } from '../pages/proyecto/proyecto';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login'

import { DbService } from '../services/db.service'
import { ReportesDbService } from '../services/reportes.db.service'
import { DetalleProyectoPage } from '../pages/proyecto/DetalleProyecto';
import { FiltrosPage } from '../pages/proyecto/filtros/filtros';
import { CircularPaisPage } from '../pages/estadistica/circular-pais';
import { CircularAnioPage } from '../pages/estadistica/graficaCircularAnio/circular-anio';
import { CircularGerenciaPage } from '../pages/estadistica/graficaCircularGerencia/circular-gerencia';
import { CircularClientePage } from '../pages/estadistica/graficaCircularCliente/circular-cliente'

import { ProyectosAgrupadosPage } from '../pages/estadistica/proyectos-agrupados/proyectos-agrupados';
import { ProyectosAgrupadosAnioPage } from '../pages/estadistica/proyectos-agrupados/por-anio/proyectos-agrupados-anio';
import { ProyectosAgrupadosGerenciaPage } from '../pages/estadistica/proyectos-agrupados/por-gerencia/proyectos-agrupados-gerencia'
import { ProyectosAgrupadosClientePage } from '../pages/estadistica/proyectos-agrupados/por-cliente/proyectos-agrupados-cliente'
import { ProyectosAgrupadosClienteMenoresPage } from '../pages/estadistica/proyectos-agrupados/por-cliente/por-cliente-menores/proyectos-agrupados-cliente-menores'
import { DetalleReportePage } from '../pages/reporte/detalle-reporte/detalle-reporte'
import { NuevoReportePage } from '../pages/reporte/nuevo-reporte/nuevo-reporte'
import { SelectColumnasPage } from '../pages/reporte/select-columnas/select-columnas'
import { SelectAgrupacionesPage } from '../pages/reporte/select-agrupaciones/select-agrupaciones'
import { DetalleReporteAgrupadoPage } from '../pages/reporte/detalle-reporte/detalle-reporte-agrupado/detalle-reporte-agrupado'
import { FiltrarColumnasPage } from '../pages/reporte/nuevo-reporte/filtrar-columnas/filtrar-columnas'

import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'highcharts';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SQLite } from '@ionic-native/sqlite';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

@NgModule({
  declarations: [
    MyApp,
    EstadisticaPage,
    ReportePage,
    ProyectoPage,
    TabsPage,
    DetalleProyectoPage,
    FiltrosPage,
    CircularPaisPage,
    ProyectosAgrupadosPage,
    ProyectosAgrupadosAnioPage,
    CircularAnioPage,
    ProyectosAgrupadosGerenciaPage,
    CircularGerenciaPage,
    ProyectosAgrupadosClientePage,
    ProyectosAgrupadosClienteMenoresPage,
    CircularClientePage,
    LoginPage,
    DetalleReportePage,
    NuevoReportePage,
    SelectColumnasPage,
    SelectAgrupacionesPage,
    DetalleReporteAgrupadoPage,
    FiltrarColumnasPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ChartsModule,
    ChartModule.forRoot(highcharts),
    Ng2SmartTableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EstadisticaPage,
    ReportePage,
    ProyectoPage,
    TabsPage,
    DetalleProyectoPage,
    FiltrosPage,
    CircularPaisPage,
    ProyectosAgrupadosPage,
    ProyectosAgrupadosAnioPage,
    CircularAnioPage,
    ProyectosAgrupadosGerenciaPage,
    CircularGerenciaPage,
    ProyectosAgrupadosClientePage,
    ProyectosAgrupadosClienteMenoresPage,
    CircularClientePage,
    LoginPage,
    DetalleReportePage,
    NuevoReportePage,
    SelectColumnasPage,
    SelectAgrupacionesPage,
    DetalleReporteAgrupadoPage,
    FiltrarColumnasPage
  ],
  providers: [
    StatusBar,
    SplashScreen, {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    SQLite,
    DbService,
    ReportesDbService,
    SQLitePorter
  ]
})
export class AppModule {}
