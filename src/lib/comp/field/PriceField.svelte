<script>
  import Currency from "../view/Currency.svelte";    
  import Dialog from "../Dialog.svelte";
  import Icon from "@iconify/svelte";
  import Input from "../Input.svelte";
  import LabelField from './LabelField.svelte';  

  let {
    currency = 'USD', 
    name, 
    onchange,
    placeholder, 
    readonly = false, 
    value = null
  } = $props();

  const currencies = [
    {value: 'USD', label: 'US Dollar', icon: 'material-symbols:attach-money' },
    {value: 'EUR', label: 'Euro', icon: 'material-symbols:euro' },
    {value: 'JPY', label: 'Japanese Yen', icon: 'material-symbols:currency-yen' },
    {value: 'GBP', label: 'Great Britain Pound', icon: 'material-symbols:currency-pound' },
    {value: 'AUD', label: 'Australian Dollar', icon: 'material-symbols:attach-money' },
    {value: 'CAD', label: 'Canadian Dollar', icon: 'material-symbols:attach-money' },
    {value: 'CHF', label: 'Swiss Franc', icon: 'material-symbols:currency-franc' },
    {value: 'CNY', label: 'Chinese Yuan', icon: 'material-symbols:currency-yuan' },
    {value: 'HKD', label: 'Hong Kong Dollar', icon: 'material-symbols:attach-money' },
    {value: 'NZD', label: 'New Zealand Dollar', icon: 'material-symbols:attach-money' }
  ];

  let dialog = $state();

  let icon = $derived.by( () => {
    return currencies.find( ( item ) => item.value === currency ).icon;
  } );

  let hold = null;

  function onCurrencyChange( abbreviation ) {
    currency = abbreviation;
    if( onchange ) onchange( {
      name, 
      value: currency
    } );    
  }

  function onCurrencyClick() {
    dialog.showModal();
  }

  function onDialogClose() {
    dialog.close();
  }

  function onDialogSave( abbreviation ) {
    currency = hold;
    dialog.close();
  }

  function onPriceChange( evt ) {
    value = evt.value;
    if( onchange ) onchange( {
      name, 
      value: value === null ? null : parseFloat( value )
    } );    
  }
</script>

{#if readonly}
  {#if value !== null}
    <LabelField {icon} label="Price" suffix={currency} {value} />
  {/if}
{:else}
  <div>
    <span>
      <Icon height="24" icon={icon} width="24" />
    </span>
    <Input 
      label="Price" 
      mode="decimal" 
      name="price" 
      onchange={onPriceChange} 
      {placeholder} 
      value={( typeof value ) === 'number' ? value.toString( 10 ) : value} />
    <button onclick={onCurrencyClick} type="button">
      <p>
        <span class="label">Currency</span>
        <span class="value">{currency}</span>        
      </p>
      <span>
        <Icon height="24" icon="material-symbols:arrow-drop-down" width="24" />
      </span>
    </button>
  </div>

  <Dialog 
    bind:this={dialog} 
    label="Currency" 
    onclose={onDialogClose} 
    onsave={onDialogSave}>
    <Currency items={currencies} onchange={onCurrencyChange} value={currency} />
  </Dialog>
{/if}

<style>
  button {
    align-items: center;
    appearance: none;
    background: none;
    border-color: var( --secondary-text-color );
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    color: var( --primary-text-color );
    cursor: pointer;
    display: flex;
    flex-direction: row;
    margin: 0 0 0 16px;
    outline: none;
    padding: 8px 0 6px 0;
    -webkit-tap-highlight-color: transparent;                
  }

  button:focus {
    border-color: var( --primary-accent-color );    
    box-shadow: 0 0 0 3px rgb( from var( --primary-accent-color ) r g b / 0.38 );    
  }

  button p {
    color: var( --primary-text-color );
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    padding: 0 0 0 16px;
    text-align: left;
  }

  button p span {
    display: block;
  }

  button p span.label {
    color: var( --secondary-text-color );
    font-size: 12px;
    line-height: 16px;
  }

  div {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 0 16px 0 0;
  }
  
  button > span,
  div > span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }
</style>
