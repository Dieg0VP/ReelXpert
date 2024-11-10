import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializar el almacenamiento de Ionic
  async init() {
    await this.storage.create();
  }

  // Método para almacenar datos
  async set(key: string, value: any): Promise<void> {
    await this.storage.set(key, value);
  }

  // Método para obtener datos
  async get(key: string): Promise<any> {
    return await this.storage.get(key);
  }

  // Método para eliminar datos
  async remove(key: string): Promise<void> {
    await this.storage.remove(key);
  }
}
