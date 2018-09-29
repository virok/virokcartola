import { Component, OnInit } from '@angular/core';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { Team } from 'src/app/entities/team';
import { TournamentService } from '../../services/tournament/tournament.service';
import { Tournament } from '../../entities/tournament';
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
}


