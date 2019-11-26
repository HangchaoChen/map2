import { MapService } from "./../map.service";
import { EventEmitter } from "events";
import { Component, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sider.component.html",
  styleUrls: ["./sider.component.css"]
})
export class SiderComponent implements OnInit {
  @Output() changeState = new EventEmitter();
  constructor(private mapService: MapService) {}

  openSetting = false;
  openP0Setting = false;
  stateName;

  showSettings() {
    this.openSetting = true;
  }
  closeSettings() {
    this.openSetting = false;
  }

  showP0Settings() {
    this.openP0Setting = true;
  }
  closeP0Settings() {
    this.openP0Setting = false;
  }

  showTables() {
    console.log("show tables");
  }

  onClickApply() {
    console.log("apply clicked");
    console.log("send messgae call");
  }

  onSelectState(stateName) {
    console.log("select: ", stateName);
    this.stateName = stateName;
    this.mapService.changeState(stateName);
  }

  ngOnInit() {
    this.mapService.selectedState.subscribe(stateName => {
      //console.log("state name changed")
      this.stateName = stateName;
    });
  }
}
