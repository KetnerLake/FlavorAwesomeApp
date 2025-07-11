<script>
  import { onMount } from "svelte";  
  import AppBar from "../AppBar.svelte";
  import Checkout from "./Checkout.svelte";  
  import { DexieCloud } from "$lib/DexieCloud.svelte.js";
  import Icon from "@iconify/svelte";  
  import IconButton from "../IconButton.svelte";
  import Input from "../Input.svelte";
  import Settings from "./Settings.svelte";
  import Verification from "./Verification.svelte";

  let {logged = false, onchange, tastes, user = null} = $props();

  let db = new DexieCloud();
  let interaction = $state( null );  
  let mode = $state( null );  
  let screen;

  let login = db.ui.subscribe( ( evt ) => {
    console.log( 'INTERACTION EVENT' );
    console.log( evt );

    if( evt ) {
      mode = null;
      interaction = evt;
    } else {
      interaction = null;
    }
  } );    

  export function hide() {
    return screen.animate( [
      {top: 0},
      {top: '100vh'}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'      
    } ).finished.then( () => {
      mode = null;
      screen.style.display = 'none';
    } );
  }

  export function show( payment = null ) {
    mode = payment;
    screen.style.display = 'flex';
    screen.animate( [
      {top: '100vh'},
      {top: 0}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    } );
  }  

  function onAccountLogout() {
    const result = confirm( 'Are you sure you want to logout?' );
    if( result ) db.logout();
  }

  function onAccountVerify( email ) {
    console.log( 'VERIFY: ' + email );
    db.login( email );
  }

  function onCheckout( product ) {
    fetch( '/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        product
      } )
    } )
    .then( ( response ) => response.json() )
    .then( ( result ) => {
      console.log( result );
      window.location = result.session.url;
    } );
  }

  function onCloseClick() {
    hide();
  }

  function onVerifyToken( otp ) {
    console.log( 'OTP: ' + otp );
    interaction.onSubmit( {otp} );
  }
</script>

<section bind:this={screen}>
  <AppBar 
    label="Account" 
    variation="sm" 
    --primary-accent-color="#5fb2ff">
    {#snippet left()}
      <div class="spacer"></div>
    {/snippet}    
    {#snippet right()}
      <IconButton name="material-symbols:close" onclick={onCloseClick} /> 
      <!-- IF USER: <IconButton name="material-symbols:done" onclick={onCloseClick} /> -->
    {/snippet}
  </AppBar>
  <article>
    {#if logged}
      <Settings email={user} onlogout={onAccountLogout} tastes={tastes} />
    {:else if interaction}
      <Verification ontoken={onVerifyToken} />
    {:else}
      <Checkout {mode} oncheckout={onCheckout} onverify={onAccountVerify} />
    {/if}    
  </article>
</section>

<style>
  article {
    align-items: center;
    display: flex;    
    flex-basis: 0;
    flex-direction: row;
    flex-grow: 1;
    height: 100%;
    overflow: scroll;
    padding: 0;  
  }

  article > div {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 16px;
    padding: 16px 0 16px 0;
    min-width: 100%;
  }

  div.spacer {
    min-width: 8px;
  }

  section {
    background: #ffffff;
    box-sizing: border-box;
    display: none;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    left: 0;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    top: 100vh;
    transition: top 0.30s ease-in-out;
    width: 100%;
    z-index: 125;
  }
</style>
