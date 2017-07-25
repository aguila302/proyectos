import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { EstadisticaPage } from '../pages/estadistica/estadistica';
import { ContactPage } from '../pages/contact/contact';
import { ProyectoPage } from '../pages/proyecto/proyecto';
import { TabsPage } from '../pages/tabs/tabs';

import { DbService } from '../services/db.service'
import { DetalleProyectoPage } from '../pages/proyecto/DetalleProyecto';
import { FiltrosPage } from '../pages/proyecto/filtros/filtros';
import { CircularPaisPage } from '../pages/estadistica/circular-pais';
import { CircularAnioPage } from '../pages/estadistica/graficaCircularAnio/circular-anio';
import { ProyectosAgrupadosPage } from '../pages/estadistica/proyectos-agrupados/proyectos-agrupados';
import { ProyectosAgrupadosAnioPage } from '../pages/estadistica/proyectos-agrupados/por-anio/proyectos-agrupados-anio';

//import { ChartsModule } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SQLite } from '@ionic-native/sqlite';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    EstadisticaPage,
    ContactPage,
    ProyectoPage,
    TabsPage,
    DetalleProyectoPage,
    FiltrosPage,
    CircularPaisPage,
    ProyectosAgrupadosPage,
    ProyectosAgrupadosAnioPage,
    CircularAnioPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ChartsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EstadisticaPage,
    ContactPage,
    ProyectoPage,
    TabsPage,
    DetalleProyectoPage,
    FiltrosPage,
    CircularPaisPage,
    ProyectosAgrupadosPage,
    ProyectosAgrupadosAnioPage,
    CircularAnioPage
  ],
  providers: [
    StatusBar,
    SplashScreen, {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    SQLite,
    DbService,
  ]
})
export class AppModule {}
