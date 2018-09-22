import { Injectable } from "@angular/core";
import { RepositoryService } from "../database/repository.service";
import { Table, TableData } from "../../entities/table";
import { BaseService } from "src/app/services/base/base.service";
import { Round } from "src/app/entities/round";
import { Tournament } from "../../entities/tournament";
import { Match } from "src/app/entities/match";
import { Team } from "src/app/entities/team";
import { SortService } from "src/app/services/sort/sort.service";

@Injectable({
  providedIn: "root"
})
export class TableService extends BaseService<Table> {
  collectionName: string = "tables";
  //tables: Table[];

  constructor(protected repository: RepositoryService<Table>, private _sortService: SortService) {
    super(repository);

    // this.repository.list(this.collectionName).subscribe((tables) =>{
    //   this.tables = tables;
    // });
  }

  //**
  /* After every team has its score updated for that round
  / * create a table data / table if not created yet.
  / */
  createOrUpdateTable(tournament: Tournament, round: Round) {
    if (!tournament.table) {
      tournament.table = new Table();
    }
    //try to find table data for the team, if does not exists , create one
    if (!tournament.table.rows) {
      tournament.table.rows = new Array<TableData>();
    }

    round.games.forEach(match => {

      //add/update team,points,wins,loses,draw
      // order table data by points

      let homeTeamTableData = this.getOrCreateTableData(
        tournament,
        match.home
      );
      let awayTeamTableData = this.getOrCreateTableData(
        tournament,
        match.away
      );

      if (match.home_score > match.away_score) {
        this.setPoinsWinAndLosses(homeTeamTableData, awayTeamTableData);
      } else if (match.away_score > match.home_score) {
        this.setPoinsWinAndLosses(awayTeamTableData, homeTeamTableData);
      } else {
        this.setDrawPoints(homeTeamTableData, awayTeamTableData);
      }

      homeTeamTableData.inputPoints = homeTeamTableData.inputPoints + (match.home_score - match.away_score);
      awayTeamTableData.inputPoints = awayTeamTableData.inputPoints + (match.away_score - match.home_score);

    });

    this.setTablePositions(tournament);

  }

  private setDrawPoints(homeTeamTableData: TableData, awayTeamTableData: TableData) {
    homeTeamTableData.points = homeTeamTableData.points + 1;
    homeTeamTableData.draw = homeTeamTableData.draw + 1;
    awayTeamTableData.points = awayTeamTableData.points + 1;
    awayTeamTableData.draw = awayTeamTableData.draw + 1;
  }

  private setPoinsWinAndLosses(winnerTableData: TableData, loserTableData: TableData) {
    winnerTableData.points = winnerTableData.points + 3;
    winnerTableData.wins = winnerTableData.wins + 1;
    loserTableData.loses = loserTableData.loses + 1;
  }

  private setTablePositions(tournament: Tournament) {
    let tournamentTableData = tournament.table.rows.sort(this._sortService.compareValues('points', 'desc'));
    tournamentTableData = tournamentTableData.sort(this._sortService.compareValues('inputPoints', 'desc'));

    for (let index = 0; index < tournamentTableData.length; index++) {
      let tabledata = tournamentTableData[index];
      tabledata.position = index + 1;
    }
  }

  private getOrCreateTableData(tournament: Tournament, team: Team): TableData {
    let tableDataForTeam = tournament.table.rows.find(
      x => x.team.name == team.name
    );
    if (!tableDataForTeam) {
      tableDataForTeam = new TableData();
      tableDataForTeam.wins = 0;
      tableDataForTeam.position = 0;
      tableDataForTeam.loses = 0;
      tableDataForTeam.inputPoints = 0;
      tableDataForTeam.draw = 0;
      tableDataForTeam.team = team;
      tableDataForTeam.points = 0;

      tournament.table.rows.push(tableDataForTeam);
    }

    return tableDataForTeam;
  }
}
