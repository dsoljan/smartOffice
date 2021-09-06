import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  formData = [false, false, false, false, '', false, ''];

  turnOnAt: string;
  turnOffAt: string;

  dateNow: Date;
  hourNow: string;

  required1: boolean;

  constructor(
    private modalController: ModalController,
    private params: NavParams
  ) {
    // localStorage.clear();
    this.dateNow = new Date();
    this.hourNow =
      this.dateNow.getHours().toString() +
      ':' +
      (this.dateNow.getMinutes() < 10 ? '0' : '') +
      this.dateNow.getMinutes().toString();

    this.required1 = this.formData[3] === 'true';

    // ensure string to boolean
    this.formData[1] = localStorage.getItem('turnOnOvercast');
    this.formData[1] = this.formData[1] === 'true';
    this.formData[2] = localStorage.getItem('turnOnSunset');
    this.formData[2] = this.formData[2] === 'true';
    this.formData[3] = localStorage.getItem('turnOnAt');
    this.formData[3] = this.formData[3] === 'true';
    this.formData[4] = localStorage.getItem('turnOnAtVal');
    this.formData[5] = localStorage.getItem('turnOffAt');
    this.formData[5] = this.formData[5] === 'true';
    this.formData[6] = localStorage.getItem('turnOffAtVal');
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async saveChanges() {
    if (!this.formData[3] || this.formData[4] === '') {
      this.formData[3] = false;
      this.formData[4] = '';
    }

    if (!this.formData[5] || this.formData[6] === '') {
      this.formData[5] = false;
      this.formData[6] = '';
    }

    await this.modalController.dismiss(this.formData);
  }

  ngOnInit() {
    console.log(this.params);
  }
}
