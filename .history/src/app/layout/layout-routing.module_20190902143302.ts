import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: './adminConfig/adminConfig.module#AdminConfigModule'
            },
            {
                path: 'config',
                loadChildren: './adminConfig/adminConfig.module#AdminConfigModule'
            },
            {
                path: 'config/crearRIAS/:id/:funcion',
                loadChildren: './adminConfig/crear/crear.module#CrearModule'
            },
            {
                path: 'config/categoria',
                loadChildren: './adminConfig/categoria/categoria.module#CategoriaModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
