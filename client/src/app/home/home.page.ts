import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('cards') cards: IonSlides;
  @ViewChild('activeCard') activeCard: IonSlides;

  lights: any;
  lightChangeValues = {};
  lightsRangeVal: number;

  window1 = false;
  window2 = false;

  blindsRangeVal: number;
  blindsRangeAngle: number;
  blindsRangeVal2: number;
  blindsRangeAngle2: number;

  parameterValues = ['off', 'closed', 'up', '23°C'];

  mainToggle = false;
  parameterToggle = [false, false, false, false];

  slideOptions = {
    slidesPerView: 'auto',
    zoom: false,
    grabCursor: true,
    spaceBetween: 20,
    pagination: false
  };

  slideOptions2 = {
    slidesPerView: 1,
    zoom: false,
    allowTouchMove: false
  };

  parameter = [
    {
      id: '0',
      name: 'LIGHTS',
      currentValue: 'off',
      path: 'assets/custom/lights-icon.svg'
    },
    {
      id: '1',
      name: 'WINDOWS',
      currentValue: 'open',
      path: 'assets/custom/windows-icon.svg'
    },
    {
      id: '2',
      name: 'BLINDS',
      currentValue: 'up',
      path: 'assets/custom/blinds-icon.svg'
    },
    {
      id: '3',
      name: 'AIR CONDITIONER',
      currentValue: '20°C',
      path: 'assets/custom/temperature-icon.svg'
    }
  ];

  private username = 'JHKK2i9q85tqdFK8dKIA3RRl1yFAO6Ii2X2kLBlW';
  private hueApiUrl = `http://192.168.0.34/api/${this.username}/lights`;

  constructor(private http: HttpClient) { }

  onMainToggle() {
    for (let i = 0; i < this.parameterToggle.length; i++) {
      this.parameterToggle[i] = this.mainToggle;
    }
  }

  changeActiveCard() {
    this.cards.getSwiper().then(el => {
      this.activeCard.slideTo(el.clickedIndex);
      this.cards.slideTo(el.clickedIndex);
    });
  }

  // LIGHTS OFF/ON BUTTONS
  onClickOff() {
    if (this.parameterValues[0] === 'on') {
      this.lightChange('on', false);
      this.parameterValues[0] = 'off';
      this.lightsRangeVal = 0;
    }
  }

  onClickOn() {
    if (this.parameterValues[0] === 'off') {
      this.parameterValues[0] = 'on';
      this.lightChange('on', true);
      this.lightsRangeVal = 254;
    }
    console.log(this.parameterValues[0], this.lightsRangeVal);
  }

  // WINDOWS CLOSE/OPEN BUTTONS
  onClickClose() {
    this.parameterValues[1] = 'closed';
    this.window1 = false;
    this.window2 = false;
  }

  onClickOpen() {
    this.parameterValues[1] = 'open';
    this.window1 = true;
    this.window2 = true;
  }

  // BLINDS UP/DOWN BUTTONS
  onClickUp() {
    this.parameterValues[2] = 'up';
  }

  onClickDown() {
    this.parameterValues[2] = 'down';
  }

  // LIGHTS SLIDER
  sliderLightsChange(ev: any) {
    this.lightsRangeVal = ev.detail.value;

    if (this.lightsRangeVal > 0) {
      this.lightChange('on', true);
      this.lightChange('bri', this.lightsRangeVal);
      this.parameterValues[0] = 'on';
    }
    else {
      this.lightChange('on', false);
      this.parameterValues[0] = 'off';
    }
    console.log(this.parameterValues[0], this.lightsRangeVal);
  }

  // WINDOWS TOGGLES
  checkWindows() {
    if (this.window1 !== this.window2) {
      this.parameterValues[1] = 'partially open';
    }
    if (this.window1 && this.window1 === this.window2) {
      this.parameterValues[1] = 'open';
    }
    if (!this.window1 && this.window1 === this.window2) {
      this.parameterValues[1] = 'closed';
    }
  }

  // BLINDS SLIDER
  sliderBlindsChange(ev: any) {
    console.log(ev);
    this.blindsRangeVal = ev.detail.value;

    if (this.blindsRangeVal > 0) {
      this.parameterValues[2] = 'down';
    }
    else {
      this.parameterValues[2] = 'up';
    }
    console.log(this.parameterValues[2], this.blindsRangeVal);
  }


  // CHANGE LIGHT OFF/ON/BRI
  lightChange(property, propertyValue) {
    this.lightChangeValues[property] = propertyValue;
    this.http.put(
      `${this.hueApiUrl}/1/state`, this.lightChangeValues
    )
      .subscribe(
        data => { console.log(data); },
        err => {
          console.log(err);
        }
      );
  }


  ngOnInit(): void {
    this.http.get(`${this.hueApiUrl}/1`)
      .subscribe(
        data => {
          this.lights = Object.values(data)[0];
          this.lightsRangeVal = this.lights.bri;
          if (this.lights.on) {
            this.parameterValues[0] = 'on';
          }
          else {
            this.parameterValues[0] = 'off';
            this.lightsRangeVal = 0;
          }
          console.log(this.parameterValues[0], this.lightsRangeVal);
        },
        err => {
          console.log(err);
        }
      );
  }

}

