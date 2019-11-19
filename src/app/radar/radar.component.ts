import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-radar",
  templateUrl: "./radar.component.html",
  styleUrls: ["./radar.component.css"]
})
export class RadarComponent implements OnInit {
  public radarLabel = ["Q1", "Q2", "Q3", "Q4"];
  public radarData = [
    { data: [120, 130, 180, 70], label: "2017" },
    { data: [90, 150, 200, 45], label: "2018" }
  ];
  public radarType = "radar";

  constructor() {}

  ngOnInit() {}
}
