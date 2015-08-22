Array.prototype.copy = function () {
  var clone = [];
  for (var i in this) {
    clone[i] = this[i];
  }
  return clone;
}

var stateManager = {
  turn: "",
  state: 0,

  setTurn: function (turn) {
    this.turn = turn;
  },

  setState: function (state) {
    this.state = state;
    this.changeState();
  },

  changeState: function () {
    if (this.state === 0) {
      $(".modal").css("display", "block");
      $(".select").css("display", "block");
      $(".result").css("display", "none");
    } else if (this.state === 1) {
      $(".modal").css("display", "none");
      $(".select").css("display", "none");
      $(".result").css("display", "none");
    } else if (this.state === 2) {
      $(".modal").css("display", "block");
      $(".result").css("display", "block");
    }
  }
};

var game = {
  gameState: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  nodeList: Array.prototype.slice.call($(".tile")),

  reset: function () {
    this.gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    $(".tile").html("");
    $(".tile").removeClass("clicked");
    stateManager.setState(0);
  },

  checkWin: function () {
    var winner = "",
      b = this.gameState;
    if (b[0] === b[1] && b[1] === b[2]) {
      winner = b[0];
    } else if (b[3] === b[4] && b[4] === b[5]) {
      winner = b[3]
    } else if (b[6] === b[7] && b[7] === b[8]) {
      winner = b[6]
    } else if (b[0] === b[3] && b[3] === b[6]) {
      winner = b[0]
    } else if (b[1] === b[4] && b[4] === b[7]) {
      winner = b[1]
    } else if (b[2] === b[5] && b[5] === b[8]) {
      winner = b[2]
    } else if (b[0] === b[4] && b[4] === b[8]) {
      winner = b[0]
    } else if (b[2] === b[4] && b[4] === b[6]) {
      winner = b[2]
    } else {
      if (aiPlayer.getValidMoves(b).length === 0) {
        winner = "tie";
      }
    }

    if (winner == aiPlayer.seed) {
      this.setWin("Computer Wins :-( ");
    } else if (winner == aiPlayer.oppSeed) {
      this.setWin("You Win!");
    } else if (winner == "tie") {
      this.setWin("It's a tie!");
    }
  },

  setWin: function (str) {
    $(".result h2").html(str);
    stateManager.setState(2);
  }

}

var aiPlayer = {
  seed: "",
  oppSeed: "",
  pref: [4, 0, 2, 6, 8],

  setSeed: function (seed) {
    this.oppSeed = seed;
    this.seed = (seed === "X") ? "O" : "X";
  },

  getValidMoves: function (board) {
    var valid = [];

    board.forEach(function (ele, index) {
      if (ele === 0) {
        valid.push(index);
      }
    });
    return valid;
  },

  move: function () {
    var nextMove;
    prefered = this.checkPref(this.getValidMoves(game.gameState));
    if (prefered) {
      nextMove = prefered;
    } else {
      nextMove = this.minMax(this.seed, 5, game.gameState);
    }

    game.gameState[nextMove.index] = this.seed;
    game.nodeList[nextMove.index].className += " clicked";
    game.nodeList[nextMove.index].innerHTML = this.seed;
    game.checkWin();
  },

  minMax: function (player, depth, gameState) {
    var current,
      clone,
      best = (player === aiPlayer.seed) ? -5000 : 5000,
      bestIndex = -1,
      validMoves = aiPlayer.getValidMoves(gameState);

    if (validMoves.length === 0 || depth === 0) {
      best = aiPlayer.evaluate(gameState);
      return {
        "best": best,
        "index": bestIndex
      };
    }

    validMoves.forEach(function (ele, index) {
      clone = gameState.copy();
      if (player === aiPlayer.seed) { // Maximizing Player
        current = aiPlayer.minMax(aiPlayer.oppSeed, depth - 1, clone);
        if (current.best > best) {
          best = current.best;
          bestIndex = ele;
        }
      } else {
        current = aiPlayer.minMax(aiPlayer.seed, depth - 1, clone); // min player
        if (current.best < best) {
          best = current.best;
          bestIndex = ele;
        }
      }
    });
    return {
      "best": best,
      "index": bestIndex
    };
  },

  evaluate: function (gameState) {
    score = 0;
    score += aiPlayer.evaluateLine(0, 1, 2, gameState);
    score += aiPlayer.evaluateLine(3, 4, 5, gameState);
    score += aiPlayer.evaluateLine(6, 7, 8, gameState);
    score += aiPlayer.evaluateLine(0, 3, 6, gameState);
    score += aiPlayer.evaluateLine(1, 4, 7, gameState);
    score += aiPlayer.evaluateLine(2, 5, 8, gameState);
    score += aiPlayer.evaluateLine(0, 4, 8, gameState);
    score += aiPlayer.evaluateLine(2, 4, 6, gameState);

    return score;
  },

  evaluateLine: function (i1, i2, i3, board) {
    score = 0;
    if (board[i1] === aiPlayer.seed) {
      score = 1;
    } else {
      score = -1;
    }

    // cell 2
    if (board[i2] === aiPlayer.seed) {
      score += 10;
    } else if (board[i2] === aiPlayer.oppSeed) {
      return 0;
    } else {
      score += -1
    }

    //cell 3
    if (board[i3] === aiPlayer.seed) {
      score *= 10;
    } else if (board[i3] === aiPlayer.oppSeed) {
      return 0;
    } else {
      score += -1;
    }
    return score;
  },

  checkPref: function (board) {

    var pref = aiPlayer.pref;
    for (var i in pref) {

      if (board.indexOf(pref[i]) !== -1) {
        return {
          "best": 0,
          "index": pref[i]
        };
      }
    }
    return;
  }
}

$(".tile").click(function () {
  $(this).addClass("clicked");
  $(this).html(aiPlayer.oppSeed);
  game.gameState[this.dataset.index] = aiPlayer.oppSeed;
  stateManager.setTurn("computer");
  game.checkWin();
  if (stateManager.state === 1) {
    aiPlayer.move();
  }

});

$(".side").click(function () {
  aiPlayer.setSeed(this.dataset.seed);
  stateManager.setState(1);
  if (aiPlayer.seed === "X") {
    aiPlayer.move();
  }
});

$(".restart").click(function () {
  game.reset();
  stateManager.setState(0);
});

// To do finish implementing animated board clearing
/*
function getRand(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
};

function clearBoard() {
		var selection = getRand(0, game.gameState.length);
		$(".tile").removeClass("clicked");
		game.nodeList[selection].className += " clicked";
		game.nodeList[selection].innerHTML = "";
		clearing = setTimeout(clearBoard, 1000 / 60);
		setTimeout(function(){
			clearTimeout(clearing);
			$(".tile").removeClass("clicked");
		}, 5000);
};*/
