import { Component, OnInit, Input, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})

export class CarritoComponent implements OnInit {

  carrito: Array<{idProducto: any, nombre: any, precio: any, cantidad: any, stock: any}> = [];
  cantidadForm: any;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CarritoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.cantidadForm = this.formBuilder.group({
        cantidad: ''
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
    this.obtenerCarrito();
  }

  obtenerCarrito() {
    this.carrito = JSON.parse(localStorage.getItem('Carrito'));
  }

  realizarCompra() {
    alert('Compra realizada correctamente');
    localStorage.removeItem('Carrito');
    this.onNoClick();
  }

}
