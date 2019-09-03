import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})

export class CategoriaComponent implements OnInit {

  constructor() {}

  @Input() categorias: any;
  @Input() myForm: any;

  data: any;
  selectedKeys: any = '';

  ngOnInit() {
    this.data = this.categorias;
  }

  select(item) {
    if (item.item.dataItem.sublevels !== undefined) {
      this.myForm.controls.hijosFlag.setValue(false);
    } else {
      this.myForm.controls.hijosFlag.setValue(true);
    }
    if (item.item.index[1] !== undefined) {
      this.myForm.controls.idSubnivel.setValue(item.item.dataItem.id);
    } else {
      this.myForm.controls.idSubnivel.setValue(-1);
    }
  }

}
