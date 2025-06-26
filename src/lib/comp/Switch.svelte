<script>
  import Icon from "@iconify/svelte";

  let {label, onchange, selected = false} = $props();

  function onButtonClick() {
    selected = !selected;
    if( onchange ) onchange( selected );
  }
</script>

<div>
  {#if label}
    <p>{label}</p>
  {/if}
  <button 
    aria-label="Toggle" 
    class:selected 
    onclick={onButtonClick} 
    type="button">
    <span>
      {#if selected}
        <Icon height="16" icon="material-symbols:check-rounded" width="16" />
      {/if}
    </span>
  </button>
</div>

<style>
  button {
    align-items: center;
    appearance: none;
    background: #00000010;
    border-color: var( --secondary-text-color );
    border-radius: 32px;
    border-style: solid;
    border-width: 2px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 32px;
    justify-content: flex-start;
    padding: 0 3px 0 7px;
    outline: none;
    margin: 0;
    width: 52px;
  }

  button.selected {
    background: var( --primary-accent-color );
    border-color: var( --primary-accent-color );
    justify-content: flex-end;
  }

  button span {
    align-items: center;
    background: var( --secondary-text-color );
    border-radius: 16px;
    box-sizing: border-box;
    color: var( --primary-accent-color );
    display: flex;
    height: 16px;
    justify-content: center;
    width: 16px;
  }

  button.selected span {
    background: #ffffff;
    border-radius: 24px;
    height: 24px;
    width: 24px;
  }

  div {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  p {
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 20px;
    margin: 0;
    padding: 0;
  }
</style>
