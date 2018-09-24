import { Injectable } from '@angular/core';
import { Team } from 'src/app/entities/team';
import { Match } from 'src/app/entities/match';
import { IIdentifier } from 'src/app/entities/IIdentifier';
import { BracketRound } from './bracketRound';

@Injectable({
  providedIn: 'root'
})
export class Round extends IIdentifier {
  number: number;
  games: Match[];
  bracket_rounds: BracketRound[]
}


