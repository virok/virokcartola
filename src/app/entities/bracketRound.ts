import { Match } from 'src/app/entities/match';
import { IIdentifier } from 'src/app/entities/IIdentifier';
export class BracketRound extends IIdentifier {
  number: number;
  games: Match[];
}
