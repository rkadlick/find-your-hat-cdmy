const prompt = require('prompt-sync')({sigint: true});

class Field {
	constructor(field){
	  this.field = field
	  this.playerPosition = {x: 0, y: 0};
	}
  
	// print field on terminal for user
	print(){
	  for(let row of this.field){
		console.log(row.join(''))
	  }
	}
  
	// move players (*) direction
	movePlayer(direction){
	  let {x, y} = this.playerPosition;
  
	  // U for up, D for down, L for left, R for right
	  switch (direction) {
		case 'U':
		  y -= 1;
		  break;
		case 'D':
		  y += 1;
		  break;
		case 'L':
		  x -= 1;
		  break;
		case 'R':
		  x += 1;
		  break;
		default:
		  console.log('Invalid input! Use U, D, L, R for directions.');
		  return;
	  }
	  // checks if player moved out of boundary boxes
	  if(this.isOutOfBounds(x,y)){
		console.log('You moved out of bounds. Game Over!')
		process.exit()
	  } else if(this.field[y][x] === 'O'){
		console.log('You fell into a hole. Game Over!')
		process.exit()
	  } else if(this.field[y][x] === '^'){
		console.log("You found your hat. You Win!")
		process.exit()
	  } else {
		this.field[this.playerPosition.y][this.playerPosition.x] = '░'
		this.field[y][x] = '*'
		this.playerPosition = {x,y}
	  }
	}
  
	// established boundary in relation to field size
	isOutOfBounds(x,y){
	  return x < 0 || y < 0 || x >= this.field[0].length || y >= this.field[1].length
	}

	// begins the game, prompts the user
	playGame(){
		while(true){
			myField.print();
			const move = prompt('Which way? (U for up, D for down, L for left, R for right): ');
			myField.movePlayer(move);
		}
	}

	// generate field, place the holes (O) and hat (^) in random places
	static generateField(height, width, percentage = 0.2){
		const field = Array.from({ length: height }, () => Array.from({ length: width }, () => '░'));

		const totalCells = height*width;
		const numberOfHoles = Math.floor(totalCells * percentage)

		// create number of holes based on percentage number
		for(let i = 0; i < numberOfHoles; i++){
			let x, y;
			do {
				x = Math.floor(Math.random() * width)
				y = Math.floor(Math.random() * height)
			} while(field[y][x] !== '░' && (x === 0 && y === 0)); // hole can not appear on player start
			field[y][x] = 'O'
		}

		// place hat in random spot
		let hatX, hatY;
		do {
			hatX = Math.floor(Math.random() * width);
			hatY = Math.floor(Math.random() * height);
		} while (field[hatY][hatX] !== '░' && (hatY === 0 && hatX == 0)); // hat can not appear on player start
		field[hatY][hatX] = '^'

		// place player
		field[0][0] = '*'

		// validate field
		if(this.validate(field)){
			return field
		} else {
			this.generateField(height, width)
		}
	}

	// uses dfs search to validate if the maze can be completed
	static validate(field){
		const height = field.length;
		const width = field[0].length;
		// create array to keep track of visisted cells
		const visited = Array.from({ length: height }, () => Array(width).fill(false));

		// dfs search
		function dfs(x, y) {
			// check if current position is out of bounds, a hole, or visited
			if (x < 0 || y < 0 || x >= width || y >= height || field[y][x] === 'O' || visited[y][x]) {
			  return false;
			}
			// chck if user found hat
			if (field[y][x] === '^') {
			  return true;
			}
			// mark space as visited
			visited[y][x] = true;
			// explore all possible directions
			return dfs(x + 1, y) || dfs(x - 1, y) || dfs(x, y + 1) || dfs(x, y - 1);
		}
	  
		// start dfs at starting place
		return dfs(0, 0);	
	}
}

// generate field of size 5x5
// change numbers to change field size

const field = Field.generateField(5,5)
const myField = new Field (field)

// start game
myField.playGame();