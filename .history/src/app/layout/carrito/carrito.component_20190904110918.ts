import { Component, OnInit, Input, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})

export class CarritoComponent implements OnInit {

  carrito: any;

  constructor(
    public dialogRef: MatDialogRef<CarritoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
    this.obtenerCarrito();
  }

  obtenerCarrito() {
    this.carrito = JSON.parse(localStorage.getItem('Carrito'));
  }

}
