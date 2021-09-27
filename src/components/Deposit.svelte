<script type="typescript">
  import ElementsPegin from 'pegin';

  import { peginStore, PeginInfo, Deposit } from '../stores/store';

  import PeginAddress from './PeginAddress.svelte';
  import BitcoinTransactions from './BitcoinTransactions.svelte';

  const onClaim = async (evt) => {
    const {txid, claimScript} = evt.detail;
    console.log(txid, claimScript)
    // initialize the module
    const peginModule = new ElementsPegin(
      await ElementsPegin.withGoElements(),
      await ElementsPegin.withLibwally()
    );

    // retrieve the raw bitcoin transaction hex encoded and the merkle block proof

    const response = await fetch(`https://blockstream.info/api/tx/${txid}/hex`);
    const btcTxHex = await response.text();

    const response2 = await fetch(`https://blockstream.info/api/tx/${txid}/merkleblock-proof`);
    const btcTxOutProof = await response2.text();
    
    //pass them along the Liquid script used to generate the pegin address
    let claimTx = await peginModule.claimTx(
      btcTxHex,
      btcTxOutProof,
      claimScript
    );

    console.log(claimTx)

   /*  const response3 = await fetch(
      `https://blockstream.info/liquid/api/tx/push`, 
      {
        method: `POST`, 
        body: claimTx
      }
    ); */
  };

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

<section class="section is-small has-text-centered">
  <h1 class="title">Bitcoin transactions</h1>
  {#if normalizedDeposits.length > 0}
    <BitcoinTransactions deposits={normalizedDeposits} on:claim={onClaim} />
  {:else}
    <p class="subtitle">No deposits yet. Your transactions will appear here</p>
  {/if}
</section>
