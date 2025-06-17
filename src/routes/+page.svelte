<script>
  import '@fontsource-variable/roboto';
  import {onMount} from "svelte";  
  import Account from '$lib/comp/view/Account.svelte';  
  import Analytics from "$lib/comp/view/Analytics.svelte";
  import AppBar from "$lib/comp/AppBar.svelte";
  import {DexieCloud} from "$lib/DexieCloud.svelte.js";
  import Drawer from "$lib/comp/view/Drawer.svelte";  
  import Icon from '@iconify/svelte';  
  import IconButton from "$lib/comp/IconButton.svelte";
  import Map from "$lib/comp/view/Map.svelte";
  import NavigationBar from "$lib/comp/NavigationBar.svelte";
  import NavigationItem from "$lib/comp/NavigationItem.svelte";
  import Photos from "$lib/comp/view/Photos.svelte";
  import Review from "$lib/comp/view/Review.svelte";
  import Timeline from "$lib/comp/view/Timeline.svelte";

  let account;
  let detail;
  let drawer;

  let count = $state( {} );
  let data = $state();
  let reviews = $state( [] );  
  let settings = $state( {
    id: crypto.randomUUID(),
    book: null
  } );
  let view = $state( 1 );

  let book = $derived( settings.book );
  let colors = $derived( data?.tastes.reduce( ( acc, curr ) => {
    acc[curr.singular] = curr.primary;      
    return acc;
  }, {} ) );
  let flavor = $derived( book === null ? null : data.tastes[book] );  
  let photos = $derived.by( () => {
    return reviews.reduce( ( acc, curr ) => {
      if( curr.photos !== null ) {
        for( let p = 0; p < curr.photos.length; p++ ) {
          acc.push( {
            id: curr.id,
            created_at: new Date( curr.created_at.getTime() ),
            data: curr.photos[p].data,
            favorite: curr.favorite
          } );
        }
      }
      return acc;
    }, [] );
  } );  
  let places = $derived.by( () => {
    return reviews.reduce( ( acc, curr ) => {
      if( curr.latitude !== null ) {
        acc.push( {
          id: curr.id,
          color: colors[curr.type],
          latitude: curr.latitude, 
          longitude: curr.longitude
        } );
      }
      return acc;
    }, [] );
  } );
  let subtitle = $derived.by( () => {
    if( book === null ) return `You have made ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`;    
    if( reviews.length === 0 ) return 'There are no reviews for this flavor';
    return `You have made ${reviews.length} ${flavor.singular.toLowerCase()} ${reviews.length === 1 ? 'review' : 'reviews'}`;
  } );
  let theme = $derived( flavor === null ? '#5fb2ff' : flavor.primary );  

  const db = new DexieCloud();

  onMount( () => {
    fetch( '/flavors.json' )
    .then( ( response ) => response.json() )
    .then( ( catalog ) => {
      // console.log( 'MAIN USER' );
      // console.log( db.userId );
      const active = catalog.tastes.filter( ( item ) => item.active );
      active.sort( ( a, b ) => {
        if( a.singular > b.singular ) return 1;
        if( a.singular < b.singular ) return -1;    
        return 0;
      } );      
      catalog.tastes = [... active];
      data = catalog;

      db.readSettings().then( ( result ) => {
        if( result !== null ) {
          settings = result;

          if( flavor === null ) {
            return db.browseReview();          
          } else {
            return db.browseReview( flavor.singular );          
          }
        } else {
          return db.browseReview();          
        }
      } ).then( ( result ) => {
        reviews = [... result];
        return db.countReview();
      } ).then( ( result ) => {
        count = result;
      } );
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

  function onAccountClick() {
    console.log( 'SHOW ACCOUNT: ' + db.userId );
    account.show();
  }

  function onAddClick() {
    if( db.userId === 'unauthorized' ) {
      db.countReviews().then( ( count ) => {
        if( count >= 3 ) {
          const result = confirm( 'Create an account to continue?' );
          if( result ) {
            account.show();
          }
        } else {
          detail.show();
        }
      } );
    } else {
      detail.show();
    }
  }

  function onBookChange( id ) {
    reviews = [];

    if( id === null ) {
      settings.book = null;
      db.updateSettings( settings );
      db.browseReview().then( ( result ) => reviews = [... result] );
    } else {
      settings.book = data.tastes.findIndex( ( item ) => item.id === id );
      db.updateSettings( settings );
      db.browseReview( flavor.singular ).then( ( result ) => reviews = [... result] );
    }

    drawer.hide();
  }

  function onMapChange( id ) {
    detail.show( id );
  }

  function onPhotosChange( id ) {
    detail.show( id );
  }

  function onReviewChange() {
    db.browseReview( flavor.singular ).then( ( result ) => reviews = [... result] );
    db.countReview().then( ( result ) => count = result );
  }

  function onTimelineChange( id ) {
    detail.show( id );
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
      <IconButton 
        name="material-symbols:account-circle" 
        onclick={onAccountClick} />      
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
    <Analytics {flavor} hidden={view === 0 ? false : true} items={reviews} />      
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
    <Photos items={photos} onchange={onPhotosChange}>
      <div class="empty">
        <p class="photos">Empty Photos</p>
        <p class="photos">There are no reviews with photos.</p>                
      </div>
    </Photos>
  {:else if view === 3}
    <Map items={places} onchange={onMapChange} />  
  {/if}

  {#if flavor}
    <button class="fab" onclick={onAddClick} type="button">
      <span>
        <Icon 
          height="24" 
          icon="material-symbols:add" 
          width="24" />
      </span>
    </button>
  {/if}
</section>

<Drawer 
  bind:this={drawer}
  {count}
  items={data && data.tastes ? data.tastes : null} 
  onchange={onBookChange} 
  selected={flavor ? flavor.id : null} />

<Review 
  bind:this={detail}
  flavor={flavor ? flavor : null}
  onchange={onReviewChange} />

<Account bind:this={account} onchange={onReviewChange} />

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
