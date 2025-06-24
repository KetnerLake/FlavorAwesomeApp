<script>
  import Dialog from "../Dialog.svelte";  
  import Icon from "@iconify/svelte";
  import IconButton from "../IconButton.svelte";
  import Profile from "../view/Profile.svelte";  
  import Wheel from "../Wheel.svelte";

  let {
    icon = 'material-symbols:social-leaderboard-outline',
    label, 
    name, 
    onchange,
    readonly = false, 
    spokes = [], 
    value = null
  } = $props();

  let dialog = $state();

  function onDialogClose() {
    dialog.close();
  }

  function onDialogSave() {
    dialog.close();
  }

  function onProfileChange( scoring ) {
    value = [... scoring.value];
    if( onchange ) onchange( {name, value: scoring.value} );
  }

  function onProfileClick() {
    dialog.showModal();
  }
</script>

{#if readonly}
  {#if value !== null}
    <div class="label">
      <div>
        <span>
          <Icon 
            height="24" 
            icon={icon} 
            width="24" />
        </span>  
        <p>{label}</p>
      </div>
      <div class="chart">
        <Wheel {spokes} value={value === null ? [] : value} />
      </div>
    </div>
  {/if}
{:else}
  <div class="field">
    <div>
      <span>
        <Icon 
          height="24" 
          icon={icon} 
          width="24" />
      </span>  
      <p>{label}</p>
    </div>
    <button onclick={onProfileClick} type="button">
      <Wheel {spokes} value={value === null ? [] : value} />
    </button>
  </div>

  <Dialog 
    bind:this={dialog} 
    onclose={onDialogClose} 
    onsave={onDialogSave} 
    {label}>
    <Profile name="profile" onchange={onProfileChange} {spokes} {value} />
  </Dialog>
{/if}

<style>
  button {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    margin: 0 0 0 48px;
    outline: none;
    padding: 0;
    width: calc( 100% - 48px - 16px );
    -webkit-tap-highlight-color: transparent;            
  }

  div {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }

  div.chart {
    box-sizing: border-box;
    cursor: default;
    margin: 0 16px 0 48px;
    padding: 0;    
  }

  div.field,
  div.label {    
    padding: 8px 0 11px 0;
  }

  div.label {
    border-bottom: solid 1px #00000010;
  }

  div div {
    flex-direction: row;
    padding: 8px 0 8px 0;
  }    

  p {    
    box-sizing: border-box;
    color: #49454F;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    padding: 0;    
  }

  span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }      
</style>
