import { Injectable } from '@angular/core';
import { RepositoryService } from '../database/repository.service';
import { Tournament } from '../../entities/tournament';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { Team } from 'src/app/entities/team';
import { Match } from 'src/app/entities/match';
import { Round } from 'src/app/entities/round';
import { Observable } from 'rxjs/internal/Observable';
import { ModalService } from '../modal/modal.service';
import { Router } from '@angular/router';
import { EliminationTournamentService } from 'src/app/services/elimination-tournament/elimination-tournament.service';
import { TournamentType } from '../../entities/TournamentType';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  collectionName: string = 'tournaments';
  teams: Team[];

  constructor(protected repository: RepositoryService<Tournament>, private _router: Router
    , private _teamsService: TeamsService, private _modalService: ModalService,
    private _eliminationTournamentService: EliminationTournamentService) {
    //super(repository);
    //this.repository.initialize('tournaments');

    this._teamsService.list().subscribe(teams => this.teams = teams);
  }

  list(): Observable<any[]> {
    return this.repository.list(this.collectionName);
  }

  get(id: any) {
    return this.repository.get(this.collectionName, id);
  }

  add(tournament: Tournament) {
    return this.repository.add(this.collectionName, tournament)
      .then(() => {
        this._modalService.success("Campeonato criado com sucesso");
      }, () => {
        this._modalService.error("Erro ao criar Campeonato");
      });
  }

  update(tournament: Tournament, showSucessMessage: boolean = false) {
    return this.repository.update(this.collectionName, tournament).then(() => {
      if (showSucessMessage) {
        this._modalService.success("Campeonato atualizado com sucesso");
      }
    }, () => {
      this._modalService.error("Erro ao Atualizar Campeonato");
    });
  }

  createTournament(tournament: Tournament) {
    if (tournament.tournamentType == TournamentType.RoundRobin) {
      this.createRegularTournament(tournament);
    } else if (tournament.tournamentType == TournamentType.Elimination) {
      const hasCreated = this._eliminationTournamentService.createEliminationTournament(tournament, this.teams);
      if (hasCreated) {
        //it saves on DB
        this.add(tournament).then(() => {
          this._router.navigate(['tournament-list']);
        });
      }else{
        this._modalService.error("Erro ao criar Campeonato");
      }
    } else {
      console.error("Invalid tournament type");
    }
  }

  private createRegularTournament(tournament: Tournament) {
    if (tournament.name) {
      const isOdd = this.teams && this.teams.length % 2 === 0;
      // check if we have teams
      if (isOdd) {
        const teamsCount = this.teams.length;
        const gamesPerRound = teamsCount / 2;
        const isRoundRobin = tournament.isRoundRobin;
        let roundsCount = teamsCount - 1;
        if (isRoundRobin) {
          roundsCount = roundsCount * 2;
        }
        const midListSize = teamsCount / 2;
        let homeTeams = Object.assign([], this.teams) as Team[];
        let awayTeams = Object.assign([], this.teams) as Team[];
        homeTeams.splice(0, midListSize);
        awayTeams.splice(midListSize, midListSize);
        const rounds = new Array<Round>();
        let isSecondTurnAlready = false;
        for (let roundIndex = 0; roundIndex < roundsCount; roundIndex++) {
          console.log(`Round ${roundIndex + 1}:`);
          const games = new Array<Match>();
          for (let i = 0; i < gamesPerRound; i++) {
            const invertHomeAwayGameForFixedTeam = i === 0 && roundIndex % 2 === 0;
            const j = (gamesPerRound - 1) - i;
            const game: Match = new Match();
            if (!invertHomeAwayGameForFixedTeam && i === 0 || !isSecondTurnAlready && i > 0) {
              game.home = homeTeams[i];
              game.away = awayTeams[j];
            }
            else {
              game.home = awayTeams[j];
              game.away = homeTeams[i];
            }
            //contains
            if (games.some(x => x.away.name == game.away.name && x.home.name == game.home.name)) {
              throw new Error('Game Already exists');
            }
            if (game.away.name === game.home.name) {
              throw new Error('same team???? WTH?');
            }
            //add at first position
            games.push(game);
            console.log(`Game ${i + 1}: ${game.home.name} X ${game.away.name}`);
          }
          const round = new Round();
          round.number = roundIndex + 1;
          round.games = games;
          rounds.push(round);
          console.log("-----------------------------------------------------------------------------------------");
          if (isRoundRobin && roundIndex + 1 === roundsCount / 2) {
            console.log('New Turn...');
            isSecondTurnAlready = true;
          }
          let lastItemOfHome = homeTeams[homeTeams.length - 1];
          // remove the last
          homeTeams = homeTeams.filter(item => item.name !== lastItemOfHome.name);
          // insert at first position
          awayTeams.splice(0, 0, lastItemOfHome);
          // Last Item of Away List goes to the Second Index of the Home list, because the first one is FIXED
          let lastItemOfAway = awayTeams[awayTeams.length - 1];
          awayTeams = awayTeams.filter(item => item.name !== lastItemOfAway.name);
          homeTeams.splice(1, 0, lastItemOfAway);
          //this.Rotate(homeTeams, awayTeams);
        }
        tournament.rounds = rounds;
        //it saves on DB
        this.add(tournament).then(() => {
          this._router.navigate(['tournament-list']);
        });
      }
      else {
        this._modalService.warning('Cadastre times primeiro, e necessário numero par de times');
      }
    }
  }
}
