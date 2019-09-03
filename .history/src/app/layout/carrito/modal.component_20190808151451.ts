import { Component, OnInit, Input, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EjecucionService } from '../../../services/ejecucion.service';
import { AdminService } from '../../../services/admin.service';
@Component({
  selector: 'rias-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {
  aux: any;
  respuestas: Array<{respuesta: any, id: any, eliminado: any}> = [];
  implementacion: [{barreras: any, componenteId: any, ejecucion: any, facilitadores: any, factores: any,
    financiamiento: any, id: any, referente: any, requerimientos: any, tipoComponente: any}] = [{
      barreras: '', componenteId: '', ejecucion: '', facilitadores: '', factores: '',
      financiamiento: '', id: '', referente: '', requerimientos: '', tipoComponente: ''
    }];
  tipoComponente: any;
  remision: any;
  nombreRias: any;
  nombreEntrada: any;
  idComponente: any;
  estrategia: [{actividad: any, bases: any, bibliografia: any, componenteId: any, eliminado: any,
    evidencia: any, id: any, link: any, palabras: any, tipoComponente: any}] = [{actividad: '', bases: '',
      bibliografia: '', componenteId: '', eliminado: '', evidencia: '', id: '', link: '', palabras: '',
      tipoComponente: ''}];
  componenteAuxModal: {idTemp: any, idEquivalente: any, nombre: any, eliminado: any, responsables: any, responsablesSectoriales: any,
    definicion: any, mecanismoEntrega: any, frecuenciaUso: any, lineaPDSP: any, entorno: any, destinatario: any, tipoIntervencion: any,
    cursoVida: any, recursos: any, estrategia: any, implementacion: any, conectores: any, respuestas: any, idRiasDestino: any,
    idEntradaDestino: any, responsablesIntersectoriales: any, datosExtra: any} = {idTemp: '', idEquivalente: '', nombre: '',
      eliminado: '', responsables: '', responsablesSectoriales: '', definicion: '', mecanismoEntrega: '', frecuenciaUso: '',
      lineaPDSP: '', entorno: '', destinatario: '', tipoIntervencion: '', cursoVida: '', recursos: '', estrategia: this.estrategia,
      implementacion : this.implementacion, conectores: '', respuestas: this.respuestas, idRiasDestino: '', idEntradaDestino: '',
      responsablesIntersectoriales: '', datosExtra: ''};

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>, private ejecucion: EjecucionService,
    @Inject(MAT_DIALOG_DATA) public data: any, private admin: AdminService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
    this.remision = false;
    if (this.data.tipoComponente === 'Remision') {
      this.remision = true;
    }
    this.obtenerComponenteModal(this.data.componenteId, this.data.tipoComponente);

  }

  /*
  Funcion obtener los datos del componente que se mostrara en el modal
  */
  obtenerComponenteModal(idComponente, tipoComponente) {
    this.ejecucion.obtenerComponente(idComponente, tipoComponente)
    .subscribe(
      res => {
        this.aux = res;
        if (this.aux.implementacion.length === 0) {
          this.aux.implementacion = this.implementacion;
        }
        if (this.aux.estrategia.length === 0) {
          this.aux.estrategia = this.estrategia;
        }
        this.componenteAuxModal = this.aux;
        this.componenteAuxModal = this.aux;
        if (this.componenteAuxModal.idRiasDestino !== null) {
          this.admin.obtenerRias(this.componenteAuxModal.idRiasDestino)
          .subscribe(
            res1 => {
              let a: any;
              a  = res1;
              this.nombreRias = a.nombre;
            }
          );
          this.ejecucion.obtenerComponente(this.componenteAuxModal.idEntradaDestino, 'Entrada')
          .subscribe(
            res2 => {
              let a: any;
              a = res2;
              this.nombreEntrada = a.nombre;
            }
          );
        }
      }
    );
}

  /*
  Funcion encargada de redirigir al enlace de fuente de datos en una nueva ventana
  */
 goTo(A): void {
  A = A.replace('http://', '');
  A = A.replace('https://', '');
  A = 'http://' + A;
  window.open(A, '_blank');
  }
}
