<script>
  import '@fontsource-variable/roboto';
  import Icon from "@iconify/svelte";
  import NumberParser from "$lib/NumberParser";  

  let {
    children,
    label, 
    mode = 'text',
    name, 
    onchange,
    placeholder, 
    suffix, 
    value = null
  } = $props();

  let focus = false;
  let input;

  function onClearClick( evt ) {
    evt.preventDefault();
    value = null;
    input.focus();

    if( onchange ) onchange( {name, value} );
  }

  function onInputBlur() {
    focus = false;
    
    if( mode === 'numeric' || mode === 'decimal' ) {      
      const digits = mode === 'numeric' ? 0 : 2;

      if( value !== null ) {
        value = new Number( value ).toLocaleString( navigator.language, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits
        } );         
      }
    }
  }

  function onInputChange( evt ) {
    if( value.trim().length === 0 ) value = null;
    if( onchange ) onchange( {name, value} );
  }

  function onInputFocus() {
    focus = true;

    if( mode === 'numeric' || mode === 'decimal' ) {
      if( value !== null ) {
        const parser = new NumberParser( navigator.language );
        value = parser.parse( value ).toString( 10 );
      }
    }
  }
</script>

<label>
  <div class="field">
    <p>{label}</p>
    <div class="parts">
      <input 
        bind:this={input} 
        bind:value
        inputmode={mode}
        onblur={onInputBlur}
        oninput={onInputChange}
        onfocus={onInputFocus}
        {placeholder} 
        type="text" />    
      {#if suffix}
        <p>{suffix}</p>
      {/if}
    </div>
  </div>
  {#if value !== null}
    <button onclick={onClearClick} tabindex="-1" type="button">
      <Icon 
        height="24" 
        icon="material-symbols:cancel-outline" 
        width="24" />
    </button>
  {/if}
</label>
{@render children?.()}  

<style>
  button {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: pointer;
    height: 40px;
    margin: 0;
    padding: 0;
    width: 40px;
    -webkit-tap-highlight-color: transparent;
  }

  div.field {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
  }

  div.parts {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: row;
    flex-grow: 1;
  }

  input {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var( --primary-text-color );
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    outline: none;
    padding: 0;
    width: 100%;    
    -webkit-tap-highlight-color: transparent;    
  }

  input::placeholder {
    color: #16161640;          
    opacity: 1.0;
  }   

  label {
    align-items: center;
    border-color: var( --secondary-text-color );
    border-radius: 4px;    
    border-style: solid;
    border-width: 1px;
    box-sizing: border-box;
    cursor: text;
    display: flex;
    flex-basis: 0;
    flex-direction: row;
    flex-grow: var( --flex-grow, 1 );
    margin: var( --margin, 0 );
    outline: none;
    padding: 8px 4px 6px 16px;
    position: relative;
    width: var( --label-width );
    -webkit-tap-highlight-color: transparent;    
  }

  p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    font-family: 'Roboto Variable', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 16px;
    margin: 0;
    padding: 0;    
  }

  div.parts p {
    color: var( --secondary-text-color );
    font-size: 16px;
    line-height: 24px;    
    padding: 0 12px 0 0;
  }

  label:focus-within {
    border-color: var( --primary-accent-color );    
    box-shadow: 0 0 0 3px rgb( from var( --primary-accent-color ) r g b / 0.38 );
  }  

  label:not( :focus-within ) button {
    display: none;
  }
</style>
