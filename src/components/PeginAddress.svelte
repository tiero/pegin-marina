<script type="typescript">
  import { peginStore } from '../stores/store';

  import ElementsPegin from 'pegin';
  import { address, networks } from 'liquidjs-lib';

  import QrCode from 'svelte-qrcode';

  let generatedAddresses = [];
  peginStore.subscribe((value) => {
    generatedAddresses = Object.keys(value);
  });

  let isLoadingButton = false;
  let claimScript, peginAddress;

  // get a pegin address to deposit Bitcoin
  const getPeginAddress = async () => {
    isLoadingButton = true;

      // initialize the module
    const peginModule = new ElementsPegin(
      await ElementsPegin.withGoElements(),
      await ElementsPegin.withLibwally()
    );

    const network = await window.marina.getNetwork();
    const addrObj = await window.marina.getNextAddress();

    

    claimScript = address
      .toOutputScript(addrObj.confidentialAddress, networks[network])
      .toString('hex');

    if (!claimScript || claimScript.length === 0) return;

    try {
      peginAddress = await peginModule.getMainchainAddress(claimScript);
      console.log(network, addrObj, claimScript, peginAddress)

      peginStore.update((store) => {
        return {
          ...store,
          [peginAddress]: {
            peginAddress,
            claimScript,
            deposits: [],
          },
        };
      });
    } catch (e) {
      console.error(e);
    }

    isLoadingButton = false;
  };

  const showAddress = async (index: number) => {
    peginAddress = generatedAddresses[index];
  };
</script>

<section class="section">
  {#if peginAddress && peginAddress.length > 0}
    <p>Bitcoin peg-in address</p>
    <p class="subtitle">{peginAddress}</p>
    <QrCode value={peginAddress} />
  {/if}
</section>
<section class="section">
  <h1 class="title">Peg-in addresses</h1>

  {#if generatedAddresses.length === 0}
    <p class="subtitle">
      No peg-in addresses yet, after you generate one it will appear here
    </p>
  {/if}

  {#each generatedAddresses as peginAddr, index}
    <div class="box">
      {peginAddr}
      <!-- svelte-ignore a11y-missing-attribute -->
      <a on:click={() => showAddress(index)}>🔍</a>
    </div>
  {/each}

  <button 
    class="button is-primary {isLoadingButton && 'is-loading'}" 
    on:click={getPeginAddress}
  >
    Generate with Marina
  </button>
</section>
