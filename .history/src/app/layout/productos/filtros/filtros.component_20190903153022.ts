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
      Disponibilidad: ['', [Validators.required]],
      precio1: '',
      precio2: '',
      stock: ''
    });
  }

  disponibilidadList: string[] = ['', 'Disponible', 'No disponible'];

  ngOnInit() {
    this.onChanges();
    this.onChangesCategoria();
  }

  onChanges(): void {
    this.filtrosForm.valueChanges.subscribe(val => {
      for (let i = 0; i < this.productos.length; i++) {
        this.verificarFiltro(this.productos[i], this.myForm.value.idSubnivel, this.filtrosForm.value.Disponibilidad,
          this.filtrosForm.value.precio1, this.filtrosForm.value.precio2, this.filtrosForm.value.stock);
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

  verificarFiltro(producto, idSubnivel, disponible, precio1, precio2, stock) {
    if (producto.idSubnivel === idSubnivel) {}
  }

}
