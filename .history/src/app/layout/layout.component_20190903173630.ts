import { Component, OnInit } from '@angular/core';
import categoriasJson from './../../assets/categories.json';
import productosJson from './../../assets/products.json';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    myForm: any;
    filtrosForm: any;

    constructor(private formBuilder: FormBuilder) {
      this.myForm = this.formBuilder.group({
        idSubnivel: '',
        hijosFlag: ''
      });

      this.filtrosForm = this.formBuilder.group({
        Disponibilidad: ['Ambos'],
        precio1: 0,
        precio2: 9999999,
        stock: 0
      });
    }

    categorias: Array<any> = [];
    productosJs: Array<any> = [];
    productos: Array<any> = [];
    hijosFlag: any;
    idSubnivel: any;
    filtroFlag: any;

    ngOnInit() {
      this.productosJs = productosJson.products;
      this.categorias = categoriasJson.categories;
    }

}
