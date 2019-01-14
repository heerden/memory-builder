import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  countDays: string;
  countHours: string;
  countMinutes: string;
  countSeconds: string;
  dateTarget: Date;
  interval: any;

  constructor() { }

  ngOnInit() {
    this.dateTarget = new Date('7 January, 2019 12:00');
    this.setCountDown(); // to have output values oninit

    this.interval = setInterval(() => {
      this.setCountDown();
    }, 1000);
  }

  setCountDown() {

    let today = new Date();
    let dateDifference = this.dateTarget.valueOf() - today.valueOf();

    let day = Math.trunc(dateDifference / (1000 * 60 * 60 * 24));
    let rem = dateDifference % (1000 * 60 * 60 * 24);

    let hours = Math.trunc(rem / (1000 * 60 * 60));
    rem = rem % (1000 * 60 * 60);

    let min = Math.trunc(rem / (1000 * 60));
    rem = rem % (1000 * 60);

    let sec = Math.trunc(rem / 1000);

    this.countDays = day.toString();
    this.countHours = hours.toString();
    this.countMinutes = min.toString();
    this.countSeconds = sec.toString();
  }

}
