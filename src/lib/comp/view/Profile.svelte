<script>
  import Icon from "@iconify/svelte";
  import Wheel from "../Wheel.svelte";

  let {name, onchange, spokes, value = null} = $props();

  let index = $state( 0 );
  let rotate = $state( 0 );
  let width = $state( 0 );

  function onLeftClick() {
    rotate = rotate + 1;

    if( index === 0 ) {
      index = spokes.length - 1;
    } else {
      index = index - 1;
    }
  }

  function onRightClick() {
    rotate = rotate - 1;    

    if( index === ( spokes.length - 1 ) ) {
      index = 0;
    } else {
      index = index + 1;
    }
  }

  function onValueClick( evt ) {
    if( value === null ) {
      value = new Array( spokes.length ).fill( 0 );
    }

    const attribute = parseInt( evt.currentTarget.getAttribute( 'data-value' ) );

    if( value[index] === attribute ) {
      value[index] = 0;
    } else {
      value[index] = attribute;
    }

    value = [... value];
    if( onchange ) onchange( {name, value} );    

    onRightClick();
  }
</script>

<div bind:clientWidth={width} class="profile">
  <div class="controls">
    <button onclick={onLeftClick} type="button">
      <Icon height="24" icon="material-symbols:chevron-left" width="24" />
    </button>
    <p>{spokes[index]}</p>
    <button onclick={onRightClick} type="button">
      <Icon height="24" icon="material-symbols:chevron-right" width="24" />
    </button>    
  </div>
  <Wheel 
    interactive={true} 
    labels={false} 
    {spokes} 
    value={value === null ? [] : value} 
    rotate={( 360 / spokes.length ) * rotate} />
  <div class="value" style:height={( ( ( ( ( width / 0.51 ) / 2 ) / 5 ) * 4 ) + 48 ) + 'px'}>
    <button data-value="5" onclick={onValueClick} type="button">5</button>
    <button data-value="4" onclick={onValueClick} type="button">4</button>
    <button data-value="3" onclick={onValueClick} type="button">3</button>
    <button data-value="2" onclick={onValueClick} type="button">2</button>
    <button data-value="1" onclick={onValueClick} type="button">1</button>
  </div>
</div>

<style>
  button {
    align-items: center;
    appearance: none;
    background: var( --primary-accent-color );
    border: none;
    border-radius: 40px;
    color: var( --secondary-accent-color );
    cursor: pointer;
    display: flex;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 500;
    height: 40px;
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0;
    width: 40px;
    -webkit-tap-highlight-color: transparent;            
  }

  div.controls {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 0 16px 24px 16px;
    width: 100%;
  }

  div.controls p {
    color: var( --secondary-text-color );
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 24px;
    margin: 0;
    padding: 0;
    text-align: center;
  }

  div.profile {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    gap: 16px;
    padding: 16px 0 0 0;
    position: relative;
    width: 100%;
  }

  div.value {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;    
    left: calc( 50% - 24px );
    position: absolute;
    top: 78px;
  }

  div.value button {
    border-radius: 48px;
    box-shadow:
      0 0 3px rgba(0, 0, 0, 0.6),
      0 0 10px rgba(0, 0, 0, 0.4);            
    height: 48px;
    width: 48px;
  }
</style>
