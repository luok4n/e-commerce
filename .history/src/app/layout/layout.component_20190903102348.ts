import { Component, OnInit } from '@angular/core';
import categoriasJson from './../../assets/categories.json';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor() {
    }

    categorias: Array<any> = [];
    hijosFlag: any;
    idSubnivel: any;

    ngOnInit() {
      this.categorias = categoriasJson.categories;
    }

}
