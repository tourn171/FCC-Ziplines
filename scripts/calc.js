var input = {

  total: "",
  memory: "",
  inputStream: [],
  isFloat: false,
  streamLength: 0,
  opps: ["+", "-", "/", "*"],

  handler: function (key) {
    this.streamLength = this.inputStream.length;
    if (this.streamLength > 0) {
      var lastKey = this.inputStream[this.streamLength - 1];
    }

    if (/[0-9]|\./.test(key)) {

      this.numberHandler(key, lastKey);
    } else if (/[+|-|*|/|sqrt|%|plusmin|MS|MR|MC|C|CE]|/.test(key)) {
      if (key === "plusmin") {
        this.inputStream[this.streamLength - 1] = "-" + this.inputStream[this.streamLength - 1];
      } else if (key === "%") {
        this.inputStream[this.streamLength - 1] = (Number(this.inputStream[this.streamLength - 1]) / 100).toString();
      } else if (key === "sqrt") {
        this.inputStream[this.streamLength - 1] = Math.sqrt(Number(this.inputStream[this.streamLength - 1])).toString();
      } else if (/[MS|MR|MC|C|CE]/.test(key)) {
        this.memoryHandler(key);
      } else {
        if (lastKey.indexOf(this.opps) === -1 && key !== "=") {
          this.inputStream.push(key);
        }
      }
    }
    if (key === "=") {
      this.total = eval(this.inputStream.join("").toString());
      output.setDisplay(this.total);
      this.inputStream = [];
    } else {
      output.setDisplay(this.inputStream.join(""));
    }
    console.log(this.inputStream);
  },

  numberHandler: function (key, lastKey) {
    if (/[0-9]|\./.test(lastKey)) {
      this.inputStream[this.streamLength - 1] = this.inputStream[this.streamLength - 1] + key;
    } else {
      this.inputStream.push(key);
    }
  },

  memoryHandler: function (key) {
    switch (key) {
      case "C":
        this.total = this.memory = "";
        this.inputStream = [];
        this.isFloat = false;
        this.streamLength = 0;
        output.clearDisplay();
        break;
      case "CE":
        this.inputStream.pop();
        break;
    }
  }
};

var output = {
  setDisplay: function (value) {

    if (value.length > 20) {
      value = "Err"
    }
    $(".display h2").html(value);
  },

  clearDisplay: function () {
    $(".display h2").html("0");
  }
}









$(".button").click(function () {
  var key = this.dataset.key;
  input.handler(key);
});

$(document).ready(function () {
  output.clearDisplay();
});
