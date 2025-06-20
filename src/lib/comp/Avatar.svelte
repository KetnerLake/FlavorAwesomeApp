<script>
  import Icon from "@iconify/svelte";

  let {value} = $props();

  let file = $state();  

  let canvas;
  let input;

  const compression = 0.80;
  const constraint = 300;  

  function onAvatarClick() {
    input.click();    
  }

  function onImageLoad( evt ) {
    const img = evt.currentTarget;
    const format = img.getAttribute( 'data-type' );    
    const named = img.getAttribute( 'data-name' );
    const extension = named.lastIndexOf( '.' ) + 1;

    let width = img.width;
    let height = img.height;
    
    const longest = Math.max( width, height );
      
    if( longest > constraint ) {
      const ratio = constraint / longest;
      width = width * ratio;
      height = height * ratio;
    }

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext( '2d' );
    context.drawImage( img, 0, 0, width, height );

    value = canvas.toDataURL( format, compression );

    evt.target.remove();

    // if( onchange ) onchange( {name, value} );
  }

  function onInputChange() {
    if( input.files.length > 0 ) {
      file = input.files[0];
      input.value = '';
    }        
  }
</script>

<button onclick={onAvatarClick} type="button">
  {#if value}
    <img alt="Edit avatar" src={value} />
  {:else} 
    <span>
      <Icon 
        height="32"
        icon="material-symbols:person-edit-rounded" 
        width="32" />
    </span>
  {/if}
</button>

{#if file}
  <img 
    alt="Loader. Not seen." 
    class="loader"
    data-name={file.name}
    data-type={file.type}
    onload={onImageLoad} 
    src={URL.createObjectURL( file )} />
{/if}

<canvas bind:this={canvas}></canvas>
<input 
  accept="image/*" 
  bind:this={input}
  onchange={onInputChange} 
  type="file" />

<style>
  button {
    align-self: center;
    appearance: none;
    background: #00000010;
    border: none;
    border-color: var( --secondary-text-color );
    border-style: solid;
    border-width: 1px;
    border-radius: 96px;
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 12px;
    font-weight: 500;
    justify-self: center;
    letter-spacing: 0.50px;
    line-height: 18px;;
    max-height: 96px;
    min-height: 96px;    
    margin: 0;
    outline: none;
    overflow: hidden;
    padding: 0;
    position: relative;
    width: 96px;
  }

  canvas,
  input {
    display: none;
  }

  img {
    box-sizing: border-box;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  img.loader {
    display: none;
  }

  span {
    color: var( --secondary-text-color );
    display: block;
    margin: 4px 0 0 0;
  }
</style>
