import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MapService {
  private userSelectedState = new BehaviorSubject("");
  private userSelectedYear = new BehaviorSubject("");

  selectedState = this.userSelectedState.asObservable();
  selectedYear = this.userSelectedYear.asObservable();

  constructor() {}

  changeState(stateName: string) {
    this.userSelectedState.next(stateName);
  }

  changeYear(year: string) {
    this.userSelectedYear.next(year);
  }
}
