<script>
  import Icon from "@iconify/svelte";
  import LabelField from "./LabelField.svelte";

  let {
    icon, 
    items = [], 
    label, 
    name, 
    onchange,
    other = false,
    readonly = false, 
    value = null
  } = $props();

  let input = $state();

  function onItemClick( evt ) {
    const item = evt.currentTarget.getAttribute( 'data-value' );
    value = value === item ? null : item;
    if( onchange ) onchange( {name, value} );
  }

  function onOtherClick( evt ) {
    evt.preventDefault();
    input.focus();
  }

  function onOtherFocus() {

  }

  function onOtherInput() {

  }
</script>

{#if readonly}
  {#if value !== null}
    <LabelField {icon} {label} {value} />
  {/if}
{:else}
  <div>
    <div>
      <span>
        <Icon height="24" icon={icon} width="24" />
      </span>  
      <p>{label}</p>
    </div>
    <ul>
      {#each items as item}
        {@const symbol = value === item ? 'material-symbols:radio-button-checked-outline' : 'material-symbols:circle-outline'}
        <li>
          <button data-value={item} onclick={onItemClick} type="button">
            <span>{item}</span>
            <Icon 
              height="24" 
              icon={symbol} 
              width="24" />
          </button>
        </li>
      {/each}
      {#if other}
        <li class="other">
          <label>
            <input 
              bind:this={input} 
              onfocus={onOtherFocus} 
              oninput={onOtherInput} 
              placeholder="Other" 
              text="text" />
            <button onclick={onOtherClick} type="button">
              <Icon 
                height="24" 
                icon="material-symbols:circle-outline" 
                width="24" />
            </button>
          </label>
        </li>
      {/if}
    </ul>
  </div>
{/if}

<style>
  label {
    align-items: center;
    border: solid 1px #49454F;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: text;
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 4px 6px 2px 16px;
  }

  label button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0;
    width: 40px;
  }

  label input {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: #1D1B20;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin: 0;
    min-width: 0;
    outline: none;
    padding: 0;
    width: 100%;
  }

  input::placeholder {
    color: #16161640;          
    opacity: 1.0;
  }     

  label:focus-within {
    border-color: #6750A4;    
    box-shadow: 0 0 0 3px rgb( from #6750A4 r g b / 0.40 );
  }  

  /* Original */
  button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var( --primary-text-color );
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    height: 48px;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    outline: none;
    padding: 0 12px 0 16px;
    width: 100%;
    -webkit-tap-highlight-color: transparent;    
  }

  button span {
    flex-basis: 0;
    flex-grow: 1;    
    text-align: left;
  }    

  div {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }

  div div {
    flex-direction: row;
    padding: 8px 0 8px 0;
  }

  div > span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }

  p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }  

  ul {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0 16px 0 48px;
  }

  li {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
</style>
