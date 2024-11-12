import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationUseCase {

  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}

  async performRegistration(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      // Registra al usuario en Firebase Authentication
      const userCredential = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Obtén UID y otros datos si existen
        const uid = user.uid;
        const userData = {
          uid: uid,
          email: email,
          displayName: user.displayName || '', // Si no hay nombre, usa cadena vacía
          photoURL: user.photoURL || '' // Si no hay foto, usa cadena vacía
        };

        // Guarda la información en Firebase Realtime Database
        await this.db.object(`/users/${uid}`).set(userData);
      }

      // Devuelve un resultado exitoso
      return { success: true, message: 'Registro exitoso. Bienvenido a nuestro sistema.' };

    } catch (error: any) {
      // Maneja errores de Firebase Authentication
      let errorMessage = 'Error al registrar usuario.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo ya está en uso. Por favor, intenta con otro.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico no es válido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil. Asegúrate de usar al menos 6 caracteres.';
          break;
        default:
          errorMessage += ' Detalles: ' + error.message;
          break;
      }

      // Devuelve un resultado con el mensaje de error
      return { success: false, message: errorMessage };
    }
  }
}
