<script>
  export let deposits;
</script>

<table class="table is-striped">
  <thead>
    <tr>
      <th>Deposit address</th>
      <th>Transaction ID</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {#each deposits as deposit}
      <tr>
        <td>{deposit.peginAddress}</td>
        <td><a href={`https://blockstream.info/tx/${deposit.txid}`} target="_blank">{deposit.txid.substring(0, 20)}...</a></td>
        <td><button class="button is-small">CLAIM</button></td>
      </tr>
    {/each}
  </tbody>
</table>
