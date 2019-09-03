import { Component, OnInit, Input, Inject} from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})

export class CategoriaComponent implements OnInit {

  constructor() {}

  @Input() categorias: any;
  @Input() idSubnivel: any;
  @Input() hijosFlag: any;

  data: any;
  selectedKeys: any = '';

  ngOnInit() {
    this.data = this.categorias;
  }

  select(item) {
    this.idSubnivel = item.dataItem.id;
    if (item.dataItem.sublevels !== undefined) {
      this.hijosFlag = true;
    } else {
      this.hijosFlag = false;
    }
    console.log('id', this.idSubnivel);
    console.log('hijos', this.hijosFlag);
  }

}
