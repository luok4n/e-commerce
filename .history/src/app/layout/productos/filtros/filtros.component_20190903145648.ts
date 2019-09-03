import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})

export class FiltrosComponent implements OnInit {

  filtrosForm: any;
  @Input() productos: any;
  @Input() myForm: any;

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
  }

  onChanges(): void {
    this.filtrosForm.valueChanges.subscribe(val => {
      console.log('hola');
      if (this.filtrosForm.value.Disponibilidad === 'Disponible') {
        console.log('true');
        this.filtrarDisponible(true);
      } else {
        if (this.filtrosForm.value.Disponibilidad === 'No disponible') {
          console.log('false');
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
        }
      }
    }
  }

}
