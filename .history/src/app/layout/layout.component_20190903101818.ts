import { Component, OnInit } from '@angular/core';
import categoriasJson from './../../assets/categories.json';
import productosJson from './../../assets/products.json';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor() {
    }

    productos: Array<any> = [];
    categorias: Array<any> = [];
    hijosFlag: any;
    idSubnivel: any;

    ngOnInit() {
      this.obtenerProductos();
      this.categorias = categoriasJson.categories;
    }

    obtenerProductos() {
      let auxiliar: any;
      auxiliar = productosJson.products;
      for (let i = 0; i < auxiliar.length; i++) {
        this.productos[i] = {id: auxiliar[i].id, nombre: auxiliar[i].name, precio: auxiliar[i].price, cantidad: auxiliar[i].quantity,
          disponible: auxiliar[i].available, subnivelId: auxiliar[i].sublevel_id, filtro: true};
      }
    }

    obtenerCategorias() {
      let auxiliar: any;
      auxiliar = categoriasJson.categories;
      for (let i = 0; i < auxiliar.length; i++) {
        this.guardarSubnivel(auxiliar[i], i);
      }
    }

    guardarSubnivel(categoria, index) {
      for (let i = 0; i < categoria.sublevels.length; i++) {
        if (categoria.sublevels !== undefined) {
          this.categorias[index] = {id: categoria.id, nombre: categoria.name, padre: false};
        } else {
          return {id: categoria.id, nombre: categoria.name, padre: false};
        }
      }
    }

}
