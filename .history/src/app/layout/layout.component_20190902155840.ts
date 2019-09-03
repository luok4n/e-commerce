import { Component, OnInit } from '@angular/core';
import data from './categories.json';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor() {
    }

    a: any;

    ngOnInit() {
      console.log(data);
    }

}
