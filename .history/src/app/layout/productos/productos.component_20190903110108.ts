import { Component, OnInit, Input, Inject} from '@angular/core';
import { ChangeDetectorStatus } from '@angular/core/src/change_detection/constants';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {

  @Input() myForm: any;
  @Input() productosJson: any;
  productos: Array<any> = [];

  constructor() {}

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

  onChanges(): void {
    this.myForm.valueChanges.subscribe(val => {
      console.log(this.myForm.value);
      for (let i = 0; i < this.productos.length; i++) {
        if (this.productos[i].subnivelId === this.myForm.value.idSubnivel) {
          this.productos[i].filtro = true;
        } else {
          this.productos[i].filtro = false;
        }
      }
    });
  }


}
