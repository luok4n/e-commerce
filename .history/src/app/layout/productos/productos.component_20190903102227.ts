import { Component, OnInit, Input, Inject} from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {

  @Input() hijosFlag: any;
  @Input() idSubnivel: any;

  constructor() {}

  ngOnInit() {
  }

}
