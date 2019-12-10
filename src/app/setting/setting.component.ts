import { MapService } from "./../map.service";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.css"]
})
export class SettingComponent implements OnInit {
  constructor(private http: HttpClient, private mapService: MapService) {}

  stateName: string;
  IL = "Illinois";
  OH = "Ohio";
  OR = "Oregon";

  selectedYear;

  numberOfDistrict;

  Reock_Compactness = 0;

  Convex_Hull_Compactness = 0;

  Edge_Compactness = 0;

  Gerrymander_Republican = 0;

  Gerrymander_Democrat = 0;

  Partisan_Fairness = 0;

  Efficiency_Gap = 0;

  Competitiveness = 0;

  Population_Homogeneity = 0;

  Population_Equality = 0;

  updateBehavior = false;

  change_year() {
    this.mapService.changeYear(this.selectedYear);
    console.log("changing selected year from setting: ", this.selectedYear);
  }

  onClickSwitch() {
    console.log("update switch");
    this.updateBehavior = !this.updateBehavior;
  }
  onClickApply() {
    console.log("state name: ", this.stateName);
    console.log("year: ", this.selectedYear);
    console.log("numberOfDistrict: ", this.numberOfDistrict);
    console.log("w1: ", this.Reock_Compactness);
    console.log("w2: ", this.Convex_Hull_Compactness);
    console.log("w3: ", this.Edge_Compactness);
    console.log("update: ", this.updateBehavior);
    //this.sendMessage("test"); //test
  }

  ngOnInit() {
    this.mapService.selectedState.subscribe(stateName => {
      this.stateName = stateName;
      if (
        stateName == this.IL ||
        stateName == this.OH ||
        stateName == this.OR
      ) {
        console.log("state name: ", stateName);
      }
    });
    this.mapService.selectedYear.subscribe(year => {
      this.selectedYear = year;
      console.log("in setting, year change received: ", this.selectedYear);
    });
  }
}
