<script>
  import Icon from "@iconify/svelte";
  import IconButton from "./IconButton.svelte";

  let {label, left, oncancel, onchange, right, subtitle, variation} = $props();

  let input = $state();
  let search = $state( null );

  function focus( element ) {
    search = null;
    element.focus();
  }

  function onCancelClick() {
    if( oncancel ) oncancel();
  }

  function onClearClick( evt ) {
    evt.preventDefault();
    search = null;
    input.focus();

    if( onchange ) onchange( search );
  }

  function onSearchChange() {
    const query = search.trim().length === 0 ? null : search.trim().toLowerCase();
    if( onchange ) onchange( query );
  }
</script>

<header class:small={variation === 'sm' ? true : false}>
  {#if variation === 'sm'}
    {@render left?.()}
    <h3>{label}</h3>
    {@render right()}
  {:else if variation === 'search'}
    <div class="search">
      <IconButton 
        name="material-symbols:arrow-back-rounded" 
        onclick={onCancelClick} />
      <label>
        <span>
          <Icon 
            height="24" 
            icon="material-symbols:search-rounded" 
            width="24" />
        </span>
        <input 
          {@attach focus} 
          bind:this={input}
          bind:value={search}
          oninput={onSearchChange}
          type="text" />
        {#if search !== null}
          <button onclick={onClearClick} tabindex="-1" type="button">
            <Icon 
              height="24" 
              icon="material-symbols:cancel-outline" 
              width="24" />
          </button>
        {/if}          
      </label>
    </div>
    <h3>{label}</h3>    
    {#if subtitle}  
      <p>{subtitle}</p>
    {/if}        
  {:else}
    <div>
      <div>
        {@render left()}
      </div>
      <div>
        {@render right()}
      </div>
    </div>
    <h3>{label}</h3>    
    {#if subtitle}  
      <p>{subtitle}</p>
    {/if}    
  {/if}
</header>

<style>
  button {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    height: 40px;
    margin: 0;
    padding: 0;
    width: 40px;
    -webkit-tap-highlight-color: transparent;
  }

  div {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  div > div {
    display: flex;
    flex-direction: row;
  }

  div > div:last-of-type {
    justify-content: flex-end;
  }

  div.search {
    align-items: center;
    display: flex;
    flex-direction: row;
  }

  h3 {
    box-sizing: border-box;
    color: var( --secondary-accent-color, #1D1B20 );
    color: #ffffff;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 28px;
    font-weight: 400;   
    letter-spacing: 0; 
    line-height: 36px;
    margin: 0;
    padding: 0 0 0 12px;
  }

  header {
    background: var( --primary-accent-color, #FEF7FF );
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 8px 4px 12px 4px;
    transition: background 0.30s ease-in-out;
    width: 100%;
  }

  header > div {
    display: grid;
    grid-template-columns: repeat( 2, 1fr );
  }

  header.small {
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 12px 4px 12px 4px;
  }

  header.small h3 {
    flex-basis: 0;
    flex-grow: 1;
    font-size: 22px;
    line-height: 28px;
    padding: 0 0 0 4px;
  }

  input {
    appearance: none;
    background: none;
    border: none;
    color: #ffffff;
    cursor: text;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    height: 40px;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0 8px 0 8px;
    min-width: 0;
    outline: none;
    padding: 0;
    width: 100%;
    -webkit-tap-highlight-color: transparent;    
  }

  label {
    align-items: center;
    background: #ffffff40;
    border-radius: 40px;
    display: flex;
    flex-direction: row;
    height: 40px;
    margin: 0 4px 0 4px;
    padding: 0 8px 0 8px;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  label span {
    color: #ffffff;
    height: 24px;
    padding: 0;
  }

  p {
    box-sizing: border-box;
    color: var( --secondary-accent-color, #49454F );
    color: #ffffff;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0 0 0 12px;                  
  }  
</style>
