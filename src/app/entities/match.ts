import { Injectable } from '@angular/core';
import { Team } from 'src/app/entities/team';
import { IIdentifier } from 'src/app/entities/IIdentifier';

@Injectable({
  providedIn: 'root'
})
export class Match extends IIdentifier {
  home: Team;
  away: Team;
  home_score: number;
  away_score: number;
}
