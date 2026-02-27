import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-success-step',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ButtonModule
  ],
  templateUrl: './success.html',
  styleUrl: './success.css'
})
export class SuccessStep {
  private router = inject(Router);

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
