(function() {
	var boardLib = window.boardLib = (window.boardLib || {});
  
	var Board = boardLib.Board = function() {
		this.dimension = 8;
    this.renderBoard();
    this.renderGems();
    this.clickedGems = [];
	};
  
	Board.prototype.renderBoard = function() {
		for (var i = 0; i < this.dimension; i++) {
			for (var j = 0; j < this.dimension; j++) {
				var idName = 'row'+i+'col'+(this.dimension-1-j);
				$(".board").prepend("<div id="+idName+" class='tile'></div>");
			}
		}
	};
  


	Board.prototype.renderGems = function() {
    this.gemList = ["red", "green", "yellow", "silver", "orange", "pink"];    
		var that = this;
    for (var i = 0; i < this.dimension; i++) {
			for (var j = 0; j < this.dimension; j++) {
				var idName = '#'+'row'+i+'col'+(this.dimension-1-j);
				
        var gem = this.gemList[Math.floor((Math.random()*5))];
        $(idName).addClass(gem);
			}
		}
	};
  
  Board.prototype.handleClick = function(event) {
    var gem = $(event.currentTarget)
    
    var gem_color = $(event.currentTarget).attr("class").split(" ")[1]
    if (this.clickedGems.length == 2) {
      this.clearClickedGems();
    }
    
    if (this.clickedGems.length < 1) {
      this.clickedGems.push(gem);
    }
    else if (this.clickedGems.length == 1) {
      // push the gem in the array
      this.clickedGems.push(gem);
      
      // check the gems to see if we should switch
      this.checkGems();
    }
  };
  
  Board.prototype.checkGems = function() {
    var gem1 = this.clickedGems[0];
    var gem2 = this.clickedGems[1];
    
    // first check if the gems are next to each other
    if (this.checkGemsLocation(gem1, gem2)) {
      this.checkGemSwitch(gem1, gem2);
    }
  };
  
  Board.prototype.clearClickedGems = function() {
    this.clickedGems = [];
  };
  
  Board.prototype.checkGemsLocation = function(gem1, gem2) {
    var gem1_location = gem1.attr("id").split("row")[1].split("col");
    var gem2_location = gem2.attr("id").split("row")[1].split("col");
    if (gem1_location[0] != gem2_location[0] && gem1_location[1] != gem2_location[1]) {
      return false;
      this.clearClickedGems();
    }
    else {
      if (gem1_location[0] == gem2_location[0]) {
        return (Math.abs(gem1_location[1] - gem2_location[1]) == 1)
      }
      else if (gem1_location[1] == gem2_location[1]) {
        return (Math.abs(gem1_location[0] - gem2_location[0]) == 1)
      }
    }
  };
  
	Board.prototype.checkGemSwitch = function(gem1, gem2) {
    var gem1_color = $(gem1).attr("class").split(" ")[1]
    var gem2_color = $(gem2).attr("class").split(" ")[1]
    
    $(gem1).removeClass(gem1_color).addClass(gem2_color);
    $(gem2).removeClass(gem2_color).addClass(gem1_color);
    this.checkGemline(gem1, gem2);
	};
  
  // come back here
  Board.prototype.checkGemline = function(gem1, gem2) {
    debugger
  };

})(this);