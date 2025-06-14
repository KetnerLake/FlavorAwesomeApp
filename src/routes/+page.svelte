<script>
  import '@fontsource-variable/roboto';
  import {onMount} from "svelte";  
  import Analytics from "$lib/comp/view/Analytics.svelte";
  import AppBar from "$lib/comp/AppBar.svelte";
  import {Database} from "$lib/database.js";
  import Drawer from "$lib/comp/view/Drawer.svelte";  
  import Icon from '@iconify/svelte';  
  import IconButton from "$lib/comp/IconButton.svelte";
  import Map from "$lib/comp/view/Map.svelte";
  import NavigationBar from "$lib/comp/NavigationBar.svelte";
  import NavigationItem from "$lib/comp/NavigationItem.svelte";
  import Photos from "$lib/comp/view/Photos.svelte";
  import Review from "$lib/comp/view/Review.svelte";
  import Timeline from "$lib/comp/view/Timeline.svelte";

  let detail;
  let drawer;

  let book = $state( null );
  let data = $state();
  let photos = $state( [] );
  let review = $state( null );
  let reviewing = $state( true );
  let reviews = $state( [] );  
  let screen = $state( 'main' );
  let view = $state( 1 );

  let flavor = $derived( book === null ? null : data.tastes[book] );  
  let subtitle = $derived.by( () => {
    if( book === null ) return `You have made ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`;    
    if( reviews.length === 0 ) return 'There are no reviews for this flavor';
    return `You have made ${reviews.length} ${flavor.singular.toLowerCase()} ${reviews.length === 1 ? 'review' : 'reviews'}`;
  } );
  let theme = $derived( flavor === null ? '#5fb2ff' : flavor.primary );  

  const db = new Database();

  onMount( () => {
    const id = window.localStorage.getItem( 'flavor-book' );

    fetch( '/flavors.json' ).then( ( response ) => response.json() ).then( ( catalog ) => {
      const active = catalog.tastes.filter( ( item ) => item.active );
      active.sort( ( a, b ) => {
        if( a.singular > b.singular ) return 1;
        if( a.singular < b.singular ) return -1;    
        return 0;
      } );      
      catalog.tastes = [... active];
      data = structuredClone( catalog );

      if( data !== null && id !== null ) {
        book = data.tastes.findIndex( ( item ) => item.id === id );   
        db.fields = flavor.fields;
        db.browseReview( flavor.singular ).then( ( data ) => reviews = [... data] );        
      }
    } );
  } );
  
  $effect( () => {
    if( flavor ) {
      document.documentElement.style.setProperty( '--primary-accent-color', flavor.primary );
      document.documentElement.style.setProperty( '--secondary-accent-color', flavor.secondary );    
    } else {
      document.documentElement.style.setProperty( '--primary-accent-color', '#5fb2ff' );
      document.documentElement.style.setProperty( '--secondary-accent-color', '#003f7f' );      
    }
  } );

  function onAddClick() {
    let fields = {id: null};
    
    for( let f = 0; f < flavor.fields.length; f++ ) {
      fields[flavor.fields[f].name] = null;
    }

    review = structuredClone( fields );
    reviewing = false;
    detail.show();
  }

  function onBookChange( id ) {
    if( id === null ) {
      window.localStorage.removeItem( 'flavor-book' );
      book = null;
    } else {
      book = data.tastes.findIndex( ( item ) => item.id === id );
      window.localStorage.setItem( 'flavor-book', id );
      db.browseReview( flavor.singular ).then( ( data ) => {
        reviews = [... data];
      } );
    }

    drawer.hide();
  }

  function onReviewBack() {
    detail.hide().then( () => {
      review = null;
      reviewing = false;
    } );
  }

  function onReviewCancel( id ) {
    if( id === null ) {
      detail.hide().then( () => {
        review = null;
        reviewing = false;
      } )
    } else {
      db.readReview( flavor.singular, id ).then( ( data ) => {
        review = structuredClone( data );
        reviewing = true;
      } );
    }
  }

  function onReviewDelete( id ) {
    db.deleteReview( flavor.singular, id ).then( () => db.browseReview( flavor.singular ) ).then( ( data ) => {
      reviews = [... data];
      detail.hide().then( () => {
        review = null;
        reviewing = false;
      } );
    } );
  }

  function onReviewDone( item ) {
    if( item.id === null ) {
      db.addReview( flavor.singular, item ).then( () => db.browseReview( flavor.singular) ).then( ( data ) => {
        reviews = [... data];
        detail.hide().then( () => {
          review = null;
          reviewing = true;
        } );
      } );
    } else {
      reviewing = true;              
      db.editReview( flavor.singular, item ).then( () => db.browseReview( flavor.singular ) ).then( ( data ) => {
        reviews = [... data];
      } );
    }  
  }

  function onReviewEdit() {
    reviewing = false;
  }

  function onReviewFavorite( id, favorite ) {
    db.favoriteReview( flavor.singular, id, favorite ).then( ( data ) =>  {
      review = structuredClone( data );
      return db.browseReview( flavor.singular );
    } ).then( ( data ) => {
      reviews = [... data];
    } );
  }

  function onTimelineChange( id ) {
    console.log( id );
    db.readReview( flavor.singular, id ).then( ( data ) => {
      reviewing = true;
      review = structuredClone( data );
      detail.show();
    } );
  }
