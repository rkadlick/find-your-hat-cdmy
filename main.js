const prompt = require('prompt-sync')({sigint: true});

class Field {
	constructor(field){
	  this.field = field
	  this.playerPosition = {x: 0, y: 0};
	}
  
	print(){
	  for(let row of this.field){
		console.log(row.join(''))
	  }
	}
  
	movePlayer(direction){
	  let {x, y} = this.playerPosition;
  
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
  
	isOutOfBounds(x,y){
	  return x < 0 || y < 0 || x >= this.field[0].length || y >= this.field[1].length
	}

	playGame(){
		while(true){
			myField.print();
			const move = prompt('Which way? (U for up, D for down, L for left, R for right): ');
			myField.movePlayer(move);
		}
	}

	static generateField(height, width, percentage = 0.2){
		const field = Array.from({ length: height }, () => Array.from({ length: width }, () => '░'));

		const totalCells = height*width;
		const numberOfHoles = Math.floor(totalCells * percentage)

		for(let i = 0; i < numberOfHoles; i++){
			let x, y;
			do {
				x = Math.floor(Math.random() * width)
				y = Math.floor(Math.random() * height)
			} while(field[y][x] !== '░' && (x === 0 && y === 0));
			field[y][x] = 'O'
		}

		let hatX, hatY;
		do {
			hatX = Math.floor(Math.random() * width);
			hatY = Math.floor(Math.random() * height);
		} while (field[hatY][hatX] !== '░' && (hatY === 0 && hatX == 0));
		field[hatY][hatX] = '^'

		field[0][0] = '*'

		if(this.validate(field)){
			return field
		} else {
			this.generateField(height, width)
		}
	}

	static validate(field){
		const height = field.length;
		const width = field[0].length;
		const visited = Array.from({ length: height }, () => Array(width).fill(false));

		function dfs(x, y) {
			if (x < 0 || y < 0 || x >= width || y >= height || field[y][x] === 'O' || visited[y][x]) {
			  return false;
			}
			if (field[y][x] === '^') {
			  return true;
			}
			visited[y][x] = true;
			return dfs(x + 1, y) || dfs(x - 1, y) || dfs(x, y + 1) || dfs(x, y - 1);
		}
	  
		return dfs(0, 0);	
	}
}

const field = Field.generateField(5,5)
const myField = new Field (field)

myField.playGame();