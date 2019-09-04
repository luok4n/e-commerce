import { Component, OnInit, Input, Inject} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CarritoComponent } from './../../carrito/carrito.component';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
    public pushRightClass: string;
    administrador: boolean;
    iSuspension: boolean;
    fSuspension: boolean;
    tarea: boolean;
    nombreBool: boolean;
    nombreTarea: any;
    @Input() categorias: any;
    @Input() filtrosForm: any;
    @Input() myForm: any;
    @Input() productos: any;
    @Input() filtroFlag: any;
    @Input() filtroNombreForm: any;

    constructor(
      public router: Router, public dialog: MatDialog) {
      this.router.events.subscribe(val => {
          if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
              this.toggleSidebar();
          }
      });
    }

    ngOnInit() {
      this.pushRightClass = 'push-right';
    }

    isToggled(): boolean {
      const dom: Element = document.querySelector('body');
      return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
      const dom: any = document.querySelector('body');
      dom.classList.toggle(this.pushRightClass);
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(CarritoComponent, {
        width: '70%',
        data: {}
      });
    }
}
