import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { AlertController, IonSlides, ModalController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { ModalPage } from './modal/modal.page';
import { WeatherService } from 'src/services/weather.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {
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
  turnOnTime: any;
  turnOffTime: any;

  nr: number;
  timeDiffOn: number;
  timeDiffOff: number;

  currentMin: any;
  turnOnMin: any;
  turnOffMin: any;

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
      path: 'assets/custom/lights-icon.svg',
    },
    {
      id: '1',
      name: 'WINDOWS',
      tag: 'W',
      path: 'assets/custom/windows-icon.svg',
    },
    {
      id: '2',
      name: 'BLINDS',
      tag: 'B',
      path: 'assets/custom/blinds-icon.svg',
    },
    {
      id: '3',
      name: 'AIR CONDITIONER',
      tag: 'AC',
      path: 'assets/custom/temperature-icon.svg',
    },
  ];

  private username = 'JHKK2i9q85tqdFK8dKIA3RRl1yFAO6Ii2X2kLBlW';
  private hueApiUrl = `http://192.168.0.24/api/${this.username}`;

  constructor(
    private http: HttpClient,
    private weatherService: WeatherService,
    public modalController: ModalController,
    public alertController: AlertController,
    private geolocation: Geolocation
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Philips Hue',
      message:
        'Neuspješno povezivanje. Molimo provjerite da ste spojeni na istu mrežu kao i Hue most.',
      buttons: ['OK'],
    });

    await alert.present();

    // const { role } = await alert.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
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
      this.turnOnTime = formData[4].slice(11, 16);
      this.turnOffTime = formData[6].slice(11, 16);

      // remote access not set
      if (this.parameterToggle[0]) {
        localStorage.setItem('turnOnOvercast', formData[1].toString());
        localStorage.setItem('turnOnSunset', formData[2].toString());
        // console.log(localStorage.getItem('turnOnSunset'));
      }

      // SCHEDULE TURN ON
      if (
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
          localtime: 'W127/T' + this.turnOnTime + ':00',
        };
        JSON.stringify(payload);
        if (this.parameterToggle[0]) {
          this.lightChangeAuto(payload, 1);
          const dateNow = new Date();

          this.turnOnMin = Number(this.turnOnTime.slice(3, 5));
          this.currentMin = dateNow.getMinutes();

          this.timeDiffOn = 60 * 1000 * (this.turnOnMin - this.currentMin);
          setTimeout(() => {
            this.lightsRangeVal = 100;
          }, this.timeDiffOn);
        }
      }

      // SCHEDULE TURN OFF
      else if (
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
          localtime: 'W127/T' + this.turnOffTime + ':00',
        };
        JSON.stringify(payload);
        if (this.parameterToggle[0]) {
          this.lightChangeAuto(payload, 2);
          const dateNow = new Date();

          this.turnOffMin = Number(this.turnOffTime.slice(3, 5));
          this.currentMin = dateNow.getMinutes();

          this.timeDiffOff = 60 * 1000 * (this.turnOffMin - this.currentMin);
          setTimeout(() => {
            this.lightsRangeVal = 0;
          }, this.timeDiffOff);
        }
      }
    });
    return await modal.present();
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
  sliderLightsChange() {
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
      },
      (err) => {
        console.log(err);
      }
    );
  }

  lightChangeWeather(payload) {
    this.http.post(`${this.hueApiUrl}/schedules`, payload).subscribe(
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
        this.presentAlert();
      }
    );
  }

  ngAfterViewInit() {
    const geolocationOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
    };
    this.geolocation
      .getCurrentPosition(geolocationOptions)
      .then((pos) => {
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
        console.log(pos.coords.latitude, pos.coords.longitude);

        this.getWeatherData();

        this.weatherSubscription = interval(600000).subscribe(() => {
          this.getWeatherData();
        });
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });
  }

  getWeatherData() {
    this.weatherService
      .getCurrentWeather(this.latitude, this.longitude)
      .subscribe((res) => {
        this.cloudiness = Object.values(res)[4].clouds;
        this.sunsetTimestamp = Object.values(res)[4].sunset * 1000; //js in ms

        console.log(Object.values(res));
        this.sunsetTime = new Date(this.sunsetTimestamp).toLocaleTimeString(
          'en-GB'
        );

        if (
          this.parameterToggle[0] &&
          localStorage.getItem('turnOnOvercast') === 'true' &&
          this.cloudiness >= 95
        ) {
          this.lightChange('on', true);
        } else if (
          this.parameterToggle[0] &&
          localStorage.getItem('turnOnSunset') === 'true'
          // && this.sunsetTime !== localStorage.getItem('sunsetTime')
        ) {
          localStorage.setItem('sunsetTime', this.sunsetTime);
          console.log('uspilo', this.sunsetTime);
          const payload = {
            name: 'Turn On Sunset',
            command: {
              address:
                '/api/JHKK2i9q85tqdFK8dKIA3RRl1yFAO6Ii2X2kLBlW/groups/0/action',
              method: 'PUT',
              body: {
                on: true,
              },
            },
            localtime: 'W127/T' + this.sunsetTime,
          };
          JSON.stringify(payload);
          console.log(payload);
          if (this.parameterToggle[0]) {
            this.lightChangeWeather(payload);
          }
        }
      });
  }

  ngOnDestroy() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.weatherSubscription
      ? this.weatherSubscription.unsubscribe
      : delete this.weatherSubscription;
  }
}
