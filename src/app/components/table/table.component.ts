import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTab, MatTabGroup, MatTabLabel, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TournamentService } from 'src/app/services/tournament/tournament.service';
import { Params, ActivatedRoute } from '@angular/router';
import { TableData, Table } from '../../entities/table';
import { Team } from 'src/app/entities/team';
import { Tournament } from '../../entities/tournament';

// //Remove this stuff when we have data
// const fakeTable1 = new TableData();
// fakeTable1.id = 1;
// fakeTable1.draw = 0;
// fakeTable1.points = 9;
// fakeTable1.position = 1;
// fakeTable1.team = new Team();
// fakeTable1.team.name = "Flamengo";
// fakeTable1.wins = 3;
// fakeTable1.loses = 0;
// //Remove this stuff when we have data
// const fakeTable2 = new TableData();
// fakeTable2.id = 2;
// fakeTable2.draw = 0;
// fakeTable2.points = 0;
// fakeTable2.position = 2;
// fakeTable2.team = new Team();
// fakeTable2.team.name = "Vasco";
// fakeTable2.wins = 0;
// fakeTable2.loses = 3;
// //Remove this stuff when we have data
// const fakeTable = new Table();
// fakeTable.rows = new Array<TableData>();
// fakeTable.rows.push(fakeTable1);
// fakeTable.rows.push(fakeTable2);

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'team', 'wins', 'draw', 'loses', 'points','inputPoints'];
  dataSource: MatTableDataSource<TableData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() tournament: any;
  @Input() tournamentId: any;
  constructor(private tournamnetService: TournamentService) {
  }

  ngOnInit() {

    this.load();


  }

  load(){
    if(this.tournament || this.tournamentId){

      if(!this.tournament){
        this.tournamnetService.get(this.tournamentId).subscribe(result => {
          this.tournament = result;

          this.loadDataSource();
          //console.log(this.tournament)
        });
      }else{
        this.loadDataSource();
      }


    }
  }


  private loadDataSource() {
    if(this.tournament && this.tournament.table && this.tournament.table.rows){
      this.dataSource = new MatTableDataSource(this.tournament.table.rows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
