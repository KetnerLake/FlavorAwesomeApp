<script>
  import IconButton from "./IconButton.svelte";

  let {children, label, onclose, onsave} = $props();

  let dialog = $state();

  function onCloseClick() {
    if( onclose ) {
      onclose();
    } else {
      close();
    }    
  }

  export function close() {
    dialog.close();
  }

  export function showModal() {
    dialog.showModal();
  }
</script>

<dialog bind:this={dialog}>
  <header>
    <IconButton name="material-symbols:close" onclick={onCloseClick} --icon-button-color="var( --primary-accent-color )" />
    <h3>{label}</h3>
    <button onclick={onsave} type="button">Save</button>
  </header>
  {@render children?.()}
</dialog>

<style>
  dialog {
    align-items: center;
    background: rgb( from var( --primary-accent-color ) r g b / 0.12 );
    border: none;
    border-radius: 0;
    box-sizing: border-box;
    flex-direction: column;    
    height: 100%;
    max-height: 100%;
    max-width: 430px;
    opacity: 1.0;
    overflow: hidden;
    padding: 0;
    width: 100%;
  }

  dialog::backdrop {
    background: #f8f8f8;
  }

  dialog[open] {
    display: flex;
  }

  dialog h3 {
    box-sizing: border-box;
    color: var( --primary-accent-color );
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 28px;
    margin: 0;
    padding: 0;
  }

  dialog header {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 12px 4px 12px 4px;
    width: 100%;
  }

  dialog header button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var( --primary-accent-color );
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    justify-content: center;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    outline: none;
    padding: 10px 12px 10px 12px;
    -webkit-tap-highlight-color: transparent;            
  }   
</style>
