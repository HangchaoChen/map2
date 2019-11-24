const IL = "Illinois";
const IL_id = 17;
var is_district_loaded = false;
var is_precinct_loaded = false;
const dis_URL_2016_C = "";
const pre_URL_2016_C = "";
const dis_URL_2018_C = "";
const pre_URL_2018_C = "";
const dis_URL_2016_P = "";
const pre_URL_2016_P = "";

export class Illinois {
  getName() {
    return IL;
  }
  getID() {
    return IL_id;
  }
  load_dis(year: string) {
    switch (year) {
    }
  }
}
