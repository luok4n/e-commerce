import { Component, OnInit } from '@angular/core';


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
      this.a = require('./categiries.json');
      console.log(`Listening on port ${this.a.server.nodePort} ...`);

    }

}
