import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {

  @Input() myForm: any;
  @Input() productosJson: any;
  @Input() productos: any;
  filtroNombreForm: any;

  constructor(private formBuilder: FormBuilder) {
    this.filtroNombreForm = this.formBuilder.group({
      nombre: ''
    });
  }

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    let auxiliar: any;
    auxiliar = this.productosJson;
    for (let i = 0; i < auxiliar.length; i++) {
      this.productos[i] = {id: auxiliar[i].id, nombre: auxiliar[i].name, precio: auxiliar[i].price, cantidad: auxiliar[i].quantity,
        disponible: auxiliar[i].available, subnivelId: auxiliar[i].sublevel_id, filtro: false};
    }
  }

}
