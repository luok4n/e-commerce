import { Component, OnInit, Input, Inject} from '@angular/core';

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

  constructor() {
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
