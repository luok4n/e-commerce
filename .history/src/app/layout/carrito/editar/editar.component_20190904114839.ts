import { Component, OnInit, Input, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})

export class EditarComponent implements OnInit {

  carrito: Array<{idProducto: any, nombre: any, precio: any, cantidad: any, stock: any}> = [];
  cantidadForm: any;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditarComponent>,
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
    const carrito: Array<{idProducto: any, nombre: any, precio: any, cantidad: any, stock: any}> = [];
    localStorage.setItem('Carrito', JSON.stringify(carrito));
    this.onNoClick();
  }

  eliminarProducto(index) {
    this.carrito.splice(index, 1);
    alert('Producto eliminado correctamente');
    localStorage.setItem('Carrito', JSON.stringify(this.carrito));
  }

}
