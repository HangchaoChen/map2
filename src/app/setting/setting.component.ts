import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.css"]
})
export class SettingComponent implements OnInit {
  selectedYear;

  numberOfDistrict;

  weight1 = 1;

  weight2 = 2;

  weight3 = 3;

  updateBehavior = false;

  onClickSwitch() {
    console.log("update switch");
    this.updateBehavior = !this.updateBehavior;
  }
  onClickApply() {
    console.log("year: ", this.selectedYear);
    console.log("numberOfDistrict: ", this.numberOfDistrict);
    console.log("w1: ", this.weight1);
    console.log("w2: ", this.weight2);
    console.log("w3: ", this.weight3);
    console.log("update: ", this.updateBehavior);
    //this.sendMessage("test"); //test
  }

  constructor() {}

  ngOnInit() {}
}
