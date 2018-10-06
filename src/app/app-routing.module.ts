import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeamsComponent } from './components/teams/teams.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { TournamentListComponent } from 'src/app/components/tournament-list/tournament-list.component';
import { TournamentDetailsComponent } from './components/tournament-details/tournament-details.component';
import { AddScoresComponent } from 'src/app/components/add-scores/add-scores.component';
import { BracketComponent } from './components/bracket/bracket.component';

const routes: Routes = [
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/:id', component: TeamsComponent },
  { path: 'tournaments', component: TournamentComponent },
  { path: 'tournaments/:id', component: TournamentComponent },
  { path: 'add-scores', component: AddScoresComponent },
  { path: 'tournament-list', component: TournamentListComponent },
  { path: 'tournament-details/:id', component: TournamentDetailsComponent },
  { path: 'bracket', component: BracketComponent }, //remove this later
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
