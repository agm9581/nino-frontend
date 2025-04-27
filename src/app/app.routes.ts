import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from '../app/auth.guard'; // If you are using authentication guards

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirects to login page by default
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'register', component: RegisterComponent }, // Register route
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [],
  }, // Chat route (protected by auth guard)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
