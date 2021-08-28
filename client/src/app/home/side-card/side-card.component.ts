import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-side-card',
  templateUrl: './side-card.component.html',
  styleUrls: ['./side-card.component.scss'],
})
export class SideCardComponent implements OnInit {
  @Input() parameter: any;
  @Input() lightsBtn: boolean;
  @Output() toggleEvent = new EventEmitter<boolean>();

  lightsToggle: boolean;


  constructor() {
    this.lightsToggle = false;
  }

  ngOnInit() { }

  changeLightsToggle() {
    this.toggleEvent.emit(this.lightsBtn);
  }

}
