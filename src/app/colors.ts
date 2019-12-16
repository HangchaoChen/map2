function hashCode(str) {
  // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  var c = (i & 0x00ffffff).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
}

const theme_color = {
  default: [
    "#FF0000",
    "#FBFF00",
    "#00FF1A",
    "#00FFFB",
    "#007BFF",
    "#E100FF",
    "#8A3E3F",
    "#803E8A",
    "#3E788A",
    "#bd026f",
    "#888A3E",
    "#DADBAF",
    "#DBAFC2",
    "#AFB3A4",
    "#588040",
    "#AEFF7D",
    "#00ffd5",
    "#9900cc",
    "#ff7b00"
  ],
  Red: [
    "#FFA07A",
    "#FA8072",
    "#E9967A",
    "#F08080",
    "#CD5C5C",
    "#DC143C",
    "#FF0000",
    "#B22222",
    "#8B0000",
    "#FFA500",
    "#FF8C00",
    "#FF7F50",
    "#FF6347",
    "#FF4500",
    "#FF1493",
    "#FF69B4",
    "#DB7093",
    "#C71585",
    "#8B008B",
    "#800080",
    "#FFEFD5",
    "#FFE4B5",
    "#FFDAB9"
  ],
  Blue: [
    "#5F9EA0",
    "#4682B4",
    "#B0C4DE",
    "#ADD8E6",
    "#B0E0E6",
    "#87CEFA",
    "#87CEEB",
    "#6495ED",
    "#6495ED",
    "#1E90FF",
    "#4169E1",
    "#0000FF",
    "#0000CD",
    "#00008B",
    "#000080",
    "#00FFFF",
    "#AFEEEE",
    "#7FFFD4",
    "#7FFFD4",
    "#40E0D0"
  ],
  Green: [
    "#ADFF2F",
    "#7FFF00",
    "#7CFC00",
    "#00FF00",
    "#32CD32",

    "#98FB98",
    "#90EE90",
    "#00FA9A",
    "#00FF7F",
    "#3CB371",

    "#2E8B57",
    "#228B22",
    "#008000",
    "#006400",
    "#9ACD32",

    "#6B8E23",
    "#556B2F",
    "#556B2F",
    "#66CDAA",
    "#8FBC8F",

    "#20B2AA",
    "#008B8B",
    "#008080",
    "#7FFFD4",
    "#40E0D0"
  ]
};

export class Color {
  get_random_color(x) {
    return intToRGB(hashCode(x));
  }
  get_theme_color(color) {
    return theme_color[color];
  }
}
