export type Color = 'red' | 'green' | 'blue';

export type Instruction =
	| { type: 'forward' }
	| { type: 'turnLeft' }
	| { type: 'turnRight' }
	| { type: 'conditionalForward'; color: Color }
	| { type: 'call'; functionName: 'F1' | 'F2' | 'F3' };

export interface FunctionsMap {
	F1: Instruction[];
	F2: Instruction[];
	F3: Instruction[];
}

export interface MapTile {
	color: Color;
}

export interface GameMap {
	width: number;
	height: number;
	tiles: MapTile[][];
	start: { x: number; y: number };
	goal: { x: number; y: number };
}

export default class RocketGameState {
	private seed: number;
	private difficulty: number;
	public gameMap: GameMap;
	private functions: FunctionsMap;
	private mainSequence: Instruction[];

	constructor(seed = Date.now(), difficulty = 0) {
		this.seed = seed;
		this.difficulty = difficulty;
		this.functions = { F1: [], F2: [], F3: [] };
		this.mainSequence = [];
		this.gameMap = this.generateMap();
	}

	private random(): number {
		// simple LCG PRNG
		const a = 1664525,
			c = 1013904223;
		this.seed = (a * this.seed + c) | 0;
		return (this.seed >>> 0) / 0x100000000;
	}

	private generateMap(): GameMap {
		const width = 5 + this.difficulty * 2;
		const height = 5 + this.difficulty * 2;
		const tiles: MapTile[][] = [];

		// fill with random colors
		for (let y = 0; y < height; y++) {
			tiles[y] = [];
			for (let x = 0; x < width; x++) {
				const c: Color[] = ['red', 'green', 'blue'];
				tiles[y][x] = { color: c[Math.floor(this.random() * 3)] };
			}
		}

		// carve a simple path from left to right at middle row
		const pathY = Math.floor(height / 2);
		for (let x = 0; x < width; x++) {
			// re-color path with random colors so conditional logic matters
			const c: Color[] = ['red', 'green', 'blue'];
			tiles[pathY][x].color = c[Math.floor(this.random() * 3)];
		}

		return {
			width,
			height,
			tiles,
			start: { x: 0, y: pathY },
			goal: { x: width - 1, y: pathY },
		};
	}

	public setFunctions(funcs: FunctionsMap) {
		this.functions = funcs;
	}

	public setMainSequence(seq: Instruction[]) {
		this.mainSequence = seq;
	}

	public run(): boolean {
		let dir = 0; // 0=→,1=↓,2=←,3=↑
		let pos = { ...this.gameMap.start };

		const getAheadTile = (): MapTile | null => {
			const p = { ...pos };
			if (dir === 0) p.x++;
			if (dir === 1) p.y++;
			if (dir === 2) p.x--;
			if (dir === 3) p.y--;
			if (
				p.x < 0 ||
				p.x >= this.gameMap.width ||
				p.y < 0 ||
				p.y >= this.gameMap.height
			)
				return null;
			return this.gameMap.tiles[p.y][p.x];
		};

		const moveAhead = (): boolean => {
			const p = { ...pos };
			if (dir === 0) p.x++;
			if (dir === 1) p.y++;
			if (dir === 2) p.x--;
			if (dir === 3) p.y--;
			if (
				p.x < 0 ||
				p.x >= this.gameMap.width ||
				p.y < 0 ||
				p.y >= this.gameMap.height
			)
				return false;
			pos = p;
			return true;
		};

		const exec = (instr: Instruction): boolean => {
			switch (instr.type) {
				case 'forward':
					return moveAhead();
				case 'conditionalForward':
					const ahead = getAheadTile();
					if (ahead && ahead.color === instr.color) {
						return moveAhead();
					}
					return false;
				case 'turnLeft':
					dir = (dir + 3) % 4;
					return true;
				case 'turnRight':
					dir = (dir + 1) % 4;
					return true;
				case 'call':
					const fn = this.functions[instr.functionName];
					for (const i of fn) {
						if (!exec(i)) return false;
					}
					return true;
			}
		};

		for (const step of this.mainSequence) {
			if (!exec(step)) return false;
		}

		// check if on goal
		return (
			pos.x === this.gameMap.goal.x && pos.y === this.gameMap.goal.y
		);
	}
}