<script lang="ts">
  import RocketGameState, {
    type Instruction,
    type Color
  } from './rocket.svelte';

  let seed = Date.now();
  let difficulty = 0;
  let game = new RocketGameState(seed, difficulty);

  // function definitions
  let functions: { F1: Instruction[]; F2: Instruction[]; F3: Instruction[] } =
    { F1: [], F2: [], F3: [] };

  // main sequence
  let mainSeq: Instruction[] = [];

  let result: boolean | null = null;

  const colors: Color[] = ['red', 'green', 'blue'];
  const instrTypes = [
    { type: 'forward', label: 'Forward' },
    { type: 'turnLeft', label: 'Turn Left' },
    { type: 'turnRight', label: 'Turn Right' },
    { type: 'conditionalForward', label: 'Cond. Forward' }
  ];

  function rebuildMap() {
    game = new RocketGameState(seed, difficulty);
    result = null;
  }

  function addInstr(seq: Instruction[], type: string) {
    if (type === 'conditionalForward') {
      seq.push({ type: 'conditionalForward', color: colors[0] });
    } else if (type === 'forward') {
      seq.push({ type: 'forward' });
    } else if (type === 'turnLeft') {
      seq.push({ type: 'turnLeft' });
    } else if (type === 'turnRight') {
      seq.push({ type: 'turnRight' });
    }
  }

  function runGame() {
    game = new RocketGameState(seed, difficulty);
    game.setFunctions(functions);
    game.setMainSequence(mainSeq);
    result = game.run();
  }
</script>

<div class="p-6 space-y-6">
  <!-- Controls -->
  <div class="flex items-center space-x-4">
    <label class="flex items-center">
      Seed:
      <input
        type="number"
        class="ml-2 border rounded px-2 py-1 w-32"
        bind:value={seed}
      />
    </label>
    <label class="flex items-center">
      Difficulty: {difficulty}
      <input
        type="range"
        min="0"
        max="10"
        class="ml-2"
        bind:value={difficulty}
      />
    </label>
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
      on:click={rebuildMap}
    >
      New Map
    </button>
  </div>

  <!-- Function & Main editors -->
  <div class="grid grid-cols-4 gap-4">
    {#each ['F1', 'F2', 'F3', 'Main'] as name}
      <div class="border rounded p-3">
        <h2 class="font-bold mb-2">{name}</h2>
        <div class="space-y-1">
          {#if name === 'Main'}
            {#each mainSeq as instr, i}
              <div class="flex items-center justify-between">
                <span>
                  {instr.type}
                  {instr.type === 'conditionalForward'
                    ? ` (${instr.color})`
                    : ''}
                </span>
                <div class="flex items-center space-x-2">
                  {#if instr.type === 'conditionalForward'}
                    <select
                      bind:value={instr.color}
                      on:change={() =>
                        mainSeq = [...mainSeq]
                      }
                      class="border rounded px-1"
                    >
                      {#each colors as c}
                        <option value={c}>{c}</option>
                      {/each}
                    </select>
                  {/if}
                  <button
                    class="text-red-500"
                    on:click={() => {
                      mainSeq.splice(i, 1);
                      mainSeq = [...mainSeq];
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            {/each}
          {:else}
            {#each functions[name] as instr, i}
              <div class="flex items-center justify-between">
                <span>
                  {instr.type}
                  {instr.type === 'conditionalForward'
                    ? ` (${instr.color})`
                    : ''}
                </span>
                <div class="flex items-center space-x-2">
                  {#if instr.type === 'conditionalForward'}
                    <select
                      bind:value={instr.color}
                      on:change={() =>
                        functions = { ...functions }
                      }
                      class="border rounded px-1"
                    >
                      {#each colors as c}
                        <option value={c}>{c}</option>
                      {/each}
                    </select>
                  {/if}
                  <button
                    class="text-red-500"
                    on:click={() => {
                      functions[name].splice(i, 1);
                      functions = { ...functions };
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            {/each}
          {/if}
        </div>
        <div class="mt-2 space-x-1">
          {#each instrTypes as it}
            <button
              class="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              on:click={() => {
                if (name === 'Main') addInstr(mainSeq, it.type);
                else addInstr(functions[name], it.type);
              }}
            >
              {it.label}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <!-- Run & Result -->
  <div class="flex items-center space-x-4">
    <button
      class="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
      on:click={runGame}
    >
      Run
    </button>
    {#if result !== null}
      <span
        class="font-bold text-lg"
        class:text-green-600={result}
        class:text-red-600={!result}
      >
        {result
          ? 'Success! Rocket reached the goal.'
          : 'Failure. Try again.'}
      </span>
    {/if}
  </div>

  <!-- Map Display -->
	<div>
		<h3 class="font-bold mb-2">Map</h3>
		<div class="overflow-auto border rounded p-2">
			<div
				class="grid gap-[1px]"
				style="grid-template-columns: repeat({game.gameMap.width}, 36px); grid-template-rows: repeat({game.gameMap.height}, 36px);"
			>
				{#each game.gameMap.tiles as row, y}
					{#each row as tile, x}
						<div
							class="w-9 h-9 border flex items-center justify-center relative"
							style="background-color: {tile.color};"
						>
							{#if game.rocketX === x && game.rocketY === y}
								<div class="text-xl transform rotate-{game.rocketDirection * 90}">🚀</div>
							{:else if x === game.gameMap.start.x && y === game.gameMap.start.y}
								<div class="opacity-30">🚀</div>
							{:else if x === game.gameMap.goal.x && y === game.gameMap.goal.y}
								<div>🎯</div>
							{/if}
						</div>
					{/each}
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
  /* additional TailwindCSS utilities are assumed to be available */
</style>