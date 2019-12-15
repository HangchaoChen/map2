import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MapService {
  private userSelectedState = new BehaviorSubject("");
  private userSelectedYear = new BehaviorSubject("");
  private algo_p1_data = new BehaviorSubject(JSON);
  private p1_first = new BehaviorSubject(true);
  private p1_done = new BehaviorSubject(false);
  private p1_coloring_done = new BehaviorSubject(false);
  private p2_done = new BehaviorSubject(false);
  private p2_coloring_done = new BehaviorSubject(false);
  private algo_p2_data = new BehaviorSubject(JSON);

  private color_choice = new BehaviorSubject("default");

  selectedState = this.userSelectedState.asObservable();
  selectedYear = this.userSelectedYear.asObservable();
  p1_data = this.algo_p1_data.asObservable();
  p1_status = this.p1_done.asObservable();
  p1_color_status = this.p1_coloring_done.asObservable();
  p2_data = this.algo_p2_data.asObservable();
  p2_status = this.p2_done.asObservable();
  p2_color_status = this.p2_coloring_done.asObservable();
  p1_first_time = this.p1_first.asObservable();
  color_theme = this.color_choice.asObservable();

  constructor() {}

  changeState(stateName: string) {
    this.userSelectedState.next(stateName);
  }

  changeYear(year: string) {
    this.userSelectedYear.next(year);
  }

  set_p1_data(data: any) {
    //console.log("data changed");
    this.algo_p1_data.next(data);
    //console.log("what is it?:", data);
  }

  set_p2_data(data: any) {
    this.algo_p2_data.next(data);
  }

  change_p1_first_time(status: boolean) {
    this.p1_first.next(status);
  }

  change_p1_status(status) {
    this.p1_done.next(status);
  }
  change_p1_color_status(status) {
    this.p1_coloring_done.next(status);
  }

  change_p2_status(status) {
    this.p2_done.next(status);
  }

  change_p2_color_status(status) {
    this.p2_coloring_done.next(status);
  }

  change_color_theme(color) {
    this.color_choice.next(color);
  }
}
