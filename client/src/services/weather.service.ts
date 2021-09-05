import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getCurrentWeather(lat, lon) {
    return this.http.get(
      environment.weatherURL +
        lat +
        '&lon=' +
        lon +
        '&exclude=' +
        environment.weatherExclusion +
        '&appid=' +
        environment.weatherApiKey +
        '&units=' +
        environment.weatherUnits
    );
  }
}
