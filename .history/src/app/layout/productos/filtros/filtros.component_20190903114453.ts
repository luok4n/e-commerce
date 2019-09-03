import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})

export class FiltrosComponent implements OnInit {

  filtrosForm: any;

  constructor(private formBuilder: FormBuilder) {
    this.filtrosForm = this.formBuilder.group({
      Disponibilidad: '',
      hijosFlag: ''
    });
  }

  disponibilidadList: string[] = ['', 'Disponible', 'No disponible'];

  ngOnInit() {
  }


}
