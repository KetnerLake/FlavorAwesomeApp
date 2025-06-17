<script>
  import { onMount } from "svelte";  
  import AppBar from "../AppBar.svelte";
  import { DexieCloud } from "$lib/DexieCloud.svelte";  
  import Icon from "@iconify/svelte";  
  import IconButton from "../IconButton.svelte";
  import Input from "../Input.svelte";

  let {onchange} = $props();

  let db = new DexieCloud();
  let screen;

  let email = $state( null );
  let interaction = $state( null );
  let name = $state( null );
  let otp = $state( null );
  let ui = $derived( interaction === null ? 'sign_in' : interaction.type );

  export function hide() {
    return screen.animate( [
      {top: 0},
      {top: '100vh'}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'      
    } ).finished;
  }

  export function show() {
    screen.animate( [
      {top: '100vh'},
      {top: 0}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    } );
  }  

  onMount( () => {
    console.log( 'CURRENT' );
    console.log( db.userId );

    db.ui.subscribe( ( o ) => {
      console.log( 'INTERACTION' );
      console.log( o );
      if( o === undefined ) {
        console.log( 'INTERACTION:USER' )
        console.log( db.userId );

        if( db.userId !== 'unauthorized' ) {
          console.log( 'INTERACTION: LOGGED IN' );
          db.sync().then( () => {
            console.log( 'INTERACTION: INITIAL SYNC' );
            if( onchange ) onchange();
          } );
        }

        interaction = null;
      } else {
        console.log( 'MESSAGE' );
        console.log( o.messageCode )        
        interaction = o;
      }
    } );

    /*
    db.user.subscribe( ( o ) => {
      console.log( 'USER' );
      console.log( o );
    } );
    */
  } );

  function onCloseClick() {
    hide();
  }

  function onSendClick() {
    if( name === null ) {
      alert( 'Name is required.' );
      return;
    }

    if( email === null ) {
      alert( 'Email address is required.' );
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if( !regex.test( email ) ) {
      alert( 'Email address is invalid.' );
      return;
    }

    console.log( 'SEND: ' + email );
    db.login( email );
  }

  function onLogoutClick() {
    db.logout();
  }

  function onSignClick() {
    console.log( 'OTP: ' + otp );
    interaction.onSubmit( {otp} );
  }

  $inspect( otp );
</script>

<section bind:this={screen}>
  <AppBar 
    label="Account" 
    variation="sm" 
    --primary-accent-color="#5fb2ff">
    {#snippet left()}
      <IconButton name="material-symbols:close" onclick={onCloseClick} />
    {/snippet}    
    {#snippet right()}
      <IconButton name="material-symbols:done" />
    {/snippet}
  </AppBar>
  <article>
    {#if ui === 'otp'}
      <form>
        <Input 
          label="OTP" 
          onchange={( evt ) => otp = evt.value }
          placeholder="One-time password from email" 
          --primary-accent-color="#5fb2ff" />    
        <button onclick={onSignClick} type="button">Sign in</button>
      </form>      
    {:else}
      <img alt="Feature details" />
      <ul class="upsell">
        <li>✅ All features</li>
        <li>✅ All flavors</li>
        <li>✅ Unlimited reviews</li>
        <!--
        <li>✅ Cloud backup</li>
        <li>✅ Device synchronization</li>
        -->      
      </ul>
      <ul class="steps">
        <li class="selected">
          <p>
            <span>
              <Icon height="24" icon="mynaui:one-circle-solid" width="24" />
            </span>
            Create an<br/>account
          </p>
        </li>
        <li>
          <p>
            <span>
              <Icon height="24" icon="mynaui:two-circle" width="24" />
            </span>
            Select<br/>a plan
          </p>
        </li>      
        <li>
          <p>
            <span>
              <Icon height="24" icon="mynaui:three-circle" width="24" />
            </span>
            Enjoy the<br/>Awesome
          </p>
        </li>      
      </ul>
      <form>
        <Input 
          label="Name" 
          placeholder="How should I refer to you?" 
          onchange={( evt ) => name = evt.value} 
          --primary-accent-color="#5fb2ff" />
        <Input 
          label="Email address" 
          placeholder="Use email to login" 
          onchange={( evt ) => email = evt.value} 
          --primary-accent-color="#5fb2ff" />    
        <button onclick={onSendClick} type="button">Send verification</button>
        <button onclick={onLogoutClick} type="button">Logout</button>        
      </form>
    {/if}
  </article>
</section>

<style>
  article {
    align-items: center;
    display: flex;    
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    gap: 16px;    
    width: 100%;
  }

  button {
    align-self: center;
    appearance: none;
    background: #5fb2ff;
    border: none;
    border-radius: 40px;
    color: #ffffff;
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 24px 0 24px 0;
    outline: none;
    padding: 0 16px 0 16px;
  }

  form {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 0;
    padding: 0 16px 0 16px;
    width: 100%;
  }

  img {
    flex-basis: 0;
    flex-grow: 1;
  }

  p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 14px;
    margin: 0;
    padding: 0;
    text-align: center;
  }

  p span {
    color: var( --primary-text-color );
    display: block;
    height: 24px;
    margin: 0 0 2px 0;
  }

  section {
    background: #ffffff;
    box-sizing: border-box;
    display: flex;
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
    width: 100vw;
    z-index: 125;
  }  

  ul.steps {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    list-style: none;
    margin: 0;
    padding: 24px 0 24px;
    width: 100%;
  }

  ul.steps li {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin: 0;
    opacity: 0.60;
    padding: 0;
  }

  ul.steps li.selected {
    opacity: 1.0;
  }

  ul.upsell {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 60%;
  }

  ul.upsell li {
    box-sizing: border-box;
    color: var( --primary-text-color );
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }
</style>
