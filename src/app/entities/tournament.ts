import { Injectable } from '@angular/core';
import { Table } from 'src/app/entities/table';
import { Round } from 'src/app/entities/round';
import { IIdentifier } from 'src/app/entities/IIdentifier';

@Injectable({
  providedIn: 'root'
})
export class Tournament extends IIdentifier {
  name: string;
  isRoundRobin: boolean;
  table: Table;
  rounds: Round[];
  tournamentType: TournamentType
}

export enum TournamentType {
  RoundRobin = "Round Robin", //Brasileiro
  SingleElimination = "Single Elimination",
  DoubleElimination = "Double Elimination", //Copa do Brasil
  Custom = "Custom",
}
