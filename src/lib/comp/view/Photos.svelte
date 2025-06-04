<script>
  import '@fontsource-variable/roboto';
  import Icon from "@iconify/svelte";

  let {children, hidden = false, items = []} = $props();

  function formatDate( value ) {
    return new Intl.DateTimeFormat( navigator.language, {
      month: 'long',
      year: 'numeric'
    } ).format( value );
  }  
</script>

<article class:hidden>
  {#if items.length === 0}
    {@render children()}
  {:else}
    <ul>
      {#each items as item}
        <li>
          <button type="button">
            <img alt="Thumbnail" src={item.src} />
            <p class="date">{item.createdAt.getDate()}</p>
            <p class="month">{formatDate( item.createdAt )}</p>
            {#if item.favorite}
              <span>
                <Icon 
                  height="24" 
                  icon="material-symbols:favorite" 
                  width="24" />
              </span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</article>

<style>
  article {
    background: #161616;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    margin: 0;
    overflow: hidden;
    padding: 0;
  }

  article.hidden {
    display: none;
  }

  button {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    margin: 0;
    outline: none;
    padding: 0;
    position: relative;
    width: 100%;
    -webkit-tap-highlight-color: transparent;    
  }  

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  li {
    box-sizing: border-box;
    display: flex;
    height: calc( ( 100vw / 2 ) - 1px );
    margin: 0;    
    padding: 0;    
    width: calc( ( 100vw / 2 ) - 1px );
  }

  p {
    box-sizing: border-box;
    color: #ffffff;
    font-family: 'Roboto Variable', sans-serif;
    margin: 0;
    mix-blend-mode: screen;
    padding: 0;
    position: absolute;
    right: 12px;
  }

  p.date {
    bottom: 24px;
    font-size: 36px;
    font-weight: 700;
  }

  p.month {
    bottom: 8px;
    font-size: 16px;
    font-weight: 500;    
  }

  span {
    color: var( --primary-accent-color );
    left: 12px;
    position: absolute;
    top: 12px;
  }  

  ul {
    box-sizing: border-box;
    display: grid; 
    flex-basis: 0;
    flex-grow: 1;
    gap: 2px 2px;     
    grid-template-columns: 1fr 1fr;     
    list-style: none;
    margin: 0;
    overflow: auto;
    padding: 0;    
  }
</style>
