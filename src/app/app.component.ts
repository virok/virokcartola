import { Component } from '@angular/core';
import { ToasterConfigService } from './services/toaster-config/toaster-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VirokCartola';
  constructor(public _toasterConfigService: ToasterConfigService){

  }
}
