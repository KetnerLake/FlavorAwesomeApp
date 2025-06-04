<script>
  import Icon from "@iconify/svelte";

  let {label, name, onchange, readonly = false, value = null} = $props();

  function onStarClick( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( index === value ) {
      value = null;
    } else {
      value = index;
    }

    if( onchange ) onchange( {name, value} );
  }
</script>

{#if readonly}
  {#if value !== null}
    <div class="label">
      <span>
        <Icon height="24" icon="material-symbols:stars-outline" width="24" />
      </span>
      <div>
        <ul>
          {#each {length: 5}, index}
            {@const symbol = index < value ? 'material-symbols:star' : 'material-symbols:star-outline'}
            <li>
              <Icon height="24" icon={symbol} width="24" />
            </li>
          {/each}
        </ul>
        <p>{label}</p>              
      </div>
    </div> 
  {/if}
{:else}
  <div class="field">
    <div>
      <span>
        <Icon height="24" icon="material-symbols:stars-outline" width="24" />
      </span>  
      <p>{label}</p>
    </div>
    <ul>
      {#each {length: 5}, index}
        {@const rating = value === null ? 0 : value}
        {@const symbol = index < rating ? 'material-symbols:star' : 'material-symbols:star-outline'}
        <li>
          <button 
            aria-label="Rating of {( index + 1 )}" 
            data-index={index + 1} 
            onclick={onStarClick}
            type="button">
              <Icon height="48" icon={symbol} width="48" />
          </button>
        </li>
      {/each}
    </ul>
  </div>    
{/if}

<style>
  button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var( --primary-text-color );
    cursor: pointer;
    display: flex;
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  div.field {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  div.field div {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 8px 0 8px 0;
    width: 100%;
  }

  div.field div > p {
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

  div.field div > span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }  

  div.label {
    align-items: center;
    border-bottom: solid 1px #00000010;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 12px 0 11px 0;
  }

  div.label div {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  div.label p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 16px;
    margin: 0;
    padding: 0;
  }

  div.label span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }   

  ul {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }  

  div.field ul {
    justify-content: space-between;
    padding: 0 16px 0 48px;    
    width: 100%;
  }

  div.label li {
    box-sizing: border-box;
    color: var( --primary-text-color );
    display: flex;
    margin: 0;
    padding: 0;
  }  
</style>
