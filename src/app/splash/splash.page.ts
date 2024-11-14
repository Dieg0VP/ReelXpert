import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Redirigir después de 2 segundos
    setTimeout(() => {
      this.router.navigate(['/login']); // Cambia '/login' por la página de destino
    }, 2000);
  }
}
