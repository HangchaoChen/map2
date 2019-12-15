import { MapService } from "./../map.service";
import { StateInfo } from "./../state.info";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit {
  is_combined = false;

  max = 1;
  min = 0.01;
  stateName: string;

  listOfOption: Array<{ label: string; value: string }> = [];
  listOfSelectedValue = [];

  state_info = new StateInfo();

  statewide_voting_patterns = this.state_info.get_message();

  show_old = false;

  show_new = false;
  on_click_old() {
    this.show_old = true;
  }

  old_table_close() {
    this.show_old = false;
  }

  on_click_new() {
    this.show_new = true;
  }

  new_table_close() {
    this.show_new = false;
  }

  constructor(private mapService: MapService) {}

  ngOnInit() {
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 0; i < 6; i++) {
      children.push({
        label: this.state_info.get_target_enum_lower(i),
        value: this.state_info.get_target_enum(i).toString()
      });
    }
    this.listOfOption = children;

    this.mapService.selectedState.subscribe(stateName => {
      this.stateName = stateName;
    });
  }
}
