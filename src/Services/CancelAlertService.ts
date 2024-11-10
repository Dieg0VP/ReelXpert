import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root', 
})

export class CancelAlertService {

  constructor(private alertController: AlertController) {}

  async showAlert(header: string, message: string, onConfirm: () => void, onCancel?: () => void) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            onCancel?.(); // Llamada opcional a onCancel
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            onConfirm(); // Llamada obligatoria a onConfirm
          }
        }
      ]
    });

    await alert.present(); 
  }
}
