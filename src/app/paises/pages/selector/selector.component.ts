import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators'

import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: [
  ]
})
export class SelectorComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  // UI
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });

    // Cuando cambie el país
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
      )
      .subscribe(paises => {
        this.fronteras = paises;
        this.cargando = false;
      });

  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
