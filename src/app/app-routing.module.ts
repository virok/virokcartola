import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeamsComponent } from './components/teams/teams.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { TournamentListComponent } from 'src/app/components/tournament-list/tournament-list.component';
import { TournamentDetailsComponent } from './components/tournament-details/tournament-details.component';

const routes: Routes = [
  { path: 'teams', component: TeamsComponent },
  { path: 'tournaments', component: TournamentComponent },
  { path: 'tournament-list', component: TournamentListComponent },
  { path: 'tournament-details/:id', component: TournamentDetailsComponent },
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
