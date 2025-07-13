<script>
  import Icon from "@iconify/svelte";

  let {
    name,
    onchange,
    placeholder = 'Notes',
    readonly, 
    value = null
  } = $props();

  let area = $state();

  $effect( () => {
    if( !readonly ) {
      if( value !== null ) {
        // Optionally reset height
        // area.style.height = '';
        area.style.height = area.scrollHeight + 'px';  
      }
    }
  } );

  function onAreaChange( evt ) {
    if( value.trim().length === 0 ) value = null;
    if( onchange ) onchange( {name, value} );
  }
</script>

{#if readonly} 
  {#if value !== null} 
    <div class="label">
      <span>
        <Icon 
          height="24" 
          icon="material-symbols:text-snippet-outline" 
          width="24" />
      </span>  
      <div>
        <p>Notes</p>
        <p>{value}</p>      
      </div>
    </div>  
  {/if}
{:else}
  <div class="field">
    <div>
      <span>
        <Icon 
          height="24" 
          icon="material-symbols:text-snippet-outline" 
          width="24" />
      </span>  
      <p>Notes</p>      
    </div>
    <label>
      <textarea 
        bind:this={area} 
        bind:value 
        oninput={onAreaChange} 
        placeholder={placeholder}></textarea>
    </label>
  </div>
{/if}

<style>
  div.label {
    border-bottom: solid 1px #00000010;    
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 12px 0 12px 0;
  }

  div.label div {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
  }

  div.label p {
    box-sizing: border-box;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-weight: 400;
    letter-spacing: 0.50px;
    margin: 0;
    padding: 0;
  }

  div.label p:first-of-type {
    color: var( --secondary-text-color );
    font-size: 12px;
    line-height: 16px;
  }

  div.label p:last-of-type {
    color: var( --primary-text-color );
    font-size: 16px;
    line-height: 24px;
    padding: 0 16px 0 0;
  }

  div.label span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }

  div.field {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0 0 16px 0;
  }

  div.field div {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 8px 0 8px 0;
  }

  div.field p {
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

  div.field span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }

  label {
    box-sizing: border-box;
    margin: 0;
    padding: 0 16px 0 48px;
  }

  textarea {
    appearance: none;
    background: none;
    border: none;
    border-color: var( --secondary-text-color );
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    box-sizing: border-box;
    color: var( --primary-text-color );
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    min-height: 100px;
    margin: 0;
    outline: none;
    padding: 12px 12px 12px 16px;    
    resize: none;
    width: 100%;
    -webkit-tap-highlight-color: transparent;        
  }

  textarea::placeholder {
    color: #16161640;          
    opacity: 1.0;    
  }

  textarea:focus {
    border-color: var( --primary-accent-color );    
    box-shadow: 0 0 0 3px rgb( from var( --primary-accent-color ) r g b / 0.38 );
  }
</style>
