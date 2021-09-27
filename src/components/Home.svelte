<script type="typescript">
  import { peginStore } from '../stores/store';

  import Connect from './Connect.svelte';
  import Deposit from './Deposit.svelte';
  let marinaIsEnabled = false;

  const handleMarinaStatus = (event) => {
    marinaIsEnabled = event.detail.enabled;
  };

  let watchers = {};
  // Subscribe to new pegin address to be watched
  peginStore.subscribe((store) => {
    Object.keys(store).forEach((peginAddr) => {
      if (Object.prototype.hasOwnProperty.call(watchers, peginAddr)) return;

      watchers[peginAddr] = setInterval(async () => {
        console.log(`I am watching ${peginAddr}`);
        const response = await fetch(
          `https://blockstream.info/api/address/${peginAddr}/utxo`
        );
        const json = await response.json();

        if (Array.isArray(json) && json.length > 0) {
          console.log(`Found ${json.length} utxos for ${peginAddr}`);
          peginStore.update((store) => {
            return {
              ...store,
              [peginAddr]: {
                ...store[peginAddr],
                deposits: json,
              },
            };
          });
        }
      }, 10000);
    });
  });
</script>

<div class="container is-fluid main">
  <h1 class="title">L-BTC Peg-in</h1>
  <h2 class="subtitle">Deposit BTC to get L-BTC in your Marina wallet</h2>

  {#if marinaIsEnabled}
    <Deposit />
  {:else}
    <Connect on:status={handleMarinaStatus} />
  {/if}
</div>

<style>
  .main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
  }

  @media (min-width: 640px) {
    .main {
      max-width: none;
    }
  }
</style>
