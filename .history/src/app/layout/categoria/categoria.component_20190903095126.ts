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
  public hasChildren(node: any): boolean {
    return node.items && node.items.length > 0;
  }

  fetchChildren = (item: any) => of(item.sublevels);

  ngOnInit() {
    this.data = this.categorias;
  }

  event(id) {
    console.log('id', id);
  }

}
