import { Component, OnInit, Input, Inject} from '@angular/core';

@Component({
  selector: 'app-ordenar',
  templateUrl: './ordenar.component.html',
  styleUrls: ['./ordenar.component.scss']
})

export class OrdenarComponent implements OnInit {


  @Input() productos: any;

  constructor() {
  }

  ngOnInit() {
  }


}
