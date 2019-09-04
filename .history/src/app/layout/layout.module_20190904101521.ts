import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { TopnavComponent } from './components/topnav/topnav.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ProductoComponent } from './productos/producto/producto.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { ProductosComponent } from './productos/productos.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FiltrosComponent } from './productos/filtros/filtros.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ModalComponent } from './productos/producto/modal/modal.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatTooltipModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        TranslateModule,
        MatExpansionModule,
        TreeViewModule,
        MatCardModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatSelectModule,
        FlexLayoutModule.withConfig({addFlexToParent: false}),
        MatDialogModule,
        MatIconModule,
        MatTooltipModule,
        MatInputModule,
        MatCardModule,
        MatSidenavModule,
        MatListModule,
        MatExpansionModule,
        MatSelectModule,
        MatDialogModule
    ],
    exports: [
      CarritoComponent,
      ProductoComponent,
      CategoriaComponent,
      ProductosComponent,
      FiltrosComponent,
      ModalComponent
    ],
    declarations: [
      LayoutComponent,
      TopnavComponent,
      CarritoComponent,
      ProductoComponent,
      CategoriaComponent,
      ProductosComponent,
      FiltrosComponent,
      ModalComponent
    ]
})
export class LayoutModule {}
