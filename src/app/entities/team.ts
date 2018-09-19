import { Injectable } from '@angular/core';
import { IIdentifier } from 'src/app/entities/IIdentifier';

@Injectable({
  providedIn: 'root'
})
export class Team extends IIdentifier {
  name: string;
}
