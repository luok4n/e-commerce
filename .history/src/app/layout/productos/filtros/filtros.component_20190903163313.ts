import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})

export class FiltrosComponent implements OnInit {


  @Input() productos: any;
  @Input() myForm: any;
  @Input() filtroFlag: any;
  filtrosForm: any;

  constructor(private formBuilder: FormBuilder) {
    this.filtrosForm = this.formBuilder.group({
      Disponibilidad: ['Ambos'],
      precio1: 0,
      precio2: 9999999,
      stock: 0
    });
  }

  disponibilidadList: string[] = ['Ambos', 'Disponible', 'No disponible'];

  ngOnInit() {
    this.onChanges();
    this.onChangesCategoria();
  }

  onChanges(): void {
    this.filtrosForm.valueChanges.subscribe(val => {
      for (let i = 0; i < this.productos.length; i++) {
        this.verificarFiltro(this.productos[i], this.myForm.value.idSubnivel, this.filtrosForm.value.Disponibilidad,
          this.filtrosForm.value.precio1, this.filtrosForm.value.precio2, this.filtrosForm.value.stock, i);
      }
    });
  }

  filtrarDisponible(producto, estado) {
    if (producto.disponible === estado) {
      producto.filtro = true;
    } else {
      producto.filtro = false;
    }
  }

  onChangesCategoria(): void {
    this.myForm.valueChanges.subscribe(val => {
      for (let i = 0; i < this.productos.length; i++) {
        this.verificarFiltro(this.productos[i], this.myForm.value.idSubnivel, this.filtrosForm.value.Disponibilidad,
          this.filtrosForm.value.precio1, this.filtrosForm.value.precio2, this.filtrosForm.value.stock, i);
      }
      if (this.myForm.value.hijosFlag === true) {
        this.filtroFlag = true;
      } else {
        this.filtroFlag = false;
      }
    });
  }

  verificarFiltro(producto, idSubnivel, disponible, precio1, precio2, stock, index) {
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
    console.log(Auxprecio);
    console.log('number', precio1);
    if (disponible === 'Ambos') {
      if ((producto.subnivelId === idSubnivel) && (Auxprecio > precio1) && (Auxprecio < precio2) &&
        (producto.cantidad >= stock)) {
          this.productos[index].filtro = true;
      } else {
        this.productos[index].filtro = false;
      }
    } else {
      if ((producto.subnivelId === idSubnivel) && (producto.disponible === estado) && (Auxprecio > precio1) &&
        (Auxprecio < precio2) && (producto.cantidad >= stock)) {
          this.productos[index].filtro = true;
      } else {
        this.productos[index].filtro = false;
      }
    }
  }

}
