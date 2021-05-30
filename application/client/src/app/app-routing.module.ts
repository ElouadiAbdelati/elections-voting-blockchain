import { AddCandidatComponent } from './components/add-candidat/add-candidat.component';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { VoteComponent } from './components/vote/vote.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-candidat', component: AddCandidatComponent },
   {path:'vote',component:VoteComponent},
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
