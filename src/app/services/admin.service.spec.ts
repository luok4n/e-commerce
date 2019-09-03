import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

describe('AdminService', () => {
  let http: HttpClient;
  let service = new AdminService(http);

  beforeEach(() => {TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      CommonModule,
    ],
    providers: [AdminService],
    declarations: [
      ]
    })
    .compileComponents();
  });



  it('Crear RIAS service', () => {
    service.crearRIAS(1).subscribe( success => {
      expect(success).toBe('observable value');
    });
  });

  it('Lista entradas service', () => {
    service.listaEntradasRIAS().subscribe( success => {
      expect(success).toBe('observable value');
    });
  });

  it('Lista RIAS service', () => {
    service.listaRIAS().subscribe( success => {
      expect(success).toBe('observable value');
    });
  });

  it('estado RIAS service', () => {
    service.habilitarRIAS(1).subscribe( success => {
      expect(success).toBe('observable value');
    });
  });

  it('modificar RIAS service', () => {
    service.modificarRIAS(1).subscribe( success => {
      expect(success).toBe('observable value');
    });
  });

  it('obtener RIAS service', () => {
    service.obtenerRias(1).subscribe( success => {
      expect(success).toBe('observable value');
    });
  });

  it('nueva RIAS service', () => {
    service.nuevaVersion(1).subscribe( success => {
      expect(success).toBe('observable value');
    });
  });
});
