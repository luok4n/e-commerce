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
      precio2: ''
    });
  }

  disponibilidadList: string[] = ['Disponible', 'No disponible'];

  ngOnInit() {
    this.onChanges();
    this.onChangesCategoria();
  }

  onChanges(): void {
    this.filtrosForm.valueChanges.subscribe(val => {
      if (this.filtrosForm.value.Disponibilidad === 'Disponible') {
        this.filtrarDisponible(true);
      } else {
        if (this.filtrosForm.value.Disponibilidad === 'No disponible') {
          this.filtrarDisponible(false);
        }
      }
    });
  }

  filtrarDisponible(estado) {
    let idSubnivel: any;
    idSubnivel = this.myForm.value.idSubnivel;
    for (let i = 0; i < this.productos.length; i++) {
      if (this.productos[i].subnivelId === idSubnivel) {
        if (this.productos[i].disponible === estado) {
          this.productos[i].filtro = true;
        } else {
          this.productos[i].filtro = false;
        }
      }
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
