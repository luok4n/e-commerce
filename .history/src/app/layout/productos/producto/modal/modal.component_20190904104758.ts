import { Component, OnInit, Input, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {

  producto: any;
  cantidadForm: any;
  carrito: Array<{idProducto: any, nombre: any, precio: any, cantidad: any, stock: any}> = [];

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
      this.cantidadForm = this.formBuilder.group({
        cantidad: ''
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
    this.producto = this.data.producto;
  }

  guardarProducto() {
    this.carrito = JSON.parse(localStorage.getItem('Carrito'));
    console.log(this.carrito);
    if (this.cantidadForm.value.cantidad === '') {
      alert('Seleccione una cantidad');
    }
    if (this.cantidadForm.value.cantidad > this.producto.cantidad) {
      alert('Cantidad no disponible en stock');
    } else {
      let i: any;
      if (this.carrito.length === 0) {
        i = 0;
      } else {
        i = 1;
      }
      this.carrito[this.carrito.length + i] = {idProducto: this.producto.id, nombre: this.producto.nombre, precio: this.producto.precio,
        cantidad: this.cantidadForm.value.cantidad, stock: this.producto.cantidad};
      localStorage.setItem('Carrito', JSON.stringify(this.carrito));
    }
    this.onNoClick();
  }

}
