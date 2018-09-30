import { Injectable } from '@angular/core';
import { Tournament } from '../../entities/tournament';
import { TournamentService } from '../tournament/tournament.service';
import { TournamentType } from '../../entities/TournamentType';
import { Injector } from '@angular/core'
import { RegularTournamentService } from '../regular-tournament/regular-tournament.service';
import { EliminationTournamentService } from '../elimination-tournament/elimination-tournament.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentFactoryService {

  constructor(private injector: Injector) { }

  createByTournamentType(type: TournamentType): TournamentService{
    switch (type) {
      case TournamentType.RoundRobin:
        return this.injector.get(RegularTournamentService);
        case TournamentType.Elimination:
        return this.injector.get(EliminationTournamentService);
      default:
        return this.injector.get(RegularTournamentService);
    }
  }

  create(tournament: Tournament) : TournamentService {

    return this.createByTournamentType(tournament.tournamentType);
  }
}
