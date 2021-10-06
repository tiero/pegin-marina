<script>
  import { createEventDispatcher } from 'svelte';

  export let deposits;

  const dispatch = createEventDispatcher();

  const notifyOnClaim = (txid, claimScript) =>
    dispatch('claim', { txid, claimScript });
</script>

<table class="table is-striped">
  <thead>
    <tr>
      <th>Deposit address</th>
      <th>Claim script</th>
      <th>Transaction ID</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {#each deposits as deposit}
      <tr>
        <td>{deposit.peginAddress}</td>
        <td>{deposit.claimScript}</td>
        <td>
          <a
            href={`https://blockstream.info/tx/${deposit.txid}`}
            target="_blank"
          >
            {deposit.txid.substring(0, 10)}...{deposit.txid.substring(
              deposit.txid.length - 10,
              deposit.txid.length
            )}
          </a>
        </td>
        <td
          ><button
            class="button is-small"
            on:click={() => notifyOnClaim(deposit.txid, deposit.claimScript)}
            >CLAIM</button
          ></td
        >
      </tr>
    {/each}
  </tbody>
</table>
