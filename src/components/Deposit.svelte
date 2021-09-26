<script type="typescript">
  import { peginStore, PeginInfo, Deposit } from '../stores/store';

  import PeginAddress from './PeginAddress.svelte';
  import BitcoinTransactions from './BitcoinTransactions.svelte';

  // Show deposits
  let normalizedDeposits = [];
  peginStore.subscribe((store) => {
    Object.values(store).forEach((pegin: PeginInfo) => {
      const { claimScript, peginAddress, deposits } = pegin;

      if (!Array.isArray(deposits)) return;

      deposits.forEach((deposit: Deposit) =>
        normalizedDeposits.push({
          claimScript,
          peginAddress,
          txid: deposit.txid,
        })
      );
    });
  });
</script>

<PeginAddress />

<section class="section is-medium has-text-centered">
  <h1 class="title">Bitcoin transactions</h1>
  {#if normalizedDeposits.length > 0}
    <BitcoinTransactions deposits={normalizedDeposits} />
  {:else}
    <p class="subtitle">No deposits yet. Your transactions will appear here</p>
  {/if}
</section>
