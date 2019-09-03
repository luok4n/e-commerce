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
  productos: Array<any> = [];
  filtroFlag: any;
  filtrosForm: any;

  constructor(private formBuilder: FormBuilder) {
    this.filtrosForm = this.formBuilder.group({
      Disponibilidad: ['', [Validators.required]],
      precio1: '',
      precio2: ''
    });
  }

  ngOnInit() {
    this.obtenerProductos();
    this.onChangesCategoria();
  }

  obtenerProductos() {
    let auxiliar: any;
    auxiliar = this.productosJson;
    for (let i = 0; i < auxiliar.length; i++) {
      this.productos[i] = {id: auxiliar[i].id, nombre: auxiliar[i].name, precio: auxiliar[i].price, cantidad: auxiliar[i].quantity,
        disponible: auxiliar[i].available, subnivelId: auxiliar[i].sublevel_id, filtro: false};
    }
  }

  onChangesCategoria(): void {
    this.myForm.valueChanges.subscribe(val => {
      for (let i = 0; i < this.productos.length; i++) {
        if (this.productos[i].subnivelId === this.myForm.value.idSubnivel) {
          this.productos[i].filtro = true;
        } else {
          this.productos[i].filtro = false;
        }
      }
      if (this.myForm.value.hijosFlag === true) {
        this.filtroFlag = true;
      } else {
        this.filtroFlag = false;
      }
    });
  }

}
