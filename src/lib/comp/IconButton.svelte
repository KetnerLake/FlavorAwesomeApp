<script>
  import Icon from "@iconify/svelte";  

  let {name, onclick, size = 'md'} = $props();

  let buttonSize = $derived.by( () => {
    let result = 40;

    switch( size ) {
      case 'sm':
        result = 32;
        break;
      case 'xl':
        result = 56;
        break;
      case '2xl':
        result = 96;
        break;
      default:
        result = 136;
        break;    
    }

    return result;
  } );

  let iconSize = $derived.by( () => {
    let result = 24;

    switch( size ) {
      case 'sm':
        result = 20;
        break;
      case 'xl':
        result = 32;
        break;
      case '2xl':
        result = 40;
        break;
      default:
        result = 24;
        break;    
    }

    return result;
  } );
</script>

<button 
  {onclick} 
  style:height={buttonSize} 
  style:width={buttonSize} 
  type="button">
  <Icon height={iconSize} icon={name} width={iconSize} />
</button>

<style>
  button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    border-radius: 40px;
    box-sizing: border-box;
    color: var( --icon-button-color, #ffffff );
    cursor: pointer;
    display: inline-flex;
    height: var( --icon-button-size, 40px );
    justify-content: center;
    margin: var( --icon-button-margin, 0 );
    outline: none;
    padding: 0;
    width: var( --icon-button-size, 40px );
    -webkit-tap-highlight-color: transparent;
  }
</style>
