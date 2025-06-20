<script>
  import Icon from "@iconify/svelte";

  let {
    label, 
    name, 
    onchange, 
    placeholder = 'Add photos', 
    readonly = false, 
    value = null
  } = $props();

  let files = $state( [] );  
  let index = $state( 0 );
  let multiple = $state( true );  

  const compression = 0.80;
  const constraint = 1800;

  let canvas = $state();
  let input = $state();

  // This is a no-no
  // But I cannot think of a better way
  $effect( () => {
    if( value === null ) {
      files = [];
      index = 0;
    }
  } );

  function onAddClick() {
    input.click();    
  }

  function onDeleteClick() {
    value.splice( index, 1 );   
    value = value.length === 0 ? null : [... value]; 
    index = index === 0 ? 0 : index - 1;

    if( onchange ) onchange( {name, value} );
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

    const photo = {
      id: crypto.randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
      data: canvas.toDataURL( format, compression ),
      format: format,
      name: named,
      extension: named.substring( extension ),
      width: width,
      height: height
    };

    if( value === null ) {
      value = [photo];
    } else {
      value = [... value, photo];
    }

    index = value.length - 1;

    evt.target.remove();

    if( onchange ) onchange( {name, value} );
  }

  function onInputChange( evt ) {
    if( input.files.length > 0 ) {
      files = [... input.files];
      input.value = '';
    }    
  }

  function onNextClick() {
    index = index === value.length - 1 ? 0 : index + 1;    
  }

  function onPreviousClick() {
    index = index === 0 ? value.length - 1 : index - 1;  
  }
</script>

{#if readonly} 
  {#if value !== null}
    <figure>
      <img 
        alt="Cigar" 
        src={value[index].data ? value[index].data : value[index].storage_url} />

      {#if value.length > 1}
        <button 
          aria-label="Previous photo" 
          onclick={onPreviousClick} 
          class="left" 
          type="button">
          <Icon width="24" height="24" icon="material-symbols:chevron-left" />
        </button>
        <button 
          aria-label="Next photo" 
          class="right" 
          onclick={onNextClick} 
          type="button">
          <Icon width="24" height="24" icon="material-symbols:chevron-right" />    
        </button>  
      {/if}      
    </figure>
  {/if}
{:else}
  <figure>
    {#if value === null || value.length === 0}
      <p>{placeholder}</p>
    {:else}
      <img 
        alt={label} 
        src={value[index].data ? value[index].data : value[index].storage_url} />

      {#if value.length > 1}
        <button 
          aria-label="Previous photo" 
          onclick={onPreviousClick} 
          class="left" 
          type="button">
          <Icon width="24" height="24" icon="material-symbols:chevron-left" />
        </button>
        <button 
          aria-label="Next photo" 
          class="right" 
          onclick={onNextClick} 
          type="button">
          <Icon width="24" height="24" icon="material-symbols:chevron-right" />    
        </button>  
      {/if}

      <button 
        aria-label="Delete photo" 
        class="delete" 
        onclick={onDeleteClick} 
        type="button">
        <Icon width="24" height="24" icon="material-symbols:delete-outline" />
      </button>    
    {/if}

    <button 
      aria-label="Add photo" 
      class="add" 
      onclick={onAddClick} 
      type="button">
      <Icon width="24" height="24" icon="material-symbols:add-a-photo-outline" />
    </button>          

    {#each files as file}
      <img 
        alt="Loader. Not seen." 
        class="loader"
        data-name={file.name}
        data-type={file.type}
        onload={onImageLoad} 
        src={URL.createObjectURL( file )} />
    {/each}

    <canvas bind:this={canvas}></canvas>
    <input 
      accept="image/*" 
      bind:this={input}
      {multiple}
      onchange={onInputChange} 
      type="file" />         
  </figure>
{/if}

<style>
  button {
    align-items: center;
    appearance: none;
    background: var( --primary-accent-color );    
    border: none;
    border-radius: 40px;
    box-sizing: border-box;
    color: #ffffff;    
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    margin: 0;
    outline: none;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 40px;
    z-index: 50;
  }

  button.add {
    bottom: 16px;
    right: 16px;
  }

  button.delete {
    bottom: 16px;
    left: 16px;
  }

  button.left {
    left: 16px;
    top: calc( 50% - 20px );
  }

  button.right {
    right: 16px;
    top: calc( 50% - 20px );
  }  

  canvas {
    display: none;
  }

  figure {
    align-items: center;
    background: #f4f4f4;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    min-height: 225px;
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;
  }

  figure p {
    box-sizing: border-box;
    color: #49454F;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }

  input {
    display: none;
  }

  img {
    height: 225px;
    object-fit: cover;
    width: 100%;
  }

  img.loader {
    display: none;
  }
</style>
