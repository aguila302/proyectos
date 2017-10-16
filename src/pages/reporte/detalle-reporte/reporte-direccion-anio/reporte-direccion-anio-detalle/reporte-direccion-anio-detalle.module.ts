import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReporteDireccionAnioDetallePage } from './reporte-direccion-anio-detalle';

@NgModule({
  declarations: [
    ReporteDireccionAnioDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(ReporteDireccionAnioDetallePage),
  ],
  exports: [
    ReporteDireccionAnioDetallePage
  ]
})
export class ReporteDireccionAnioDetallePageModule {}
