import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HappysadComponent } from './components/happysad/happysad.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ShopComponent } from './components/shop/shop.component';
import { LogoutComponent } from './components/logout/logout.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'observance', component: HappysadComponent, canActivate:[AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path: 'shop', component: ShopComponent},
  {path: 'logout', component: LogoutComponent},
  {path: '**', component: PageNotFoundComponent}

];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
