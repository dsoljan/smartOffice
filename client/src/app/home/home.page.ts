import {
  Component,
  HostListener,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { interval, Observable, Subscription, Timestamp } from 'rxjs';
import { ModalPage } from './modal/modal.page';
import { WeatherService } from 'src/services/weather.service';
import { element } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnChanges, OnDestroy {
  @ViewChild('cards') cards: IonSlides;
  @ViewChild('activeCard') activeCard: IonSlides;

  public innerWidth: any;

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

  parameterValues = ['off', 'closed', 'up', 'off'];

  mainToggle = false;
  parameterToggle = [false, false, false, false];

  latitude: number;
  longitude: number;
  weatherSubscription: Subscription;
  sunsetTimestamp: number;
  sunsetTime: string;
  cloudiness: number;

  nr: number;

  slideOptions = {
    slidesPerView: 'auto',
    zoom: false,
    spaceBetween: 20,
    pagination: false,
  };

  slideOptions2 = {
    slidesPerView: 1,
    zoom: false,
    allowTouchMove: false,
  };

  parameter = [
    {
      id: '0',
      name: 'LIGHTS',
      tag: 'L',
      currentValue: 'off',
      path: 'assets/custom/lights-icon.svg',
    },
    {
      id: '1',
      name: 'WINDOWS',
      tag: 'W',
      currentValue: 'open',
      path: 'assets/custom/windows-icon.svg',
    },
    {
      id: '2',
      name: 'BLINDS',
      tag: 'B',
      currentValue: 'up',
      path: 'assets/custom/blinds-icon.svg',
    },
    {
      id: '3',
      name: 'AIR CONDITIONER',
      tag: 'AC',
      currentValue: '20°C',
      path: 'assets/custom/temperature-icon.svg',
    },
  ];

  private username = 'JHKK2i9q85tqdFK8dKIA3RRl1yFAO6Ii2X2kLBlW';
  private hueApiUrl = `http://192.168.0.24/api/${this.username}`;

  constructor(
    private http: HttpClient,
    private weatherService: WeatherService,
    public modalController: ModalController
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        latitude: this.latitude,
        longitude: this.longitude,
      },
    });

    modal.onDidDismiss().then((data) => {
      const formData = data.data;
      console.log(formData);
      const turnOnTime = formData[4].slice(11, 16);
      const turnOffTime = formData[6].slice(11, 16);

      // remote access not set
      // CLOUDINESS TURN ON
      if (this.parameterToggle[0]) {
        localStorage.setItem('turnOnOvercast', formData[1].toString());
      }

      // SUNSET TURN ON
      if (this.parameterToggle[0]) {
        localStorage.setItem('turnOnSunset', formData[2].toString());
      }

      // SCHEDULE TURN ON
      if (
        this.parameterToggle[0] &&
        formData[4] !== '' &&
        formData[4] !== localStorage.getItem('turnOnAtVal')
      ) {
        localStorage.setItem('turnOnAt', formData[3].toString());
        localStorage.setItem('turnOnAtVal', formData[4].toString());

        const payload = {
          name: 'Turn On At',
          command: {
            address:
              '/api/JHKK2i9q85tqdFK8dKIA3RRl1yFAO6Ii2X2kLBlW/groups/0/action',
            method: 'PUT',
            body: {
              on: true,
            },
          },
          localtime: 'W127/T' + turnOnTime + ':00',
        };
        JSON.stringify(payload);
        this.lightChangeAuto(payload, 1);
      }

      // SCHEDULE TURN OFF
      else if (
        this.parameterToggle[0] &&
        formData[6] !== '' &&
        formData[6] !== localStorage.getItem('turnOffAtVal')
      ) {
        localStorage.setItem('turnOffAt', formData[5].toString());
        localStorage.setItem('turnOffAtVal', formData[6].toString());

        const payload = {
          name: 'Turn Off At',
          command: {
            address:
              '/api/JHKK2i9q85tqdFK8dKIA3RRl1yFAO6Ii2X2kLBlW/groups/0/action',
            method: 'PUT',
            body: {
              on: false,
            },
          },
          localtime: 'W127/T' + turnOffTime + ':00',
        };
        JSON.stringify(payload);
        this.lightChangeAuto(payload, 2);
        this.lightsRangeVal = 0;
      }
      console.log('posli', localStorage);
    });
    return await modal.present();
  }

  getPosition(): Observable<any> {
    return new Observable((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position);
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }

  onMainToggle() {
    for (let i = 0; i < this.parameterToggle.length; i++) {
      this.parameterToggle[i] = this.mainToggle;
    }
  }

  changeActiveCard() {
    this.cards.getSwiper().then((el) => {
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
    } else {
      this.lightChange('on', false);
      this.parameterValues[0] = 'off';
    }
    console.log(
      this.parameterValues[0],
      this.lightsRangeVal,
      this.hueLightsRangeVal
    );

    if (!this.parameterToggle[0]) {
      this.mainToggle = false;
    }
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
    if (this.blindsRangeVal === 100 && this.blindsRangeVal2 === 100) {
      this.parameterValues[2] = 'down';
    } else if (this.blindsRangeVal === 0 && this.blindsRangeVal2 === 0) {
      this.parameterValues[2] = 'up';
    } else {
      this.parameterValues[2] = 'partially down';
    }
  }

  // TEMPERATURE SLIDER
  changeTemperature() {
    this.parameterValues[3] = 'on';
  }

  // CHANGE LIGHT OFF/ON/BRI
  lightChange(property, propertyValue) {
    this.lightChangeValues[property] = propertyValue;
    this.http
      .put(`${this.hueApiUrl}/lights/1/state`, this.lightChangeValues)
      .subscribe(
        (data) => {
          console.log(data);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  // LIGHT SCHEDULE
  lightChangeAuto(payload, num) {
    this.http.put(`${this.hueApiUrl}/schedules/${num}`, payload).subscribe(
      (data) => {
        console.log(data);
        console.log(payload);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    localStorage.setItem('sunsetTime', '');

    this.http.get(`${this.hueApiUrl}/lights/1`).subscribe(
      (data) => {
        this.lights = Object.values(data)[0];
        this.hueLightsRangeVal = this.lights.bri;
        this.lightsRangeVal = Math.floor(this.hueLightsRangeVal / 2.54);
        if (this.lights.on) {
          this.parameterValues[0] = 'on';
        } else {
          this.parameterValues[0] = 'off';
          this.lightsRangeVal = 0;
          this.hueLightsRangeVal = 0;
        }
        console.log(this.parameterValues[0], this.lightsRangeVal);
      },
      (err) => {
        console.log(err);
      }
    );

    this.getPosition().subscribe((pos) => {
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;

      this.getWeatherData();

      this.weatherSubscription = interval(18000).subscribe(() => {
        this.getWeatherData();

        // lights auto mode
        if (
          this.parameterToggle[0] &&
          localStorage.getItem('turnOnOvercast') === 'true' &&
          this.cloudiness >= 90
        ) {
          this.lightChange('on', true);
        } else if (
          this.parameterToggle[0] &&
          localStorage.getItem('turnOnSunset') === 'true' &&
          this.sunsetTime !== localStorage.getItem('sunsetTime')
        ) {
          localStorage.setItem('sunsetTime', this.sunsetTime);
          console.log('uspilo', this.sunsetTime);
          const payload3 = {
            name: 'Turn Sunset',
            description: 'nez',
            command: {
              address: '/api/JHKK2i9q85tqdFK8dKIA3RRl1yFAO6Ii2X2kLBlW/lights/1',
              method: 'PUT',
              body: {
                on: true,
              },
            },
            localtime: 'T:' + this.sunsetTime,
          };
          JSON.stringify(payload3);
          console.log(payload3);
          this.lightChangeAuto(payload3, 3);
        }
      });
    });
  }

  ngOnChanges() {}

  getWeatherData() {
    this.weatherService
      .getCurrentWeather(this.latitude, this.longitude)
      .subscribe((res) => {
        this.cloudiness = Object.values(res)[4].clouds;
        this.sunsetTimestamp = Object.values(res)[4].sunset * 1000; //js in ms

        this.sunsetTime = new Date(this.sunsetTimestamp).toLocaleTimeString(
          'en-GB'
        );
      });
  }

  ngOnDestroy() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.weatherSubscription
      ? this.weatherSubscription.unsubscribe
      : delete this.weatherSubscription;
  }
}
