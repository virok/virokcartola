import { Injectable } from '@angular/core';
import { Table } from 'src/app/entities/table';
import { Round } from 'src/app/entities/round';
import { IIdentifier } from 'src/app/entities/IIdentifier';
import { TournamentType } from 'src/app/entities/TournamentType';
import { Team } from './team';

@Injectable({
  providedIn: 'root'
})
export class Tournament extends IIdentifier {
  name: string;
  isRoundRobin: boolean;
  table: Table;
  rounds: Round[];
  tournamentType: TournamentType
  winner: Team
}


