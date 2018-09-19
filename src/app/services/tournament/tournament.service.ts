import { Injectable } from '@angular/core';
import { RepositoryService } from '../database/repository.service';
import { Tournament } from '../../entities/tournament';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { Team } from 'src/app/entities/team';
import { Match } from 'src/app/entities/match';
import { Round } from 'src/app/entities/round';
import { BaseService } from '../base/base.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  collectionName: string = 'tournaments';

  constructor(protected repository: RepositoryService<Tournament>, private _teamsService: TeamsService) {
    //super(repository);
    //this.repository.initialize('tournaments');
  }

  list(): Observable<any[]> {
    return this.repository.list(this.collectionName);
  }

  get(id: any){
    return this.repository.get(this.collectionName,id);
  }

  add(tournamnet: Tournament) {
    return this.repository.add(this.collectionName,tournamnet);
  }

  public create(tournament: Tournament) {
    if (tournament.name) {
      // check if we have teams
      this._teamsService.list().subscribe(teams=>{
        if (teams && teams.length % 2 === 0) {

          const teamsCount = teams.length;
          const gamesPerRound = teamsCount / 2;
          const isRoundRobin = tournament.isRoundRobin;
          let roundsCount = teamsCount - 1;
          if (isRoundRobin) {
            roundsCount = roundsCount * 2;
          }

          const midListSize = teamsCount / 2;
          let homeTeams  = Object.assign([], teams);
          let awayTeams  = Object.assign([], teams);

          homeTeams.splice(0, midListSize);
          awayTeams.splice(midListSize,midListSize);

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
              } else {
                game.home = awayTeams[j];
                game.away = homeTeams[i];
              }

              //contains
              if (games.some(x => x.away.name == game.away.name && x.home.name == game.home.name)) {
                throw new Error('Game Already exists')
              }

              if(game.away.name === game.home.name){
                throw new Error('same team???? WTH?')
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

          tournament.rounds = rounds
          //it saves on DB
          this.add(tournament);
          return true;

        } else {
          alert('Cadastre times primeiro, e necessario numero par de times');
          return false;
        }
      });
    }

    return false;
  }


  private Rotate(homeTeams: Team[], awayTeams: Team[]) {
    // circle/Rotate method teams
    // LAst item of Home List becomes First Item of AwayLIst
    let lastItemOfHome = homeTeams[homeTeams.length - 1];

    // remove the last
    homeTeams = homeTeams.filter(item => item.name !== lastItemOfHome.name);

    // insert at first position
    awayTeams.splice(0, 0, lastItemOfHome);

    // Last Item of Away List goes to the Second Index of the Home list, because the first one is FIXED
    let lastItemOfAway = awayTeams[awayTeams.length - 1];
    awayTeams = awayTeams.filter(item => item.name !== lastItemOfAway.name);
    homeTeams.splice(1, 0, lastItemOfAway);

    // lastItemOfHome = null;
    // lastItemOfAway = null;
  }

}
