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
      this.myForm.value.hijosFlag = true;
      this.myForm.controls.hijosFlag.setValue(true);
    } else {
      this.myForm.value.hijosFlag = false;
      this.myForm.controls.hijosFlag.setValue(false);
    }
    if (item.item.index[1] !== undefined) {
      this.myForm.value.idSubnivel = item.item.dataItem.id;
      this.myForm.controls.idSubnivel.setValue(item.item.dataItem.id);
    } else {
      this.myForm.value.idSubnivel = -1;
      this.myForm.controls.idSubnivel.setValue(-1);
    }
    console.log(this.myForm);
  }

}
