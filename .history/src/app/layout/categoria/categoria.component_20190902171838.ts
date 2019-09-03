import { Component, OnInit, Input, Inject} from '@angular/core';
import { inject } from '@angular/core/testing';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})

export class CategoriaComponent implements OnInit {

  constructor() {}

  @Input() categoria: any;
  @Input() index: any;

  ngOnInit() {
    console.log(this.categoria);
  }

}
