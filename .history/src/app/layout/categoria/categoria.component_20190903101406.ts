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
    console.log(item);
    if (item.item.dataItem.sublevels !== undefined) {
      this.hijosFlag = true;
    } else {
      this.hijosFlag = false;
    }
    if (item.item.index[1] !== undefined) {
      this.idSubnivel = item.item.dataItem.id;
    } else {
      this.idSubnivel = -1;
    }
    console.log(this.idSubnivel);
  }

}
