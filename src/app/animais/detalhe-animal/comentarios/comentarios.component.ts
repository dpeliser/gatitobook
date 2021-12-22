import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Comentarios } from './comentarios';
import { ComentariosService } from './comentarios.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css'],
})
export class ComentariosComponent implements OnInit {
  @Input()
  id!: number;
  comentarios$!: Observable<Comentarios>;
  comentarioForm!: FormGroup;

  constructor(
    private comentariosService: ComentariosService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.comentarios$ = this.comentariosService.buscarComentarios(this.id);

    this.comentarioForm = this.formBuilder.group({
      comentario: ['', Validators.maxLength(300)],
    });
  }

  get comentario(): FormControl {
    return this.comentarioForm.get('comentario') as FormControl;
  }

  gravar(): void {
    const comentario = this.comentario?.value ?? '';
    this.comentarios$ = this.comentariosService
      .incluirComentario(this.id, comentario)
      .pipe(
        switchMap(() => this.comentariosService.buscarComentarios(this.id)),
        tap(() => this.comentarioForm.reset())
      );
  }
}
