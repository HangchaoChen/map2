import { StateInfo } from "./../state.info";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit {
  state_info = new StateInfo();

  statewide_voting_patterns = this.state_info.get_message();

  constructor() {}

  ngOnInit() {}
}
