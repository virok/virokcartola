import { Injectable } from '@angular/core';
import { RepositoryService } from './repository.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Tournament } from '../../entities/tournament';
import { Team } from '../../entities/team';
import { TournamentType } from '../../entities/TournamentType';
import { Match } from '../../entities/match';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TournamentRepositoryService
extends RepositoryService<Tournament> {
  constructor(protected db: AngularFirestore) {
    super(db);
  }

  updateTeamInTournaments(collectionName, team: Team) {
    let tournaments: Tournament[];
    this.list(collectionName)
      .pipe(
        mergeMap((response: Tournament[]) => {
          tournaments = response
          return this.updateTournaments(tournaments, team, collectionName);
        }, (error: any) => {
          console.log(error);
          return false;
        }
        )
      ).subscribe();
  }

  private updateTournaments(tournaments: Tournament[], team: Team, collectionName: any)
  :Promise<boolean> {

    if (tournaments) {
      tournaments.forEach(tournament => {
        //const tournamentId = tournament.id;
        tournament.rounds.forEach(round => {
          if (tournament.tournamentType == TournamentType.Elimination) {
            round.bracket_rounds.forEach(bracketRound => {
              bracketRound.games.forEach(game => {
                this.updateTeamInAMatch(game, team);
              });
            });
          }
          else {
            round.games.forEach(game => {
              this.updateTeamInAMatch(game, team);
            });
            if (tournament.table) {
              tournament.table.rows.forEach(tableRow => {
                if (tableRow.team.id == team.id) {
                  tableRow.team = team;
                }
              });
            }
          }
        });
        return this.update(collectionName, tournament);
      });
    } else {
      return new Promise(() => false);
    }
  }

  private updateTeamInAMatch(game: Match, team: Team) {
    if (game.home && game.home.id == team.id) {
      game.home = team;
    } else if (game.away && game.away.id == team.id) {
      game.away = team;
    }
  }
}
