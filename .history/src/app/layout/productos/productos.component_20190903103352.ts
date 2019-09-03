import { Component, OnInit, Input, Inject} from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {

  @Input() hijosFlag: any;
  @Input() idSubnivel: any;
  @Input() productosJson: any;
  productos: Array<any> = [];

  constructor() {}

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    let auxiliar: any;
    auxiliar = this.productosJson;
    console.log('auxiliar', this.productosJson);
    for (let i = 0; i < auxiliar.length; i++) {
      this.productos[i] = {id: auxiliar[i].id, nombre: auxiliar[i].name, precio: auxiliar[i].price, cantidad: auxiliar[i].quantity,
        disponible: auxiliar[i].available, subnivelId: auxiliar[i].sublevel_id, filtro: true};
    }
    console.log('productos', this.productos);
  }

}
