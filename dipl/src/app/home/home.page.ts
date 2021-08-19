import { Component, Input, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  slideOptions = {
    slidesPerView: 'auto',
    zoom: false,
    grabCursor: true
  };

  sensorCards = [
    {
      icon: '',
      parameter: 'Lights',
      currentValue: '18°C'
    },
    {
      icon: '',
      parameter: 'Lights',
      currentValue: '18°C'
    },
    {
      icon: '',
      parameter: 'Lights',
      currentValue: '18°C'
    }
  ];

  constructor() { }
}
