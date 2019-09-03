  import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  crearCategoria(categoria) {
    const head = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`http://localhost:8080/rias-configuracion/api/v1/crearCategoria/`, JSON.stringify(categoria), {headers: head});
  }

  listaCategorias() {
    return this.http.get(`http://localhost:8080/rias-configuracion/api/v1/listarCategorias`);
  }

  crearRIAS(RIAS) {
    const head = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`http://localhost:8080/rias-configuracion/api/v1/crearRias/`, JSON.stringify(RIAS), {headers: head});
  }

  listaEntradasRIAS() {
    return this.http.get(`http://localhost:8080/rias-configuracion/api/v1/listarEntradasRias`);
  }

  listaRIAS() {
    return this.http.get(`http://localhost:8080/rias-configuracion/api/v1/listarRias`);
  }

  habilitarRIAS(id) {
    const head = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`http://localhost:8080/rias-configuracion/api/v1/cambiarEstadoRias/` + id , {headers: head});
  }

  modificarRIAS(RIAS) {
    const head = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`http://localhost:8080/rias-configuracion/api/v1/modificarRias`, JSON.stringify(RIAS), {headers: head});
  }

  obtenerRias(id) {
    return this.http.get(`http://localhost:8080/rias-configuracion/api/v1/consultarRias/` + id);
  }

  nuevaVersion(RIAS) {
    const head = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`http://localhost:8080/rias-configuracion/api/v1/crearNuevaVersionRias`, JSON.stringify(RIAS), {headers: head});
  }
}
