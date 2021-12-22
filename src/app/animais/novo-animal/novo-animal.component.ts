import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AnimaisService } from '../animais.service';

@Component({
  selector: 'app-novo-animal',
  templateUrl: './novo-animal.component.html',
  styleUrls: ['./novo-animal.component.css'],
})
export class NovoAnimalComponent implements OnInit {
  animalForm!: FormGroup;
  arquivo!: File;
  preview!: string;
  percentualUpload!: number;

  constructor(
    private animaisService: AnimaisService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  get file(): FormControl {
    return this.animalForm.get('file') as FormControl;
  }

  get description(): FormControl {
    return this.animalForm.get('description') as FormControl;
  }

  get allowComments(): FormControl {
    return this.animalForm.get('allowComments') as FormControl;
  }

  ngOnInit(): void {
    this.animalForm = this.formBuilder.group({
      file: ['', Validators.required],
      description: ['', Validators.maxLength(300)],
      allowComments: [true],
    });
  }

  upload() {
    const allowComments = this.allowComments?.value ?? false;
    const description = this.description?.value ?? '';

    this.animaisService
      .upload(description, allowComments, this.arquivo)
      .pipe(finalize(() => this.router.navigate(['animais'])))
      .subscribe(
        (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const total = event.total ?? 1;
            this.percentualUpload = Math.round(100 * (event.loaded / total));
          }
        },
        (error) => console.error(error)
      );
  }

  gravarArquivo(arquivo: any): void {
    const [file] = arquivo?.files;
    this.arquivo = file;

    const reader = new FileReader();
    reader.onload = (event: any) => (this.preview = event.target.result);
    reader.readAsDataURL(file);
  }
}
