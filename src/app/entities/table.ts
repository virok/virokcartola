import { Injectable } from '@angular/core';
import { Team } from 'src/app/entities/team';
import { IIdentifier } from './IIdentifier';

@Injectable({
  providedIn: 'root'
})
export class Table extends IIdentifier {
  rows: TableData[];
}

export class TableData extends IIdentifier {
  team: Team;
  position: number;
  points: number;
  wins: number;
  loses: number;
  draw: number;
  inputPoints: number;
}
