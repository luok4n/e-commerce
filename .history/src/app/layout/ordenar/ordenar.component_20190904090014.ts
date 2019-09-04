import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-ordenar',
  templateUrl: './ordenar.component.html',
  styleUrls: ['./ordenar.component.scss']
})

export class OrdenarComponent implements OnInit {


  @Input() productos: any;
  ordenarForm: any;

  disponibilidadList: string[] = ['Disponible', 'No disponible'];
  precioList: string[] = ['Mayor a menor precio', 'Menor a mayor precio'];
  cantidadList: string[] = ['Mayor a menor cantidad', 'Menor a mayor cantidad'];

  constructor(private formBuilder: FormBuilder) {
    this.ordenarForm = this.formBuilder.group({
      disponibilidad: '',
      precio: '',
      cantidad: ''
    });
  }

  ngOnInit() {
    this.onChanges();
  }

  onChanges(): void {
    this.ordenarForm.valueChanges.subscribe(val => {
      this.ordenarDisponibilidad();
    });
  }

  ordenarDisponibilidad() {
    let auxiliarProductosDisponibles: Array<any> = [];
    let auxiliarProductosNoDisponibles: Array<any> = [];
    let indexDisponible: any;
    let indexNoDisponible: any;
    indexDisponible = 0;
    indexNoDisponible = 0;
    console.log('1');
    if (this.ordenarForm.value.disponibilidad === 'Disponible') {
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
    if (this.ordenarForm.value.disponibilidad === 'No disponible') {
      for (let i = 0; i < this.productos.length; i++) {
        if (this.productos[i].disponible === true) {
          auxiliarProductosNoDisponibles[indexNoDisponible] = this.productos[i];
          indexNoDisponible = indexNoDisponible + 1;
        } else {
          auxiliarProductosDisponibles[indexDisponible] = this.productos[i];
          indexDisponible = indexDisponible + 1;
        }
      }
      this.productos = auxiliarProductosNoDisponibles.concat(auxiliarProductosDisponibles);
    }
  }

}
