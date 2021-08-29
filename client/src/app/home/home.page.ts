import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  lights: any;
  lightChangeValues = {};

  rangeValue: number;
  lightsValue: string;
  lightsSubject = new Subject<string>();

  lightsToggle = false;
  mainToggle = false;

  slideOptions = {
    slidesPerView: 'auto',
    zoom: false,
    grabCursor: true,
    spaceBetween: 20,
    pagination: false
  };

  parameter = [
    {
      name: 'WINDOWS',
      currentValue: 'open',
      path: 'assets/custom/windows-icon.svg'
    },
    {
      name: 'BLINDS',
      currentValue: 'up',
      path: 'assets/custom/blinds-icon.svg'
    },
    {
      name: 'AIR CONDITIONER',
      currentValue: '20°C',
      path: 'assets/custom/temperature-icon.svg'
    }
  ];

  private username = 'JHKK2i9q85tqdFK8dKIA3RRl1yFAO6Ii2X2kLBlW';
  private hueApiUrl = `http://192.168.0.34/api/${this.username}/lights`;


  constructor(private http: HttpClient) {
  }

  onMainToggle() {
    this.lightsToggle = !this.lightsToggle;
  }

  onClickOff() {
    if (this.lightsValue === 'on') {
      this.lightChange('on', false);
      this.lightsValue = 'off';
      this.rangeValue = 0;
    }
  }

  onClickOn() {
    if (this.lightsValue === 'off') {
      this.lightsValue = 'on';
      this.lightChange('on', true);
      this.rangeValue = 254;
    }
    console.log(this.lightsValue, this.rangeValue);
  }

  logChange(ev: any) {
    this.rangeValue = ev.detail.value;

    if (this.rangeValue > 0) {
      this.lightChange('on', true);
      this.lightChange('bri', this.rangeValue);
      this.lightsValue = 'on';
    }
    else {
      this.lightChange('on', false);
      this.lightsValue = 'off';
    }
    console.log(this.lightsValue, this.rangeValue);
  }


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
          // this.rangeValue = this.lights.bri;
          if (this.lights.on) {
            this.lightsValue = 'on';
          }
          else {
            this.lightsValue = 'off';
            this.rangeValue = 0;
          }
          console.log(this.lightsValue, this.rangeValue);
        },
        err => {
          console.log(err);
        }
      );

  }

}

