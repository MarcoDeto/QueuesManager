import { NgModule } from "@angular/core";

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialElevationDirective } from "./Directives/mat-elevation.directive";
import { NotFoundComponent } from "./Components/not-found/not-found.component";
import { ForbiddenComponent } from './Components/Forbidden/forbidden.component';
import { ErrorComponent } from "./Components/error/error.component";
import { MaterialModule } from "../material.module";
import { NgxMaskModule, IConfig } from 'ngx-mask';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [
    NotFoundComponent,
    ForbiddenComponent,
    ErrorComponent,
    MaterialElevationDirective,
  ],
  imports: [
    MaterialModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    NgxMaskModule.forRoot(maskConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    ErrorComponent,
    ForbiddenComponent,
    NotFoundComponent,
    MaterialModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialElevationDirective,
    NgxMatSelectSearchModule, 
    NgxMaskModule,
    TranslateModule
  ]
})
export class SharedModule { }