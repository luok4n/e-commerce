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

    myForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
      this.myForm = this.formBuilder.group({
        idSubnivel: '',
        hijosFlag: ''
      });
    }

    categorias: Array<any> = [];
    productosJs: Array<any> = [];
    productos: Array<any> = [];
    hijosFlag: any;
    idSubnivel: any;

    ngOnInit() {
      this.productosJs = productosJson.products;
      this.categorias = categoriasJson.categories;
    }

}
