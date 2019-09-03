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

    productos: any;
    categorias: any;

    ngOnInit() {
      this.obtenerProductos();
    }

    obtenerProductos() {
      let auxiliar: any;
      auxiliar = productosJson;
      for (let i = 0; i < auxiliar.length; i++) {
        this.productos[i] = {id: auxiliar[i].id, nombre: auxiliar[i].name, precio: auxiliar[i].price, cantidad: auxiliar[i].quantity,
          disponible: auxiliar[i].available, subnivelId: auxiliar[i].sublevel_id, filtro: true};
      }
      console.log(this.productos);
    }

    obtenerCategorias() {
      let auxiliar: any;
      auxiliar = categoriasJson;
      let auxiliarPadre: any;
      for (let i = 0; i < auxiliar.length; i++) {
        if (auxiliar[i].sublevels !== undefined) {
          auxiliarPadre = true;
        } else {
          auxiliarPadre = false;
        }
        this.categorias[i] = {id: auxiliar[i].id, nombre: auxiliar[i].name, padre: auxiliarPadre};
      }
    }

    guardarSubnivel(categoria, index) {
      let auxiliarPadre: any;
      if (categoria[index].sublevels !== undefined) {
        auxiliarPadre = true;
      } else {
        auxiliarPadre = false;
      }
      this.categorias[index] = {id: categoria[index].id, nombre: categoria[index].name, padre: auxiliarPadre};
    }

}
