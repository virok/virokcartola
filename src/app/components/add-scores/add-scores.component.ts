import { Component, OnInit } from '@angular/core';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { Team } from 'src/app/entities/team';
import { TournamentService } from '../../services/tournament/tournament.service';
import { Tournament } from '../../entities/tournament';
import { TableService } from '../../services/table/table.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal/modal.service';
import { TournamentFactoryService } from '../../services/tournament-factory/tournament-factory.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-scores',
  templateUrl: './add-scores.component.html',
  styleUrls: ['./add-scores.component.css']
})
export class AddScoresComponent implements OnInit {
  teams: any[];
  showPage: boolean = false;
  tournaments: Tournament[];
  _baseTournamentService: TournamentService;

  constructor(private _teamsService: TeamsService
    , private _tournamentFactory: TournamentFactoryService) { }

  ngOnInit() {
    this.teams = new Array<Team>();
    this.tournaments = new Array<Tournament>();
    this.load();
  }

  load() {
    this._teamsService.list().subscribe(result => {
      this.teams = result;
      this.loadTournaments();
    });
  }

  private loadTournaments() {
    this._baseTournamentService = this._tournamentFactory.create(null);
    this._baseTournamentService.list().subscribe((tournamentsResult => {
      this.showPage = this.teams.length > 2 && this.teams.length % 2 == 0 && tournamentsResult.length > 0;
      this.tournaments = tournamentsResult;
    }));
  }

  add(inputs: NgForm, tournaments: Tournament[]) {
    this._baseTournamentService.addScoresToSelectedTournaments(inputs,tournaments);
  }
  // add(inputs: NgForm) {
  //   const data = inputs.value;
  //   let hasTournamentRoundsToPopulate = false;

  //   let tournamentServices = new Array<TournamentService>();
  //   tournamentServices.push(this._tournamentFactory.createByTournamentType(TournamentType.RoundRobin));
  //   tournamentServices.push(this._tournamentFactory.createByTournamentType(TournamentType.Elimination));

  //   //for each tournament
  //   this.tournaments.forEach(tournament => {

  //     let service = tournamentServices.find(x=>x.TournamentType == tournament.tournamentType);
  //     let foundAnEmptyRound = false;

  //     let roundIndex = 0;
  //     tournament.rounds.forEach(round => {

  //       if (!foundAnEmptyRound) {
  //         const isRegularTournament = tournament.tournamentType == TournamentType.RoundRobin || tournament.tournamentType == null;

  //         //find the current round of a tournament(it is first with no games/matches with scores)
  //         const isCurrentRound = isRegularTournament ?
  //           round.games.find(g => g.away_score == null) != null :
  //           round.bracket_rounds.find(b => b.games.find(g => g.away_score == null) != null) != null;

  //         //for each match, get and update the score like: match.home_score = data[match.home.name]
  //         //away_score = data[match.away.name]
  //         if (isCurrentRound) {
  //           service.addScores(round, data, tournament, roundIndex);
  //           // if (isRegularTournament) {
  //           //   this.addScoresToMatches(round.games, data);
  //           // } else {
  //           //   this.addScoresToBracketRounds(round, data, tournament, roundIndex);
  //           // }

  //           foundAnEmptyRound = true;
  //           hasTournamentRoundsToPopulate = true;

  //           //After every team has its score updated for that round
  //           //create a table data / table if not created yet.
  //           if(isRegularTournament){
  //             this._tableService.createOrUpdateTable(tournament, round);
  //           }

  //           //persist match values in FIRE STORE NOSQL
  //           //TODO Check if it is going to update
  //           service.update(tournament, false);

  //           //redict to tournaments page
  //           this._router.navigate(["tournament-list"]);
  //         }
  //       }

  //       roundIndex + roundIndex + 1;
  //     });

  //   });

  //   if (!hasTournamentRoundsToPopulate) {
  //     this._modalService.warning("Todos os Campeonatos já estão preenchidos");
  //     //redict to tournaments page
  //     this._router.navigate(["tournament-list"]);
  //   }
  // }

}


