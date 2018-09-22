import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeamsComponent } from './components/teams/teams.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { TournamentListComponent } from 'src/app/components/tournament-list/tournament-list.component';
import { TournamentDetailsComponent } from './components/tournament-details/tournament-details.component';
import { AddScoresComponent } from 'src/app/components/add-scores/add-scores.component';

const routes: Routes = [
  { path: 'teams', component: TeamsComponent },
  { path: 'tournaments', component: TournamentComponent },
  { path: 'add-scores', component: AddScoresComponent },
  { path: 'tournament-list', component: TournamentListComponent },
  { path: 'tournament-details/:id', component: TournamentDetailsComponent },
  {
    path: '**',
    redirectTo: 'tournament-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
