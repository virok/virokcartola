import { Injectable } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster/src/toaster-config';

@Injectable({
  providedIn: 'root'
})
export class ToasterConfigService {

  constructor() { }

  getToasterConfig() {
    return new ToasterConfig({
      animation: 'fade',
      timeout: 2000,
      positionClass: 'toast-center',
      showCloseButton: false,
    });
  }
}
