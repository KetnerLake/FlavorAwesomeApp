<script>
  import Icon from "@iconify/svelte";

  let {
    high, 
    icon, 
    label, 
    low, 
    maximum = 7, 
    name,
    onchange, 
    readonly = false, 
    value = null
  } = $props();

  function onSliderClick( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( index === value ) {
      value = null;
    } else {
      value = index;
    }

    if( onchange ) onchange( {name, value} );
  }
</script>

{#snippet first( filled = false, selected = false )}
  <svg class:filled class:selected>
    <rect x="50%" y="50%" width="48" height="1" />
    <circle class="outline" cx="50%" cy="50%" r="9" />  
    <circle class="dot" cx="50%" cy="50%" r="5" />
  </svg>
{/snippet}

{#snippet middle( filled = false, selected = false )}
  <svg class:filled class:selected>
    <rect x="0" y="50%" width="50%" height="1" />
    <rect x="50%" y="50%" width="50%" height="1" />
    <circle class="outline" cx="50%" cy="50%" r="9" />  
    <circle class="dot" cx="50%" cy="50%" r="5" />  
  </svg>  
{/snippet}

{#snippet last( filled = false, selected = false )}
  <svg class:filled class:selected>
    <rect x="0" y="50%" width="50%" height="1" />
    <circle class="outline" cx="50%" cy="50%" r="9" />  
    <circle class="dot" cx="50%" cy="50%" r="5" />    
  </svg>
{/snippet}

{#if readonly}
  {#if value !== null}
    <div class="label">
      <span>
        <Icon 
          height="24" 
          icon={icon}
          width="24" />
      </span>        
      <div>
        <p>{label}</p>
        <svg>
          <path d="M 10 12 L {10 + ( ( maximum - 1 ) * 30 )} 12" />          
          <path class="filled" d="M 10 12 L {10 + ( ( value - 1 ) * 30 )} 12" />
          {#each {length: maximum}, index}
            {@const filled = value > index}
            <circle class:filled cx={10 + ( index * 30 )} cy="12" r="8" />
          {/each}
          <text dominant-baseline="hanging" x="0" y="28">{low}</text>
          <text 
            dominant-baseline="hanging" 
            text-anchor="end" 
            x={( maximum - 2 ) * 40} 
            y="28">
            {high}
          </text>          
        </svg>
      </div>
    </div>
  {/if}
{:else}
  <div class="field">
    <div>
      <span>
        <Icon height="24" icon={icon} width="24" />
      </span>  
      <p>{label}</p>
    </div>
    <div class="slider">
      {#each {length: maximum}, index}
        {@const filled = value > ( index + 1 )}      
        {@const selected = value === ( index + 1 )}      
        <button 
          aria-label={index} 
          data-index={index + 1} 
          onclick={onSliderClick} 
          type="button">
          {#if index === 0}
            {@render first( filled, selected )}
          {:else if index < ( maximum - 1 )}
            {@render middle( filled, selected )}           
          {:else if index === ( maximum - 1 )} 
            {@render last( filled, selected )}           
          {/if}
        </button>
      {/each}
    </div>
    <div class="range">
      <p>{low}</p>
      <p>{high}</p>
    </div>
  </div>
{/if}

<style>
  button {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    flex-basis: 0;
    flex-grow: 1;
    height: 40px;
    margin: 0;
    outline: none;
    padding: 0;
    -webkit-tap-highlight-color: transparent;            
  }

  svg circle.outline {
    fill: #ffffff;
    stroke: #000000;
    stroke-width: 2px;
  }

  svg circle.dot {
    fill: none;
    stroke: none;
  }  

  svg.filled circle.outline {
    fill: #000000;
  }

  svg.filled rect {
    height: 8px;
    y: calc( 50% - 4px );
  }  

  svg.selected circle.dot {
    fill: #000000;
  }

  svg.selected rect:first-of-type {
    height: 8px;
    y: calc( 50% - 4px );
  }  

  div {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }  

  div.field,
  div.label {    
    padding: 8px 0 0 0;
  }

  div.field p,
  div.label p {    
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

  div.label {
    border-bottom: solid 1px #00000010;    
    flex-direction: row;
    padding: 0;
  }

  div.label div {
    display: flex;
    flex-direction: column;
    padding: 7px 0 7px 0;
  }

  div.label p {
    font-size: 12px;
    letter-spacing: 0.50px;
    line-height: 16px;
    padding: 0 0 2px 0
  }

  div.label svg {
    height: 40px;
  }

  div.label circle {
    fill: #ffffff;
    stroke: var( --primary-text-color );
    stroke-width: 2px;
  }

  div.label circle.filled {
    fill: var( --primary-text-color );
  }

  div.label path {
    stroke: var( --primary-text-color );
  }

  div.label path.filled {
    stroke-width: 6px;
  }

  div.label span {
    color: var( --secondary-text-color );
    padding: 12px 12px 0 12px;
  }

  div.label text {
    cursor: default;
    fill: var( --secondary-text-color );
    font-family: 'Roboto Variable', sans-serif;
    font-size: 12px;
    letter-spacing: 0.50px;
  }

  div.field div > span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }  

  div div {
    flex-direction: row;
    padding: 8px 0 8px 0;
  }  

  div.range {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 0 30px 0 54px;
  }

  div.range p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 16px;
    margin: 0;
    padding: 0;
  }

  div.range p:last-of-type {
    text-align: right;
  }

  div.slider {
    display: flex; 
    flex-direction: row; 
    padding: 0 20px 0 44px;
  }

  div.slider button:first-of-type svg.selected rect {
    height: 1px;
    y: 50%;    
  }

  svg {
    display: block;
    height: 26px;
    width: 100%;
  }
</style>
