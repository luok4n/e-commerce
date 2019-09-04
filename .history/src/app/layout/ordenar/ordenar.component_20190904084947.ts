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
  }

  onChanges(): void {
    this.ordenarForm.valueChanges.subscribe(val => {
    });
  }

  ordenarDisponibilidad() {
    let auxiliarProductosDisponibles: any;
    let auxiliarProductosNoDisponibles: any;
    let indexDisponible: any;
    let indexNoDisponible: any;
    indexDisponible = 0;
    indexNoDisponible = 0;
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
      this.productos = auxiliarProductosDisponibles + auxiliarProductosNoDisponibles;
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
      this.productos = auxiliarProductosNoDisponibles + auxiliarProductosDisponibles;
    }
  }

}
