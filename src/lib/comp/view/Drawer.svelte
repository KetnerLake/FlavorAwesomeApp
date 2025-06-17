<script>
  import Icon from "@iconify/svelte";

  let {count, items, onchange, selected = null} = $props();

  let drawer;
  let scrim;
  let section;

  function onAboutClick() {
    window.open( 'https://flavorawesome.com', '_blank' );
    hide();
  }
  
  function onItemClick( id ) {
    if( selected !== id ) {
      selected = id;

      if( onchange ) {
        hide();
        onchange( selected );
      }
    } else {
      hide();      
    }
  }

  export function hide() {
    scrim.animate( [
      {opacity: '1.0'},
      {opacity: '0'}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    } );
    drawer.animate( [
      {left: '0'},
      {left: '-100vw'}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    } ).finished.then( () => {
      section.style.left = '-100vw';
    } );
  }

  export function show() {
    section.style.left = '0';
    scrim.animate( [
      {opacity: '0'},
      {opacity: '1.0'}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    } );
    drawer.animate( [
      {left: '-100vw'},
      {left: '0'}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    } );
  }
</script>

<section bind:this={section}>
  <article bind:this={scrim} class="scrim">
    <button onclick={() => hide()} type="button">
      <Icon 
        color="#ffffff" 
        height="24" 
        icon="material-symbols:cancel-rounded" 
        width="24" />
    </button>
  </article>
  <article bind:this={drawer} class="drawer">
    <h3>Flavors</h3>
    <ul>
      <li class:selected={selected === null}>
        <button onclick={() => onItemClick( null )} type="button">
          <span>
            <Icon 
              color="#5fb2ff"
              height="24" 
              icon="material-symbols:circle" 
              width="24" />
          </span>
          <span>All</span>
          <span>{count.All}</span>
        </button>
      </li>            
      {#each items as item}
        <li class:selected={item.id === selected}>
          <button onclick={() => onItemClick( item.id )} type="button">
            <span>
              <Icon 
                color={item.primary} 
                height="24" 
                icon="material-symbols:circle" 
                width="24" />
            </span>
            <span>{item.singular}</span>
            <span>{count.hasOwnProperty( item.singular ) ? count[item.singular] : 0}</span>
          </button>
        </li>
      {/each}
    </ul>
    <ul>
      <li>
        <button onclick={onAboutClick} type="button">
          <span>
            <Icon 
              color="#49454F" 
              height="24" 
              icon="material-symbols:info-rounded" 
              width="24" />
          </span>
          <span>About Flavor Awesome</span>
          <span></span>
        </button>
      </li>            
      <li>
        <button type="button">
          <span>
            <Icon 
              color="#49454F" 
              height="24" 
              icon="material-symbols:help-rounded" 
              width="24" />
          </span>
            <span>Help and Feedback</span>
          <span></span>
        </button>
      </li>                  
    </ul>
  </article>
</section>

<style>
  article.drawer {
    background: #ffffff;
    border-top-right-radius: 28px;
    border-bottom-right-radius: 28px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    left: -100vw;
    margin: 0;
    padding: 0;
    padding-bottom: max( 16px, env( safe-area-inset-bottom ) );
    padding-top: max( 16px, env( safe-area-inset-top ) );                                          
    position: absolute;
    top: 0;
    width: calc( 100vw - 48px );
  }

  article.scrim {
    align-items: flex-start;
    backdrop-filter: blur( 4px );    
    background: #00000040;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    justify-content: flex-end;
    margin: 0;
    opacity: 0;
    padding: 0;
  }

  article.scrim button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    justify-content: center;
    margin: 4px 0 0 0;
    outline: none;
    padding: 12px;
    -webkit-tap-highlight-color: transparent;                
  }

  h3 {
    box-sizing: border-box;
    color: var( --primary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 10px 0 22px 28px;
  }

  ul {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0 12px 0 12px;
  }

  ul:first-of-type {
    border-bottom: solid 1px #00000010;
    flex-basis: 0;
    flex-grow: 1;
    margin: 0 0 12px 0;
    overflow: auto;
    padding: 0 12px 12px 12px;
  }

  ul li {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ul li button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    border-radius: 56px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 12px;
    height: 56px;
    margin: 0;
    outline: none;
    padding: 0 24px 0 16px;  
    width: 100%;  
    -webkit-tap-highlight-color: transparent;            
  }

  ul li button span {
    box-sizing: border-box;
    color: var( --secondary-text-color );        
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0;
    text-align: left;
  }

  ul li button span:first-of-type {
    height: 24px;
  }

  ul li button span:nth-last-of-type( 2 ) {
    flex-basis: 0;
    flex-grow: 1;
  }

  ul li.selected button {
    background: #00000010;
  }

  section {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 100%;
    left: -100vw;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    top: 0;
    width: 100vw;
    z-index: 125;
  }
</style>
