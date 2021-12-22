import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

import { TokenService } from '../token.service';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<Usuario>({});

  constructor(private tokenService: TokenService) {
    if (this.tokenService.hasToken()) {
      this.decodificarJWT();
    }
  }

  private decodificarJWT() {
    const token = this.tokenService.getToken();
    const usuario = jwtDecode(token) as Usuario;

    this.usuarioSubject.next(usuario);
  }

  getUsuario() {
    return this.usuarioSubject.asObservable();
  }

  salvarToken(token: string) {
    this.tokenService.setToken(token);

    this.decodificarJWT();
  }

  logout() {
    this.tokenService.removeToken();

    this.usuarioSubject.next({});
  }

  estaLogado() {
    return this.tokenService.hasToken();
  }
}
