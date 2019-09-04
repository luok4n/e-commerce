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

  guardarProducto() {}
}
