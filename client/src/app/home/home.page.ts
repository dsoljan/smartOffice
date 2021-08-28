import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  btnClickOff = true;
  btnClickOn = false;
  lights: string[];
  lightChangeValues = {};

  lightsToggle = false;

  lightsValue = 'off';

  slideOptions = {
    slidesPerView: 'auto',
    zoom: false,
    grabCursor: true,
    spaceBetween: 20,
    pagination: false
  };

  parameterCards = [
    {
      name: 'LIGHTS',
      currentValue: this.lightsValue,
      path: 'assets/custom/lights-icon.svg'
    },
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

  constructor(private http: HttpClient) { }

  onClickOff() {
    if (!this.btnClickOff) {
      this.btnClickOff = true;
      this.lightsValue = 'off';
    }
    if (this.btnClickOff) {
      this.btnClickOn = false;
    }
  }

  onClickOn() {
    if (!this.btnClickOn) {
      this.btnClickOn = true;
      this.lightsValue = 'on';
    }
    if (this.btnClickOn) {
      this.btnClickOff = false;
    }
  }

  // changeLightsToggle() {
  //   console.log(this.lightsToggle);
  // }

  changeToggleFromChild($event) {
    this.lightsToggle = $event;
  }


  lightChange(lightNumber, property, propertyValue) {
    this.lightChangeValues[property] = propertyValue;
    this.http.put(
      `${this.hueApiUrl}/${lightNumber}/state`, this.lightChangeValues
    )
      .subscribe(
        data => { console.log(data); },
        err => {
          console.log(err);
        }
      );
  }

  ngOnInit(): void {
    this.http.get(this.hueApiUrl)
      .subscribe(
        data => {
          this.lights = Object.values(data);
        },
        err => {
          console.log(err);
        }
      );
  }

}
