<script lang="ts">
  import { onMount } from 'svelte';
	import type { PageProps } from './$types';

  let iframe: HTMLIFrameElement;
  let gameToken = $state<string>();
  let gameStatus = $state('waiting');

	const { data }: PageProps = $props();

  onMount(() => {
    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  });

  function handleGameMessage(event: MessageEvent) {
    const message = event.data as GameMessage;

    // Verify message token
    if (gameToken && message.token !== gameToken) {
      console.error('Invalid game token received');
      return;
    }

    switch (message.type) {
      case 'GAME_COMPLETE':
        gameStatus = 'completed';
        // Handle completion
        break;
      case 'GAME_FAILED':
        gameStatus = 'failed';
        // Handle failure
        break;
      case 'CHEAT_DETECTED':
        handleCheatDetected(message.payload);
        break;
      case 'STATE_UPDATE':
        // Handle state updates
        break;
    }
  }

  function handleCheatDetected(payload: any) {
    // alert('Nice try buddy! 😉');
    // You could also:
    // - Log the attempt
    // - Disable the challenge
    // - Report to your backend
  }

  function startGame() {
    gameToken = crypto.randomUUID();
    iframe.contentWindow?.postMessage({
      type: 'GAME_START',
      token: gameToken,
      timestamp: new Date().toISOString()
    }, '*');
  }

  function stopGame() {
    iframe.contentWindow?.postMessage({
      type: 'GAME_STOP',
      token: gameToken,
      timestamp: new Date().toISOString()
    }, '*');
  }
</script>

<div style="height: calc(100dvh - 9rem);">
  <div class="controls">
    <button onclick={startGame}>Start Challenge</button>
    <button onclick={stopGame}>Stop Challenge</button>
  </div>

  <iframe
    bind:this={iframe}
    title="challenge"
    src={data.step.content}
    class="w-full h-full"
    sandbox="allow-scripts"
  ></iframe>

  {#if gameStatus === 'completed'}
    <div class="success-message">
      Challenge completed! 🎉
    </div>
  {/if}
</div>

<style>
	:global(main) {
		margin: 0 !important;
		max-width: none !important;

		& .container.mx-auto {
			margin: 0 !important;
			max-width: none !important;
			height: 100% !important;
		}
	}
</style>