import { Component, OnInit, Input, Inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})

export class ProductoComponent implements OnInit {

  @Input() producto: any;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }


  openDialog(producto): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '70%',
      data: {producto}
    });
  }

}
