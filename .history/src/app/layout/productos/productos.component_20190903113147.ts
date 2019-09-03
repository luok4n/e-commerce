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
  filtroFlag: any;

  constructor() {}

  ngOnInit() {
    this.obtenerProductos();
    this.onChanges();
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
      for (let i = 0; i < this.productos.length; i++) {
        if (this.productos[i].subnivelId === this.myForm.value.idSubnivel) {
          this.productos[i].filtro = true;
        } else {
          this.productos[i].filtro = false;
        }
      }
      if (this.myForm.value.hijosFlag === true) {
        this.filtroFlag = true;
        console.log(true);
      } else {
        this.filtroFlag = false;
        console.log(false);
      }
    });
  }


}
