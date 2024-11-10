import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { StorageService } from 'src/Services/StorageService';

@Injectable({
  providedIn: 'root',
})
export class UserLoginUseCase {
  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private storageService: StorageService
  ) {}

  async performLogin(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      // Autenticación del usuario en Firebase
      const userCredential = await this.fireAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        const uid = user.uid;

        // Obtener información del usuario desde Firebase Realtime Database
        const userRef = this.db.object(`/users/${uid}`);
        const userDataSnapshot = await userRef.query.once('value');
        const userData = userDataSnapshot.val();

        if (userData) {
          // Manejo de valores vacíos para nombre y foto de perfil
          const displayName = userData.displayName || ''; 
          const photoURL = userData.photoURL || '';

          // Guardar datos del usuario en Ionic Storage
          await this.storageService.set('user', {
            uid: uid,
            email: userData.email || '',
            displayName: displayName,
            photoURL: photoURL
          });

          return { success: true, message: "Login successful" };
        } else {
          return { success: false, message: "User not found in Realtime Database" };
        }
      } else {
        return { success: false, message: "Authentication failed, user not found" };
      }
    } catch (error: any) {
      // Manejo de errores específicos de Firebase
      let errorMessage = 'Error during login';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado. Por favor, intentelo nuevamente';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta. Por favor, inténtalo nuevamente';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        default:
          errorMessage += ': ' + error.message;
          break;
      }

      return { success: false, message: errorMessage };
    }
  }
}
