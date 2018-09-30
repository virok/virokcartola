import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Tournament } from '../../entities/tournament';
import { TournamentService } from '../tournament/tournament.service';
import { TournamentType } from '../../entities/TournamentType';
import { TableService } from '../table/table.service';
import { Router } from '@angular/router';
import { TeamsService } from '../teams/teams.service';
import { TournamentFactoryService } from '../tournament-factory/tournament-factory.service';
import { ToasterService } from 'angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class AddScoreService {
  services: TournamentService[];
  currentService: TournamentService;

  constructor(
    protected _router: Router ,
    protected _teamsService: TeamsService,
    protected _tableService: TableService,
    protected _factoryService: TournamentFactoryService,
    private _toaster: ToasterService
    ) {

      this.services = new Array<TournamentService>();
      this.services.push(this._factoryService.createByTournamentType(TournamentType.Elimination));
      this.services.push(this._factoryService.createByTournamentType(TournamentType.RoundRobin));
    }

  listTournaments(){
    return this.services[0].list();
  }

  addScoresToSelectedTournaments(inputs: NgForm, tournaments: Tournament[]) {

    const data = inputs.value;
    let hasTournamentRoundsToPopulate = false;

    //for each tournament
    tournaments.forEach(tournament => {

      this.currentService = this.services.find(x=>x.TournamentType == tournament.tournamentType);

      let foundAnEmptyRound = false;

      let roundIndex = 0;
      tournament.rounds.forEach(round => {

        if (!foundAnEmptyRound) {
          const isRegularTournament = tournament.tournamentType == TournamentType.RoundRobin || tournament.tournamentType == null;

          //find the current round of a tournament(it is first with no games/matches with scores)
          const isCurrentRound = this.currentService.isCurrentRound(round);
          //for each match, get and update the score like: match.home_score = data[match.home.name]
          //away_score = data[match.away.name]
          if (isCurrentRound) {
            this.currentService.addScores(round, data, tournament, roundIndex);

            foundAnEmptyRound = true;
            hasTournamentRoundsToPopulate = true;

            //After every team has its score updated for that round
            //create a table data / table if not created yet.
            if(isRegularTournament){
              this._tableService.createOrUpdateTable(tournament, round);
            }

            //persist match values in FIRE STORE NOSQL
            //TODO Check if it is going to update
            this.currentService.update(tournament, false);
          }
        }

        roundIndex = roundIndex + 1;
      });

    });

    if (!hasTournamentRoundsToPopulate) {
      this._toaster.pop("warning","","Todos os Campeonatos já estão preenchidos");
      //redict to tournaments page
      this._router.navigate(["tournament-list"]);
    }else{
      this._toaster.pop("success","","Pontuação incluída com sucesso");
      //redict to tournaments page
      this._router.navigate(["tournament-list"]);
    }
  }
}
