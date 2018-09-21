import { Component, OnInit } from '@angular/core';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { Team } from 'src/app/entities/team';
import { NgForm } from '@angular/forms';
import { TournamentService } from '../../services/tournament/tournament.service';
import { Tournament } from '../../entities/tournament';
import { TableService } from '../../services/table/table.service';

@Component({
  selector: 'app-add-scores',
  templateUrl: './add-scores.component.html',
  styleUrls: ['./add-scores.component.css']
})
export class AddScoresComponent implements OnInit {
  teams: any[];
  showPage: boolean = false;
  tournaments: Tournament[];

  constructor(private _teamsService: TeamsService, private _tournamentService: TournamentService, private _tableService: TableService) { }

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
    this._tournamentService.list().subscribe((tournamentsResult => {
      this.showPage = this.teams.length > 2 && this.teams.length % 2 == 0 && tournamentsResult.length > 0;
      this.tournaments = tournamentsResult;
    }));
  }

  add(inputs: NgForm) {
    const data = inputs.value;

    //for each tournament
    this.tournaments.forEach(tournament => {

      let foundAnEmptyRound = false;


      tournament.rounds.forEach(round => {

        if (!foundAnEmptyRound) {
          //find the current round of a tournament(it is first with no games/matches with scores)
          const isCurrentRound = round.games.find(g => g.away_score == null) != null;
          //for each match, get and update the score like: match.home_score = data[match.home.name]
          //away_score = data[match.away.name]
          if (isCurrentRound) {

            round.games.forEach(match => {
              match.home_score = data[match.home.name];
              match.away_score = data[match.away.name];
            });

            foundAnEmptyRound = true;

            //After every team has its score updated for that round
            //create a table data / table if not created yet.
            this._tableService.createOrUpdateTable(tournament, round);

            //persist match values in FIRE STORE NOSQL
            //TODO Check if it is going to update
            this._tournamentService.update(tournament);
          }
        }
      })

    });

  }
}
