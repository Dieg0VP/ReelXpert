import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CancelAlertService } from 'src/Services/CancelAlertService'; 
import { UserRegistrationUseCase } from 'src/app/Use-Case/user-registration.use-case';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private userRegistrationUseCase: UserRegistrationUseCase,
    private router: Router,
    private alert: CancelAlertService // Inyecta el servicio de alertas
  ) {}

  ngOnInit() {}

  async onRegisterButtonPressed() {
    const result = await this.userRegistrationUseCase.performRegistration(this.email, this.password);

    if (result.success) {
      this.alert.showAlert(
        'Registro exitoso',
        'Ya eres parte de nuestro sistema.',
        () => {
          this.router.navigate(['/splash']); // Navega a la página de inicio
        }
      );
    } else {
      this.alert.showAlert(
        'Error',
        result.message,
        () => {
          this.clean(); // Limpia los inputs si ocurre un error
        }
      );
    }
  }

  clean() {
    this.email = '';
    this.password = '';
  }
}
