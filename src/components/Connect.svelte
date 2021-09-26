<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { detectProvider } from 'marina-provider';
  const dispatch = createEventDispatcher();

  $: installed = false;
  $: enabled = false;

  const connect = async () => {
    await window.marina.enable();
  };

  const notifyEnabled = () => {
    dispatch('status', { enabled: true });
  };

  const notifyDisabled = () => {
    dispatch('status', { enabled: false });
  };

  onMount(async () => {
    const marina = await detectProvider('marina');

    if (!marina) return;
    installed = true;

    if (await marina.isEnabled()) {
      enabled = true;
      notifyEnabled();
    }

    // Start listening to ENABLED and DISABLED events and binds to the state
    await marina.on('ENABLED', () => {
      enabled = true;
      notifyEnabled();
    });

    await marina.on('DISABLED', () => {
      enabled = false;
      notifyDisabled();
    });
  });
</script>

{#if !installed}
  <button
    class="button"
    on:click={() => window.open('https://vulpem.com/marina')}
  >
    Install Marina
  </button>
{:else if !enabled}
  <button class="button" on:click={connect}> Connect with Marina </button>
{/if}
