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
    MatCardModule
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
        FormsModule
    ],
    exports: [
      CarritoComponent,
      ProductoComponent,
      CategoriaComponent,
      ProductosComponent
    ],
    declarations: [
      LayoutComponent,
      TopnavComponent,
      CarritoComponent,
      ProductoComponent,
      CategoriaComponent,
      ProductosComponent
    ]
})
export class LayoutModule {}
