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
  producto: any;
  index: any;

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
    this.producto = this.data.producto;
    this.index = this.data.index;
    console.log(this.data);
    this.obtenerCarrito();
  }

  obtenerCarrito() {
    this.carrito = JSON.parse(localStorage.getItem('Carrito'));
  }

  guardarCambio() {
    this.carrito = JSON.parse(localStorage.getItem('Carrito'));
    if (this.cantidadForm.value.cantidad === '') {
      alert('Seleccione una cantidad');
    } else {
      if (this.cantidadForm.value.cantidad > this.producto.cantidad) {
        alert('Cantidad no disponible en stock');
      } else {
        this.carrito[this.index] = {idProducto: this.producto.id, nombre: this.producto.nombre, precio: this.producto.precio,
          cantidad: this.cantidadForm.value.cantidad, stock: this.producto.stock};
        localStorage.setItem('Carrito', JSON.stringify(this.carrito));
        alert('Producto guardado correctamente');
        this.onNoClick();
      }
    }
  }


}