</script>

<svelte:head>
  <link rel="manifest" href="./manifest.json" />
  <meta content={theme} name="theme-color" />
</svelte:head>

<section>
  <AppBar label={flavor ? flavor.phrase : 'Flavor Awesome'} subtitle={subtitle}>
    {#snippet left()}
      <IconButton name="material-symbols:menu" onclick={() => drawer.show()} />
    {/snippet}
    {#snippet right()}
      <IconButton name="material-symbols:search" />
    {/snippet}
  </AppBar>

  <NavigationBar>
    <NavigationItem
      active={view === 0 ? true : false}  
      icon="material-symbols:book-ribbon-outline-rounded" 
      onclick={() => view = 0} />
    <NavigationItem
      active={view === 1 ? true : false}  
      onclick={() => view = 1} 
      label="Timeline" />
    <NavigationItem
      active={view === 2 ? true : false}  
      label="Photos" 
      onclick={() => view = 2} />
    <NavigationItem
      active={view === 3 ? true : false}  
      label="Map"
      onclick={() => view = 3} />     
  </NavigationBar>  

  {#if view === 0}
    <Analytics hidden={view === 0 ? false : true} />      
  {:else if view === 1}
    <Timeline items={reviews} onchange={onTimelineChange}>
      <div class="empty">
        {#if flavor}
          <p>Empty Timeline</p>
          <p>Add a review to get started!</p>
        {:else}
          <p>Select a flavor to get started!</p>
          <button 
            class="m3"
            onclick={() => drawer.show()} 
            type="button">
            Select a flavor
          </button>          
        {/if}
      </div>
    </Timeline>
  {:else if view === 2}
    <Photos items={photos}>
      <div class="empty">
        <p class="photos">Empty Photos</p>
        <p class="photos">There are no reviews with photos.</p>                
      </div>
    </Photos>
  {:else if view === 3}
    <Map />  
  {/if}

  {#if flavor}
    <button class="fab" type="button">
      <span>
        <Icon 
          height="24" 
          icon="material-symbols:add" 
          onclick={onAddClick} 
          width="24" />
      </span>
    </button>
  {/if}
</section>

<Drawer 
  bind:this={drawer}
  items={data && data.tastes ? data.tastes : null} 
  onclose={() => drawer.hide()} 
  onchange={onBookChange} 
  selected={flavor ? flavor.id : null} />

<Review 
  bind:this={detail}
  flavor={flavor ? flavor : null}
  onback={onReviewBack}
  oncancel={onReviewCancel}
  ondelete={onReviewDelete}
  ondone={onReviewDone}
  onedit={onReviewEdit}
  onfavorite={onReviewFavorite}
  readonly={reviewing}
  value={review} />

<style>
  :root {
    --primary-accent-color: transparent;
    --secondary-accent-color: transparent;
    --primary-text-color: #1D1B20;
    --secondary-text-color: #49454F;
  }

  :global( html ) {
    height: 100%;
  }

  :global( body ) {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
    overflow: hidden;
    padding: 0;
  }

  button.fab {
    align-items: center;
    appearance: none;
    background: var( --primary-accent-color );
    border: none;
    border-radius: 48px;
    bottom: 16px;
    box-shadow: 
      0px 3px 1px -2px rgb( 0 0 0 / 20% ), 
      0px 2px 2px 0px rgb( 0 0 0 / 14% ), 
      0px 1px 5px 0px rgb( 0 0 0 / 12% );        
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    height: 48px;
    justify-content: center;
    position: absolute;
    right: 16px;
    width: 48px;
    z-index: 125;
  }

  button.fab span {
    height: 24px;
  }

  button.m3 {
    align-items: center;
    appearance: none;
    background: var( --primary-accent-color );
    border: none;
    border-radius: 40px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.10px;
    line-height: 20px;
    height: 40px;
    margin: 8px 0 0 0;
    padding: 0 16px 0 16px;    
  }

  div.empty {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    gap: 8px;
    justify-content: center;
    margin: 0;
    padding: 0;
  }

  div.empty p {
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.10px;
    line-height: 18px;
    margin: 0;
    padding: 0;
    text-align: center;
  }

  div.empty p:last-of-type {
    font-weight: 400;
  }

  div.empty p.photos {
    color: #f4f4f4;
  }

  section {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: relative;
  }
</style>
