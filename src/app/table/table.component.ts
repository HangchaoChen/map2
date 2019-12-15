import { HttpClient, HttpHeaders } from "@angular/common/http";
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

  show_new = false;

  loading_data = false;

  listOfData;

  on_click_apply() {
    console.log("state name : ", this.stateName);
    console.log("max: ", this.max);
    console.log("min: ", this.min);
    console.log("minority population: ", this.listOfSelectedValue);
    console.log("is combined: ", this.is_combined);

    this.loading_data = true;

    let url = "http://localhost:8080/setting/specifyMinorityPopulation";
    let header = new HttpHeaders().set("Content-Type", "application/json");
    let body = {
      stateName: this.stateName,
      status: "OLD",
      maximumPercentage: this.max,
      minimumPercentage: this.min,
      minorityPopulations: this.listOfSelectedValue,
      isCombined: this.is_combined
    };

    let connection = this.http.post(url, body, { headers: header }).subscribe(
      (data: any) => {
        this.listOfData = data.result["Minority Population Distribution Table"];
        console.log("data loaded:", data);
        this.loading_data = false;
      },
      err => {
        if (err) {
          console.log("error on table.ts, can't get data");
          this.loading_data = false;
        }
      }
    );
  }

  on_click_view() {
    this.show_new = true;
  }

  new_table_close() {
    this.show_new = false;
  }

  constructor(private http: HttpClient, private mapService: MapService) {}

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
