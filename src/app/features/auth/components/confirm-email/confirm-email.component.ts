import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent implements OnInit {
  message = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!userId || !token) {
      this.message = 'Parámetros inválidos.';
      this.loading = false;
      return;
    }

    this.http
      .get(`https://localhost:44308/api/Auth/confirm-email?userId=${userId}&token=${token}`)
      .subscribe({
        next: () => {
          this.message = 'Tu correo fue confirmado correctamente. Ya puedes iniciar sesión.';
          this.loading = false;
        },
        error: () => {
          this.message = 'Hubo un problema al confirmar tu correo.';
          this.loading = false;
        }
      });
  }
}
