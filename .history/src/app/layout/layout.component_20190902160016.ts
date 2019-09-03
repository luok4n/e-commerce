import { Component, OnInit } from '@angular/core';
import categorias from './../../assets/categories.json';
import productos from './../../assets/products.json';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor() {
    }

    a: any;

    ngOnInit() {
      console.log(categorias);
      console.log(productos);
    }

}
