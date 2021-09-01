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
  hueLightsRangeVal: number;

  window1 = false;
  window2 = false;

  blindsRangeVal = 0;
  blindsRangeAngle = 0;
  blindsRangeVal2 = 0;
  blindsRangeAngle2 = 0;

  acSliderVal = 16;
  fanOff = false;
  fanReduce = false;

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
  private hueApiUrl = `http://192.168.0.24/api/${this.username}/lights`;

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
      this.hueLightsRangeVal = 0;
    }
  }

  onClickOn() {
    if (this.parameterValues[0] === 'off') {
      this.parameterValues[0] = 'on';
      this.lightChange('on', true);
      this.lightsRangeVal = 100;
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
    this.blindsRangeVal = 0;
    this.blindsRangeAngle = 0;
    this.blindsRangeVal2 = 0;
    this.blindsRangeAngle2 = 0;
  }

  onClickDown() {
    this.parameterValues[2] = 'down';
    this.blindsRangeVal = 100;
    this.blindsRangeAngle = 100;
    this.blindsRangeVal2 = 100;
    this.blindsRangeAngle2 = 100;
  }

  // AC OFF/ON BUTTON
  onClickACOff() {
    this.parameterValues[3] = 'off';
  }

  onClickACOn() {
    this.parameterValues[3] = 'on';
  }

  // AC REDUCE/SWITCH OFF
  onClickReduce() {
    if (this.fanOff) {
      this.fanOff = false;
    }
    this.fanReduce = !this.fanReduce;
  }

  onClickSwitchOff() {
    if (this.fanReduce) {
      this.fanReduce = false;
    }
    this.fanOff = !this.fanOff;
  }

  // LIGHTS SLIDER
  sliderLightsChange(ev: any) {
    // this.lightsRangeVal = ev.detail.value;
    this.hueLightsRangeVal = Math.floor(this.lightsRangeVal * 2.54);

    if (this.lightsRangeVal > 0) {
      this.lightChange('on', true);
      this.lightChange('bri', this.hueLightsRangeVal);
      this.parameterValues[0] = 'on';
    }
    else {
      this.lightChange('on', false);
      this.parameterValues[0] = 'off';
    }
    console.log(this.parameterValues[0], this.lightsRangeVal, this.hueLightsRangeVal);
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
  sliderBlindsChange() {
    console.log(this.blindsRangeAngle, this.blindsRangeAngle2);
    if (this.blindsRangeVal === 100 && this.blindsRangeVal2 === 100) {
      this.parameterValues[2] = 'down';
    }
    if (this.blindsRangeVal === 0 && this.blindsRangeVal === 0) {
      this.parameterValues[2] = 'up';
    }
    console.log(this.parameterValues[2], this.blindsRangeVal);
  }

  // TEMPERATURE SLIDER
  logs() {
    console.log(this.acSliderVal);
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
          this.hueLightsRangeVal = this.lights.bri;
          this.lightsRangeVal = Math.floor(this.hueLightsRangeVal / 2.54);
          if (this.lights.on) {
            this.parameterValues[0] = 'on';
          }
          else {
            this.parameterValues[0] = 'off';
            this.lightsRangeVal = 0;
            this.hueLightsRangeVal = 0;
          }
          console.log(this.parameterValues[0], this.lightsRangeVal);
        },
        err => {
          console.log(err);
        }
      );
  }

}

