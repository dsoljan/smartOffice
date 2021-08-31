import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-side-card',
  templateUrl: './side-card.component.html',
  styleUrls: ['./side-card.component.scss'],
})
export class SideCardComponent implements OnInit {
  @Input() parameter: any;
  @Input() toggles: Array<boolean>;
  @Input() values: Array<string>;

  constructor() { }

  ngOnInit() { }

}
