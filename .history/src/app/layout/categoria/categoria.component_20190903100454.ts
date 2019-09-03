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
  public hasChildren(node: any): void {
    if (node.sublevels && node.sublevels.length > 0) {
      console.log(true);
    } else {
      console.log(false);
    }
  }

  fetchChildren = (item: any) => of(item.sublevels);

  ngOnInit() {
    this.data = this.categorias;
  }

  select(id) {
    console.log('id', id);
  }

  public handleSelection({ index }: any): void {
    console.log(index);
}
}
