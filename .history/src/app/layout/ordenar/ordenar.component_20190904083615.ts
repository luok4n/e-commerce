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
  cantidad: string[] = ['Mayor a menor cantidad', 'Menor a mayor cantidad'];

  constructor(private formBuilder: FormBuilder) {
    this.ordenarForm = this.formBuilder.group({
      disponibilidad: '',
      precio: '',
      cantidad: ''
    });
  }

  ngOnInit() {
  }


}
