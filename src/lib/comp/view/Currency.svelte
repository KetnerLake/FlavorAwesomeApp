<script>
  import Icon from "@iconify/svelte";

  let {items = [], onchange, value = 'USD'} = $props();  

  let icon = $derived.by( () => {
    return currencies.find( ( item ) => item.value === currency ).icon;
  } );

  function onCurrencyClick( evt ) {
    value = evt.currentTarget.getAttribute( 'data-value' );

    if( onchange ) {
      onchange( value );
    }
  }
</script>

<ul>
  {#each items as item}
    <li>
      <button data-value={item.value} onclick={onCurrencyClick} type="button">
        <Icon height="20" icon={item.icon} width="20" />        
        <span>{item.label}</span>
        <Icon 
          height="20" 
          icon={item.value === value ? 'material-symbols:radio-button-checked-outline' : 'material-symbols:circle-outline'} 
          width="20" />                
      </button>
    </li>
  {/each}
</ul>

<style>
  ul {
    box-sizing: border-box;
    flex-grow: 1;
    list-style: none;
    margin: 0;
    overflow: auto;
    padding: 0;
    width: 100%;
  }

  ul li {
    box-sizing: border-box;
    cursor: pointer;
    margin: 0;
    padding: 5px 16px 5px 14px;
  }

  ul li button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var( --primary-text-color );
    cursor: pointer;
    display: flex;
    flex-direction: row;
    margin: 0;
    outline: none;
    padding: 0;
    width: 100%;
    -webkit-tap-highlight-color: transparent;            
  }

  ul li button span {
    color: #1D1B20;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;    
    padding: 8px 0 6px 11px;
    text-align: left;
  }  
</style>
