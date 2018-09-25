import { Component, OnInit } from '@angular/core';
import { TeamsService } from 'src/app/services/teams/teams.service';
import { Team } from 'src/app/entities/team';
import { NgForm } from '@angular/forms';
import { TournamentService } from '../../services/tournament/tournament.service';
import { Tournament } from '../../entities/tournament';
import { TableService } from '../../services/table/table.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal/modal.service';
import { TournamentType } from 'src/app/entities/TournamentType';
import { Round } from 'src/app/entities/round';
import { Match } from '../../entities/match';

@Component({
  selector: 'app-add-scores',
  templateUrl: './add-scores.component.html',
  styleUrls: ['./add-scores.component.css']
})
export class AddScoresComponent implements OnInit {
  teams: any[];
  showPage: boolean = false;
  tournaments: Tournament[];

  constructor(private _teamsService: TeamsService, private _tournamentService: TournamentService
    , private _tableService: TableService, private _router: Router,
    private _modalService: ModalService) { }

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
    let hasTournamentRoundsToPopulate = false;
    //for each tournament
    this.tournaments.forEach(tournament => {

      let foundAnEmptyRound = false;

      let roundIndex = 0;
      tournament.rounds.forEach(round => {

        if (!foundAnEmptyRound) {
          const isRegularTournament = tournament.tournamentType == TournamentType.RoundRobin || tournament.tournamentType == null;

          //find the current round of a tournament(it is first with no games/matches with scores)
          const isCurrentRound = isRegularTournament ?
            round.games.find(g => g.away_score == null) != null :
            round.bracket_rounds.find(b => b.games.find(g => g.away_score == null) != null) != null;

          //for each match, get and update the score like: match.home_score = data[match.home.name]
          //away_score = data[match.away.name]
          if (isCurrentRound) {

            if (isRegularTournament) {
              this.addScoresToMatches(round.games, data);
            } else {

              if (round.bracket_rounds != null) {


                round.bracket_rounds.forEach(bracketRound => {

                  let match = bracketRound.games.find(x => x.away_score == null);

                  if (match) {
                    this.addScoreToMatch(match, data);
                  }

                  let hasAnyMatchLeft = bracketRound.games.find(x => x.away_score == null || x.home_score == null) != null;

                  if (!hasAnyMatchLeft) {

                    // winner team should move to the next round
                    let winnerTeam = this.getWinnerTeam(match);

                    let nextRound = tournament.rounds[roundIndex + 1];
                    if (nextRound) {
                      //find the same bracketRound number or the closest one
                      let nextbracketRound = nextRound.bracket_rounds.find(x => x.number == bracketRound.number);

                      if (!nextbracketRound) {
                        let bracketNumber = bracketRound.number - 1;

                        while (nextbracketRound == null && bracketNumber >= 0) {
                          nextbracketRound = nextRound.bracket_rounds.find(x => x.number == bracketNumber);
                          if(nextbracketRound){
                            bracketNumber = -1; // exit while
                          }else{
                            bracketNumber = bracketNumber - 1;
                          }
                        }
                      }

                      if (nextbracketRound) {
                        //add teams to the bracket round games
                        nextbracketRound.games.forEach(x => {
                          if (x.home.name == "" || x.home.name == null) {
                            x.home = winnerTeam;
                          } else if (x.away.name == "" || x.away.name == null) {
                            x.away = winnerTeam;
                          }
                        });

                      } else {
                        console.error("Not able to find the next bracket Round");
                      }


                    }
                  }

                });
              }
            }

            foundAnEmptyRound = true;
            hasTournamentRoundsToPopulate = true;

            //After every team has its score updated for that round
            //create a table data / table if not created yet.
            if(isRegularTournament){
              this._tableService.createOrUpdateTable(tournament, round);
            }

            //persist match values in FIRE STORE NOSQL
            //TODO Check if it is going to update
            this._tournamentService.update(tournament, false);

            //redict to tournaments page
            this._router.navigate(["tournament-list"]);
          }
        }

        roundIndex + roundIndex + 1;
      });

    });

    if (!hasTournamentRoundsToPopulate) {
      this._modalService.warning("Todos os Campeonatos já estao preenchidos");
      //redict to tournaments page
      this._router.navigate(["tournament-list"]);
    }
  }

  getWinnerTeam(match: Match): Team {
    return match.home_score > match.away_score ? match.home : match.away;
  }

  private addScoresToMatches(games: Match[], data: any) {
    games.forEach(match => {
      this.addScoreToMatch(match, data);
    });
  }

  private addScoreToMatch(match: Match, data: any) {
    if (match.home_score == null)
      match.home_score = data[match.home.name];
    if (match.away_score == null)
      match.away_score = data[match.away.name];
  }
}


