import { Component, OnInit, Input, Inject} from '@angular/core';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})

export class ProductoComponent implements OnInit {

  @Input() producto: any;

  constructor() {}

  ngOnInit() {
    console.log('producto', this.producto);
  }

}
