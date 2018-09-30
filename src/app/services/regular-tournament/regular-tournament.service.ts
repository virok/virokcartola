import { Injectable } from '@angular/core';
import { TournamentService } from '../tournament/tournament.service';
import { Tournament } from '../../entities/tournament';
import { Team } from '../../entities/team';
import { Round } from '../../entities/round';
import { Match } from '../../entities/match';
import { RepositoryService } from '../database/repository.service';
import { Router } from '@angular/router';
import { TeamsService } from '../teams/teams.service';
import { ModalService } from '../modal/modal.service';
import { TournamentType } from '../../entities/TournamentType';
import { TableService } from '../table/table.service';
import { TournamentFactoryService } from '../tournament-factory/tournament-factory.service';

@Injectable({
  providedIn: 'root'
})
export class RegularTournamentService extends TournamentService {

  constructor(protected repository: RepositoryService<Tournament>,
    protected _router: Router,
    protected _teamsService: TeamsService,
    protected _modalService: ModalService,
    protected _tableService: TableService) {

    super(repository, _router,_teamsService, _modalService, _tableService);
    this.TournamentType = TournamentType.RoundRobin;

  }

  public isCurrentRound(round: Round) {
    return  round.games.find(g => g.away_score == null) != null;
  }

  public createTournament(tournament: Tournament, teams: Team[]) {
    if (tournament.name) {
      const isOdd = teams && teams.length % 2 === 0;
      // check if we have teams
      if (isOdd) {
        const teamsCount = teams.length;
        const gamesPerRound = teamsCount / 2;
        const isRoundRobin = tournament.isRoundRobin;
        let roundsCount = teamsCount - 1;
        if (isRoundRobin) {
          roundsCount = roundsCount * 2;
        }
        const midListSize = teamsCount / 2;
        let homeTeams = Object.assign([], teams) as Team[];
        let awayTeams = Object.assign([], teams) as Team[];
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

  public addScores(round: Round, data: any, tournament: Tournament, roundIndex: number) {
    this.addScoresToMatches(round.games, data);
  }

}
