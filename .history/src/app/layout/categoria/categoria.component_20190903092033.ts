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
  data: any;
  selectedKeys: any = '';
  hasChildren = (item: any) => item.sublevels && item.sublevels.length > 0;
  fetchChildren = (item: any) => of(item.sublevels);

  ngOnInit() {
    this.data = this.categorias;
    console.log(this.categorias);
  }

  event(selection) {
    setTimeout(() => {
      console.log(selection);
    }, 100);
  }

}
