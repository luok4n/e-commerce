import { Component, OnInit, Input, Inject} from '@angular/core';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {

  @Input() myForm: any;
  @Input() productosJson: any;
  @Input() productos: any;
  @Input() filtrosForm: any;
  @Input() filtroNombreForm: any;

  constructor() {
  }

  ngOnInit() {
    this.onChanges();
    this.obtenerProductos();
//    this.ordenarDisponibilidad();
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
    this.filtroNombreForm.valueChanges.subscribe(val => {
      for (let i = 0; i < this.productos.length; i++) {
        this.verificarFiltro(this.productos[i], this.myForm.value.idSubnivel, this.filtrosForm.value.Disponibilidad,
          this.filtrosForm.value.precio1, this.filtrosForm.value.precio2, this.filtrosForm.value.stock, i);
      }
    });
  }

  verificarFiltro(producto, idSubnivel, disponible, precio1, precio2, stock, index) {
    let auxNombre: any;
    auxNombre = producto.nombre.includes(this.filtroNombreForm.value.nombre);
    let estado: any;
    if (disponible === 'Disponible') {
      estado = true;
    } else {
        estado = false;
    }
    if ((+precio1 > +precio2) && (+precio2 !== 0)) {
      let auxiliar: any;
      auxiliar = precio1;
      precio1 = precio2;
      precio2 = auxiliar;
    }
    let Auxprecio: any;
    Auxprecio = producto.precio.replace('$', '');
    Auxprecio = Auxprecio.replace(',', '');
    Auxprecio = +Auxprecio;
    if (disponible === 'Ambos') {
      if ((producto.subnivelId === idSubnivel) && (Auxprecio > precio1) && (Auxprecio < precio2) &&
        (producto.cantidad >= stock) && auxNombre) {
          this.productos[index].filtro = true;
      } else {
        this.productos[index].filtro = false;
      }
    } else {
      if ((producto.subnivelId === idSubnivel) && (producto.disponible === estado) && (Auxprecio > precio1) &&
        (Auxprecio < precio2) && (producto.cantidad >= stock) && auxNombre) {
          this.productos[index].filtro = true;
      } else {
        this.productos[index].filtro = false;
      }
    }
  }

  ordenarDisponibilidad() {
    let auxiliarProductosDisponibles: Array<any> = [];
    let auxiliarProductosNoDisponibles: Array<any> = [];
    let indexDisponible: any;
    let indexNoDisponible: any;
    indexDisponible = 0;
    indexNoDisponible = 0;
    console.log('1');
      for (let i = 0; i < this.productos.length; i++) {
        if (this.productos[i].disponible === true) {
          auxiliarProductosDisponibles[indexDisponible] = this.productos[i];
          indexDisponible = indexDisponible + 1;
        } else {
          auxiliarProductosNoDisponibles[indexNoDisponible] = this.productos[i];
          indexNoDisponible = indexNoDisponible + 1;
        }
      }
      console.log('auxiliarproductos1', auxiliarProductosDisponibles);
      console.log('auxiliarproductos2', auxiliarProductosNoDisponibles);
      this.productos = auxiliarProductosDisponibles.concat(auxiliarProductosNoDisponibles);
      console.log('auxiliarproductos3', this.productos);
  }

}
