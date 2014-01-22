(function() {
	var boardLib = window.boardLib = (window.boardLib || {});
  
	var Board = boardLib.Board = function() {
		this.dimension = 8;
    this.renderBoard();
    this.renderGems();
    this.clickedGems = [];
    this.score = 0;
    this.renderScore();
	};
  
  Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };

  Array.prototype.min = function() {
    return Math.min.apply(null, this);
  };
  
  Board.prototype.renderBoard = function() {
		for (var i = 0; i < this.dimension; i++) {
			for (var j = 0; j < this.dimension; j++) {
				var idName = 'row'+i+'col'+(this.dimension-1-j);
				$(".board").prepend("<div id="+idName+" class='tile'></div>");
			}
		}
	};
  
  Board.prototype.renderScore = function() {
    $(".score").html(this.score);
  };

	Board.prototype.renderGems = function() {
    this.gemList = ["red", "green", "yellow", "silver", "orange", "pink"];    
		var that = this;
    for (var i = 0; i < this.dimension; i++) {
			for (var j = 0; j < this.dimension; j++) {
				var idName = '#'+'row'+i+'col'+(this.dimension-1-j);
        var gem = this.gemList[Math.floor((Math.random()*5))];
        $(idName).addClass(gem);
        
        while (!this.noGemLine($(idName))) {
          $(idName).removeClass(gem);
          gem = this.gemList[Math.floor((Math.random()*5))];
          $(idName).addClass(gem);
        }
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
    
    if (this.noGemLine(gem1) && this.noGemLine(gem2)) {
      alert("you can't switch those gems!")
      $(gem1).removeClass(gem2_color).addClass(gem1_color);
      $(gem2).removeClass(gem1_color).addClass(gem2_color);
    }
    else {
      this.increaseScore(3);
      this.checkGemLine(gem2);
      this.checkGemLine(gem1);
    }
	};
  
  Board.prototype.increaseScore = function(numPoints) {
    this.score += numPoints;
    console.log(this.score)
  };
  
  Board.prototype.checkGemLine = function(gem) {

    var gem_location = gem.attr("id").split("row")[1].split("col");
    var gem_color = gem.attr("class").split(" ")[1];
    var foundGemLine = ["#"+gem.attr("id")];
    var checkGemLine = [[], [], [], [], [], []];

    for (var i = 1; i < 3; i++) {
      var idName = '#'+'row'+(parseInt(gem_location[0])+i)+'col'+gem_location[1];
      if ($(idName).length != 0) {
        checkGemLine[0].push([$(idName).attr("class").split(" ")[1], idName]);
      }
    }
    
    for (var i = 1; i < 3; i++) {
      var idName = '#'+'row'+(parseInt(gem_location[0])-i)+'col'+gem_location[1];
      if ($(idName).length != 0) {
        checkGemLine[1].push([$(idName).attr("class").split(" ")[1], idName]);
      }
    }
    
    for (var i = 1; i < 3; i++) {
      var idName = '#'+'row'+gem_location[0]+'col'+(parseInt(gem_location[1])-i);
      if ($(idName).length != 0) {
        checkGemLine[2].push([$(idName).attr("class").split(" ")[1], idName]);
      }  
    }
    
    for (var i = 1; i < 3; i++) {
      var idName = '#'+'row'+gem_location[0]+'col'+(parseInt(gem_location[1])+i);
      if ($(idName).length != 0) {
        checkGemLine[3].push([$(idName).attr("class").split(" ")[1], idName]);
      }
    }
    
    // check for the cases when the gem is in the middle
    var idName1 = '#'+'row'+(parseInt(gem_location[0])-1)+'col'+gem_location[1];
    var idName2 = '#'+'row'+(parseInt(gem_location[0])+1)+'col'+gem_location[1];
    
    if ($(idName1).length != 0) {
      checkGemLine[4].push([$(idName1).attr("class").split(" ")[1], idName1]);
    }
    if ($(idName2).length != 0) {
      checkGemLine[4].push([$(idName2).attr("class").split(" ")[1], idName2]);
    }
    
    var idName3 = '#'+'row'+gem_location[0]+'col'+(parseInt(gem_location[1])-1);
    var idName4 = '#'+'row'+gem_location[0]+'col'+(parseInt(gem_location[1])+1);
    if ($(idName3).length != 0) {
      checkGemLine[5].push([$(idName3).attr("class").split(" ")[1], idName3]);
    }
    if ($(idName4).length != 0) {
      checkGemLine[5].push([$(idName4).attr("class").split(" ")[1], idName4]);
    }
    
    // now check the checkGemLine array to see if any of them are gem lines
    for (var i = 0; i < checkGemLine.length; i++) {
      if (checkGemLine[i].length >= 2) {
        if ((checkGemLine[i][0][0] == checkGemLine[i][1][0]) && (checkGemLine[i][1][0] == gem_color)) {
          foundGemLine.push(checkGemLine[i][0][1]);
          foundGemLine.push(checkGemLine[i][1][1]);
          if ((foundGemLine.length != 1) && this.moreGems(foundGemLine, gem_color).length == 0) {
            this.removeGems(foundGemLine);
          }
          else if ((foundGemLine.length != 1) && this.moreGems(foundGemLine, gem_color).length != 0) {
            this.increaseScore(this.moreGems(foundGemLine, gem_color).length);
            this.removeGems(foundGemLine);
            this.removeGems(this.moreGems(foundGemLine, gem_color));
          }
        }
      }
    }
  };
  
  Board.prototype.moreGems = function(foundGemLine, gem_color) {
    var gemLocations = [];
    var x_coords = [];
    var y_coords = [];
    var newGems = [];
    foundGemLine.forEach(function(idName) {
      gemLocations.push(idName.split("row")[1].split("col"));
    });
    
    gemLocations.forEach(function(coordinates) {
      x_coords.push(parseInt(coordinates[1]));
      y_coords.push(parseInt(coordinates[0]));
    });
    
    if (gemLocations[0][0] == gemLocations[1][0]) {
      console.log("a row, changing 1 index")
      for (var i = 1; i < 7; i++) { 
        var idName1 = '#'+'row'+gemLocations[1][0]+'col'+(x_coords.max()+i);
        
        if ($(idName1).length != 0) {
          if ($(idName1).attr("class").split(" ")[1] == gem_color) {
            newGems.push(idName1);
            
          }
          else {
            break
          } 
        }
      }
      
      for (var i = 1; i < 7; i++) {
        var idName2 = '#'+'row'+gemLocations[1][0]+'col'+(x_coords.min()-i);
        if ($(idName2).length != 0) {
          if ($(idName2).attr("class").split(" ")[1] == gem_color) {
            newGems.push(idName2);
            
          }
          else {
            break
          }
        }
      }

    }
    else {
      console.log("a col, changing 0 index")
      for (var i = 1; i < 7; i++) { 
        var idName1 = '#'+'row'+(y_coords.max()+i)+'col'+gemLocations[1][1];
        if ($(idName1).length != 0) {
          if ($(idName1).attr("class").split(" ")[1] == gem_color) {
            newGems.push(idName1);
            
          }
          else {
            break
          }
        }
        
        var idName2 = '#'+'row'+(y_coords.min()-i)+'col'+gemLocations[1][1];
        if ($(idName2).length != 0) {
          if ($(idName2).attr("class").split(" ")[1] == gem_color) {
            newGems.push(idName2);
            
          }
          else {
            break
          }
        }
      }
    }
    return newGems;
    
  };
  
  Board.prototype.noGemLine = function(gem) {

    var gem_location = gem.attr("id").split("row")[1].split("col");
    var gem_color = gem.attr("class").split(" ")[1];
    var foundGemLine = ["#"+gem.attr("id")];
    var checkGemLine = [[], [], [], [], [], []];

    for (var i = 1; i < 3; i++) {
      var idName = '#'+'row'+(parseInt(gem_location[0])+i)+'col'+gem_location[1];
      if ($(idName).length != 0) {
        checkGemLine[0].push([$(idName).attr("class").split(" ")[1], idName]);
      }
    }
    
    for (var i = 1; i < 3; i++) {
      var idName = '#'+'row'+(parseInt(gem_location[0])-i)+'col'+gem_location[1];
      if ($(idName).length != 0) {
        checkGemLine[1].push([$(idName).attr("class").split(" ")[1], idName]);
      }
    }
    
    for (var i = 1; i < 3; i++) {
      var idName = '#'+'row'+gem_location[0]+'col'+(parseInt(gem_location[1])-i);
      if ($(idName).length != 0) {
        checkGemLine[2].push([$(idName).attr("class").split(" ")[1], idName]);
      }  
    }
    
    for (var i = 1; i < 3; i++) {
      var idName = '#'+'row'+gem_location[0]+'col'+(parseInt(gem_location[1])+i);
      if ($(idName).length != 0) {
        checkGemLine[3].push([$(idName).attr("class").split(" ")[1], idName]);
      }
    }
    
    // check for the cases when the gem is in the middle
    var idName1 = '#'+'row'+(parseInt(gem_location[0])-1)+'col'+gem_location[1];
    var idName2 = '#'+'row'+(parseInt(gem_location[0])+1)+'col'+gem_location[1];
    if ($(idName1).length != 0) {
      checkGemLine[4].push([$(idName1).attr("class").split(" ")[1], idName1]);
    }
    if ($(idName2).length != 0) {
      checkGemLine[4].push([$(idName2).attr("class").split(" ")[1], idName2]);
    }
    
    var idName3 = '#'+'row'+gem_location[0]+'col'+(parseInt(gem_location[1])-1);
    var idName4 = '#'+'row'+gem_location[0]+'col'+(parseInt(gem_location[1])+1);
    if ($(idName3).length != 0) {
      checkGemLine[5].push([$(idName3).attr("class").split(" ")[1], idName3]);
    }
    if ($(idName4).length != 0) {
      checkGemLine[5].push([$(idName4).attr("class").split(" ")[1], idName4]);
    }
    
    // now check the checkGemLine array to see if any of them are gem lines
    for (var i = 0; i < checkGemLine.length; i++) {
      if (checkGemLine[i].length == 2) {
        
        if ((checkGemLine[i][0][0] == checkGemLine[i][1][0]) && (checkGemLine[i][1][0] == gem_color)) {
          
    
          foundGemLine.push(checkGemLine[i][0][1]);
          foundGemLine.push(checkGemLine[i][1][1]);
        }
      }
    }
    
    if (foundGemLine.length <= 1) {
      return true;
    }
    else {
      return false;
    }
  };
  
  Board.prototype.removeGems = function(foundGemLine) {    
    var gemLocations = [];
    foundGemLine.forEach(function(coordinates) {
    gemLocations.push(coordinates.split("row")[1].split("col"));
    });
    
    if (gemLocations.length == 1) {
      this.replaceGems(gemLocations[0], 1);
    }
    
    // if the gems are in the same column
    if (gemLocations[0][1] == gemLocations[1][1] && gemLocations[1][1] == gemLocations[2][1]) {
      this.replaceGems(gemLocations[1], 3);
 
      console.log("replacing gems in a column")
    }
    // else if the gems are in the same row
    else {
      this.replaceGems(gemLocations[0], 1);
      this.replaceGems(gemLocations[1], 1);
      this.replaceGems(gemLocations[2], 1);

      console.log("replacing gems in a row")
    }
  };
  
  Board.prototype.replaceGems = function(loc, numGems) {
    
    var gem_row = parseInt(loc[0]);
    var gem_col = parseInt(loc[1]);
    var gem_to_replace = 8 - gem_row;
    
    for (var i = 0; i < gem_to_replace; i++) {
      var gem1 = '#'+'row'+(parseInt(loc[0])+i)+'col'+loc[1];
      var gem1_color = $(gem1).attr("class").split(" ")[1];
      var gem2 = '#'+'row'+(parseInt(loc[0])+numGems+i)+'col'+loc[1];
      
      if ($(gem2).length != 0) {
        var gem2_color = $(gem2).attr("class").split(" ")[1];
        $(gem1).removeClass(gem1_color).addClass(gem2_color);  

        
      }
      else {
        var randomGem = this.gemList[Math.floor((Math.random()*5))];
        $(gem1).removeClass(gem1_color).addClass(randomGem);
      }
    }
    
    this.checkNewGems(loc);
  };
  
  Board.prototype.checkNewGems = function(loc) {
    
    var gem_row = parseInt(loc[0]);
    var gem_col = parseInt(loc[1]);
    var gem_to_replace = 8 - gem_row;
    
    for (var i = 0; i < gem_to_replace; i++) {
      var gem = '#'+'row'+(parseInt(loc[0])+i)+'col'+loc[1];
      
      this.checkGemLine($(gem));
    }
    // this.gameOver();
  };

})(this);