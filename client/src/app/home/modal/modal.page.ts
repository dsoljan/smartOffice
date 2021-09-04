import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  preferences: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private params: NavParams
  ) {
    this.preferences = this.formBuilder.group({
      remoteAccess: new FormControl(false),
      turnOnSunset: new FormControl(false),
      turnOnOvercast: new FormControl(false),
      turnOnAt: new FormControl(false),
      turnOnAtVal: new FormControl(''),
      turnOffAt: new FormControl(false),
      turnOffAtVal: new FormControl(''),
    });
  }

  async closeModal() {
    console.log(this.preferences.value);
    await this.modalController.dismiss(this.preferences);
  }

  ngOnInit() {
    console.log(this.params);
  }

  get remoteAccess() { return this.preferences.get('remoteAccess'); }
  get turnOnSunset() { return this.preferences.get('turnOnSunset'); }
  get turnOnOvercast() { return this.preferences.get('turnOnOvercast'); }
  get turnOnAt() { return this.preferences.get('turnOnAt'); }
  get turnOnAtVal() { return this.preferences.get('turnOnAtVal'); }
  get turnOffAt() { return this.preferences.get('turnOffAt'); }
  get turnOffAtVal() { return this.preferences.get('turnOffAtVal'); }
}
