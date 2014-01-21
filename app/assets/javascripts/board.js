(function() {
	var boardLib = window.boardLib = (window.boardLib || {});
  
	var Board = boardLib.Board = function() {
		this.dimension = 8;
    this.renderBoard();
    this.renderGems();
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
  
	

})(this);