import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-campanias',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './campanias.html',
  styleUrl: './campanias.css',
})
export class Campanias {

}
