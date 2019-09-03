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

    categorias: Array<any> = [];
    productos: Array<any> = [];
    hijosFlag: any;
    idSubnivel: any;

    ngOnInit() {
      this.productos = productosJson.products;
      this.categorias = categoriasJson.categories;
    }

}
