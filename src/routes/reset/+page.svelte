<script>
  import { DexieCloud } from "$lib/DexieCloud.svelte";

  const db = new DexieCloud();

  function onResetClick() {
    const response = window.confirm( 'Are you sure you want to delete all your data?' );
    if( response ) {
      db.deleteReview().then( () => db.deleteSettings() ).then( () => window.location = '/' );
    }
  }
</script>

<button onclick={onResetClick} type="button">Reset</button>
