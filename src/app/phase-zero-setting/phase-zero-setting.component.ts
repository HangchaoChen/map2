import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-phase-zero-setting",
  templateUrl: "./phase-zero-setting.component.html",
  styleUrls: ["./phase-zero-setting.component.css"]
})
export class PhaseZeroSettingComponent implements OnInit {
  selectedYear = "";
  polulationThreshold = 0;
  partyThreshold = 0;
  formatterPercent = (value: number) => `${value} %`;

  onClickApply() {
    console.log(this.selectedYear);
    console.log(this.polulationThreshold);
    console.log(this.partyThreshold);
  }

  constructor() {}

  ngOnInit() {}
}
