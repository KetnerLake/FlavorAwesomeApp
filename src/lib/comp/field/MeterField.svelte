<script>
  import Icon from "@iconify/svelte";
  import LabelField from "./LabelField.svelte";

  let {
    icon, 
    items = [], 
    label, 
    name, 
    onchange, 
    readonly = false, 
    value = null
  } = $props();

  let score = $derived( items.findIndex( ( item ) => item === value ) );
  
  function filled( index ) {
    if( value === null ) return true;
    return index >= score ? false : true;
  }

  function onItemClick( evt ) {
    const item = evt.currentTarget.getAttribute( 'data-value' );
    value = value === item ? null : item;
    if( onchange ) onchange( {name, value} );
  }
</script>

{#snippet bottom( fill )}
  <svg width="24" height="48">
    <path class="outline" d="M 20, -1 L 20, 36 A 8.5 8.5 0 0 1 3 36 L 3, -1 Z" />
    <path class:filled={fill} class="inline" d="M 7, -1 L 7, 36 A 3 3 0 0 0 16 36 L 16, -1 Z" />
  </svg>  
{/snippet}

{#snippet middle( fill )}
  <svg width="24" height="48">
    <path class="outline" d="M 3, -1 L 3, 48 L 20, 48 L 20, -1 Z" />
    <path class:filled={fill} class="inline" d="M 7, -1 L 7, 48 L 16, 48 L 16 -1 Z" />
  </svg>  
{/snippet}

{#snippet top( fill )}
  <svg width="24" height="48">
    <path class="outline" d="M 3, 48 L 3, 12 A 8.5 8.5 0 0 1 20 12 L 20, 48 Z" />
    <path class:filled={fill} class="inline" d="M 7, 48 L 7, 12 A 3 3 0 0 1 16 12 L 16, 48 Z" />
  </svg>  
{/snippet}

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
      {#each items as item, index}
        {@const fill = filled( index )}
        <li>
          <button data-value={item} onclick={onItemClick} type="button">
            <span>{item}</span>
            {#if index === 0}
              {@render top( fill )}
            {:else if index > 0 && index < ( items.length - 1 )}
              {@render middle( fill )}
            {:else}
              {@render bottom( fill )}
            {/if}
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
    flex-direction: row;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    height: 48px;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    outline: none;
    padding: 0;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  button span {
    flex-basis: 0;
    flex-grow: 1;    
    text-align: left;
  }

  div {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  div div {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 8px 0 8px 0;
    width: 100%;
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
    padding: 0 28px 0 64px;
    width: 100%;
  }

  li {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  path.inline {
    fill: var( --primary-text-color );
    stroke: none;
  }

  path.outline {
    fill: none;
    stroke: var( --primary-text-color );
    stroke-width: 2px;
  }

  path.filled {
    fill: none;
  }
</style>
