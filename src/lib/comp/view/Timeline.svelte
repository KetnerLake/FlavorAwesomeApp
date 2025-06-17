<script>
  import '@fontsource-variable/roboto';
  import Icon from "@iconify/svelte";

  let {children, hidden = false, items = [], onchange} = $props();

  function formatDate( value ) {
    return new Intl.DateTimeFormat( navigator.language, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    } ).format( value );
  }

  function formatName( value ) {
    const cleaned = value.replace( /\([^()]*\)/g, '' );
    const parts = cleaned.split( ' ' );
    let result = '';

    for( let p = 0; p < parts.length; p++ ) {
      const name = parts[p].trim();

      if( name.length === 0 ) {
        continue;
      }

      let letter = name.charAt( 0 );

      if( name.indexOf( '-' ) > -1 ) {
        const hyphens = name.split( '-' );

        for( let h = 1; h < hyphens.length; h++ ) {
          letter = letter + hyphens[h].charAt( 0 );
        }
      }

      result = result + letter;
    }

    return result.toUpperCase();    
  }
</script>

<article class:hidden>
  {#if items.length === 0}
    {@render children()}
  {:else}
    <ul>
      {#each items as item}
        <li>
          <button onclick={() => onchange( item.id )} type="button">
            <figure>
              {#if item.photos === null}
                <figcaption>{formatName( item.name )}</figcaption>
              {:else}
                <img 
                  alt="Thumbnail" 
                  height="64" 
                  src={item.photos[0].data} 
                  width="100" />              
              {/if}
              {#if item.favorite}
                <span>
                  <Icon
                    height="14" 
                    icon="material-symbols:favorite" 
                    width="14" />
                </span>
              {/if}                              
            </figure>
            <div class="item">
              <p class="created">{formatDate( item.updated_at )}</p>
              <div class="rating">
                {#each {length: 5}, index}
                  <Icon 
                    color="#161616"
                    height="16"
                    icon={index < item.rating ? 'material-symbols:star' : 'material-symbols:star-outline'}
                    width="16" />
                {/each}
              </div>
              <p class="name">{item.name}</p>
            </div>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</article>

<style>
  article {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    margin: 0;
    overflow: auto;
    padding: 0;
  }

  article.hidden {
    display: none;
  }

  button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 16px;
    margin: 0;
    outline: none;
    padding: 8px 12px 8px 0;
    width: 100%;
    -webkit-tap-highlight-color: transparent;    
  }

  div {
    box-sizing: border-box;
  }

  div.item {
    display: grid;
    flex-basis: 0;
    flex-grow: 1;
    grid-template-columns: repeat( 2, 1fr );
  }

  div.rating {
    display: flex;
    flex-direction: row;
    grid-area: 1 / 2 / 2 / 3;    
    justify-content: end;
  }

  figure {
    align-items: center;
    background: #16161610;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;    
    box-sizing: border-box;
    display: flex;
    height: 64px;
    justify-content: center;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    width: 100px;
  }

  figcaption {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.25px;
    line-height: 20px;
    margin: 0;
    overflow: hidden;    
    padding: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  img {
    object-fit: cover;
  }

  li {
    border-bottom: solid 1px #16161610;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  p {
    box-sizing: border-box;
    color: var( --primary-text-color );
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.25px;
    line-height: 20px;
    margin: 0;
    padding: 0;
    text-align: left;
  }

  p.created {
    grid-area: 1 / 1 / 2 / 2;    
  }

  p.name {
    font-size: 16px;
    grid-area: 2 / 1 / 3 / 3;    
    letter-spacing: 0.50px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    bottom: 2px;
    color: var( --primary-accent-color );
    position: absolute;
    right: 6px;
  }

  ul {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
