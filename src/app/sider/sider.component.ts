import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sider",
  templateUrl: "./sider.component.html",
  styleUrls: ["./sider.component.css"]
})
export class SiderComponent implements OnInit {
  constructor() {}

  openSetting = false;
  showSettings() {
    console.log("show setting");
    this.openSetting = true;
  }
  closeSettings() {
    this.openSetting = false;
  }

  showTables() {
    console.log("show tables");
  }

  onClickApply() {
    console.log("apply clicked");
    console.log("send messgae call");
  }

  //constructor() {}

  ngOnInit() {}
}
