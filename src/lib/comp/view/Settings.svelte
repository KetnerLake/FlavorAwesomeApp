<script>
  import { onMount } from "svelte";
  import Avatar from "../Avatar.svelte";
  import { DexieCloud } from "$lib/DexieCloud.svelte";  
  import Icon from "@iconify/svelte";
  import TextField from "../field/TextField.svelte";

  let {email, name, tastes} = $props();

  let db = new DexieCloud();
  
  let settings = $state();

  let matches = $derived.by( () => {
    const result = {};

    if( tastes ) {
      for( let t = 0; t < tastes.length; t++ ) {
        if( settings && settings.selected ) {        
          result[tastes[t].singular] = settings.selected.indexOf( tastes[t].singular ) >= 0 ? true : false;
        } else {
          result[tastes[t].singular] = true;
        }
      }
    }
      
    return result;
  } );

  function onBookClick( book ) {
    if( !settings.hasOwnProperty( 'selected' ) ) {
      settings.selected = {};

      for( let t = 0; t < tastes.length; t++ ) {
        settings.selected[tastes[t].singular] = true;
      }      
    }

    console.log( book );
    settings.selected[book] = !settings.selected[book];
    console.log( settings );
    db.updateSettings( settings );
  }

  function onDeleteClick() {
    const response = window.confirm( 'Are you sure you want to delete all your data?' );
    if( response ) {
      db.deleteReview().then( () => db.deleteSettings() ).then( () => window.location.reload() );
    }
  }

  function onLogoutClick() {
    alert( 'LOGOUT' );
  }

  onMount( () => {
    settings = db.readSettings().then( ( data ) => data ); 
    console.log( settings );
  } );
</script>

<div class="screen">
  <Avatar src={settings && settings.avatar ? settings.avatar : null} />
  <p class="email">{email}</p>
  <form>
    <TextField
      icon="material-symbols:label-outline-rounded"
      label="Name" 
      placeholder="How should I refer to you?" 
      value={name}
      --primary-accent-color="#5fb2ff" />
  </form>

  <div class="heading">
    <span>
      <Icon 
        height="24" 
        icon="material-symbols:book-4-outline-rounded" 
        width="24" />
    </span>
    <h3>Flavors</h3>
    <button type="button">Select none</button>
  </div>
  <ul class="flavor">
    {#each tastes as taste, index}
      <li>
        <span>
          <Icon 
            color={taste.primary} 
            height="24" 
            icon="material-symbols:circle" 
            width="24" />
        </span>
        <p>{taste.singular}</p>
        <button onclick={() => onBookClick( taste.singular )} type="button">
          <Icon 
            height="24" 
            icon={matches && matches.hasOwnProperty( taste.singular ) && matches[taste.singular] === true ? 'material-symbols:check-box-rounded' : 'material-symbols:check-box-outline-blank'}
            width="24" />
        </button>          
      </li>
    {/each}
  </ul>
  <button class="utility" onclick={onDeleteClick} type="button">Delete all data</button>  
  <button class="utility" onclick={onLogoutClick} type="button">Logout</button>
</div>

<style>
  button.utility {
    appearance: none;
    background: #5fb2ff;
    border: none;
    border-radius: 40px;
    color: #ffffff;
    cursor: pointer;
    min-height: 40px;
    margin: auto 16px 0 16px;
    outline: none;
    padding: 0;
  }

  div.heading {
    align-items: center;
    display: flex;
    display: none;
    flex-direction: row;
    margin: 16px 0 0 0;
    padding: 8px 16px 8px 12px;
  }

  div.heading button {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: #5fb2ff;
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0 12px 0 0;
    outline: none;
    padding: 0;
  }

  div.heading h3 {
    flex-basis: 0;
    flex-grow: 1;
    font-size: 16px;
    letter-spacing: 0.50px;
    line-height: 24px;
    text-align: left;
  }

  div.heading span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 0;
    width: 24px;
  }

  div.screen {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 100vw;    
    overflow: auto;
    padding: 16px 0 16px 0;
  }

  form {
    margin: 0;
    padding: 0;
  }

  h3 {
    box-sizing: border-box;
    color: var( --primary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 28px;
    margin: 0;
    padding: 0;
    text-align: center;
  } 

  p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 20px;
    margin: 0;
    padding: 0;
    text-align: center;
  }  

  p.email {
    margin: 16px 0 16px 0;
  }  

  ul.flavor {
    box-sizing: border-box;
    display: none;
    list-style: none;
    margin: 0;
    padding: 0 16px 16px 16px;
  }

  ul.flavor li {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 12px;
    height: 56px;
    padding: 0 0 0 32px;
  }

  ul.flavor li button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    border-radius: 48px;
    color: var( --primary-text-color );
    cursor: pointer;
    display: flex;
    height: 48px;
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0;
    width: 48px;
  }

  ul.flavor li p {
    color: var( --secondary-text-color );
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
    text-align: left;
  }  

  ul.flavor li span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0;
    width: 24px;
  }  
</style>
