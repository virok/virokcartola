import { Component, OnInit, Input } from "@angular/core";
import { Tournament } from "../../entities/tournament";
import { Round } from "../../entities/round";

@Component({
  selector: "app-bracket",
  templateUrl: "./bracket.component.html",
  styleUrls: ["./bracket.component.css"]
})
export class BracketComponent implements OnInit {
  @Input() tournament: Tournament;
  totalRounds: number;

  constructor() { }

  ngOnInit() {
  }

  getIsWinner(homeScore, awayScore) {
    return homeScore > awayScore;
  }

  getIsLoser(homeScore, awayScore) {
    return !this.getIsWinner(homeScore, awayScore);
  }

  getRoundName(round: Round) {

    const roundDifference = this.tournament.rounds.length - round.number;
    switch (roundDifference) {
      case 0:
        return "Final";
      case 1:
        return "Semi-Final";
      case 2:
        return "Quartas de Final";
      case 3:
        return "Oitavas";
      case 4:
        return "Rodada dos 16";
      default:
        return `Rodada ${round.number}`
    }
  }
}
