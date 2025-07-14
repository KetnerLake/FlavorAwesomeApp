<script>
  import Calendar from "../view/Calendar.svelte";  
  import Dialog from "../Dialog.svelte";  
  import Icon from "@iconify/svelte";
  import LabelField from "./LabelField.svelte";

  let {
    label, 
    name, 
    onchange, 
    placeholder, 
    readonly = false, 
    value = null
  } = $props();

  let dialog = $state();
  let calendar = $derived.by( () => {
    if( value === null ) {
      return new Date();
    }

    return value;
  } );

  let date = $derived.by( () => {
    if( value !== null ) {
      return new Intl.DateTimeFormat( navigator.language, {
        day: 'numeric',
        month: 'short',
        weekday: 'short',
        year: 'numeric'
      } ).format( value );      
    } else {
      return '';
    }
  } );

  function onDialogClose() {
    calendar = new Date();
    dialog.close();
  }

  function onDialogSave() {
    value = new Date( calendar.getTime() );
    dialog.close();
    calendar = new Date();
    if( onchange ) onchange( {name, value} );    
  }
</script>

{#if readonly}
  {#if value}
    <LabelField 
      icon="material-symbols:calendar-month-outline" 
      {label} 
      value={date} />
  {/if}
{:else}
  <div>
    <span>
      <Icon 
        height="24" 
        icon="material-symbols:calendar-month-outline" 
        width="24" />
    </span>    
    <button onclick={() => dialog.showModal()} type="button">
      <p>
        <span>{label}</span>                
        <span class:placeholder={!value && placeholder}>
          {#if value}
            {date}
          {:else}
            {placeholder ? placeholder : ''}
          {/if}        
        </span>
      </p>
    </button>
  </div>

  <Dialog bind:this={dialog} onclose={onDialogClose} onsave={onDialogSave}>
    <Calendar
      name="date"
      {label}
      value={calendar} />
  </Dialog>
{/if}

<style>
  button {
    align-items: center;
    appearance: none;
    background: none;
    border-color: var( --secondary-text-color );
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-basis: 0;
    flex-direction: row;
    flex-grow: 1;
    gap: 12px;
    margin: 0;
    outline: none;
    padding: 8px 4px 6px 0;
    -webkit-tap-highlight-color: transparent;                
  }

  button:focus {
    border-color: var( --primary-accent-color );    
    box-shadow: 0 0 0 3px rgb( from var( --primary-accent-color ) r g b / 0.38 );
  }  

  button p {
    box-sizing: border-box;
    cursor: pointer;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-weight: 400;
    margin: 0;
    padding: 0 0 0 16px;
    text-align: left;
  }

  button p span {
    display: block;
  }

  button p span:first-of-type {
    color: var( --secondary-text-color );
    font-size: 12px;
    letter-spacing: 0.50px;
    line-height: 16px;
  }

  button p span:last-of-type {
    color: var( --primary-text-color );
    font-size: 16px;
    letter-spacing: 0.50px;
    line-height: 24px;
  }

  button p span.placeholder {
    color: #16161640;
  }

  div {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 0 16px 0 0;
  }

  div > span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }
</style>
