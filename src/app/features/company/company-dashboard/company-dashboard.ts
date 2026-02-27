import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './company-dashboard.html',
  styleUrl: './company-dashboard.css',
})
export class CompanyDashboard implements OnInit {
  private messageService = inject(MessageService);
  companyName = 'Invitado';

  ngOnInit() {
    // Obtenemos el nombre de la empresa guardado en localStorage
    const savedName = localStorage.getItem('company_name');
    if (savedName) {
      this.companyName = savedName;
    }

    // Mostramos mensaje de bienvenida
    setTimeout(() => {
      this.messageService.add({ 
        severity: 'info', 
        summary: `¡Bienvenido ${this.companyName}!`, 
        detail: 'Has iniciado sesión correctamente.',
        life: 5000
      });
    }, 500);
  }
}
