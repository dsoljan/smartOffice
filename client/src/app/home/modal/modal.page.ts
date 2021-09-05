import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  formData = [false, false, false, false, '', false, ''];
  // turnOnAt: any;
  // turnOffAt: any;

  dateNow: Date;
  dateString: string;
  hourNow: string;

  constructor(
    private modalController: ModalController,
    private params: NavParams
  ) {
    this.dateNow = new Date();
    this.dateString = this.dateNow.toLocaleString();
    this.hourNow =
      this.dateNow.getHours().toString() +
      ':' +
      (this.dateNow.getMinutes() < 10 ? '0' : '') +
      this.dateNow.getMinutes().toString();
  }

  addOffValue() {
    if (this.formData[5]) {
      this.formData[6] = this.dateString;
    }
  }

  addOnValue() {
    if (this.formData[3]) {
      this.formData[4] = this.dateString;
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async saveChanges() {
    console.log(this.formData);
    await this.modalController.dismiss(this.formData);
  }

  ngOnInit() {
    console.log(this.params);
  }
}
