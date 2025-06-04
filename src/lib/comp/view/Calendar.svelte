<script>
  import {onMount} from "svelte";
  import Icon from "@iconify/svelte";
  import Month from "../Month.svelte";

  let {
    display = new Date(), 
    label, 
    name,
    onchange, 
    onclose, 
    onsave, 
    value
  } = $props();

  let valueLabel = $derived.by( () => {
    let calendar = new Date( display.getTime() );

    if( value !== null ) {
      calendar = new Date( value.getTime() );
    }
    
    return new Intl.DateTimeFormat( navigator.language, {
      day: 'numeric',
      month: 'short',
      weekday: 'short',
      year: 'numeric'
    } ).format( calendar );
  } );

  let months = $state( [] );
  let weekDays = $state( [] );

  onMount( () => {
    const weekday = new Intl.DateTimeFormat( navigator.language, {
      weekday: 'narrow'
    } );

    let calendar = new Date();   
    calendar.setDate( 1 );   
    calendar.setDate( calendar.getDate() - calendar.getDay() );
    
    for( let d = 0; d < 7; d++ ) {
      weekDays.push( weekday.format( calendar ) );
      calendar.setDate( calendar.getDate() + 1 );
    }

    // Months
    calendar = new Date();       
    calendar.setDate( 15 );

    for( let m = 0; m < 6; m++ ) {
      months.push( new Date( calendar.getTime() ) );
      calendar.setMonth( calendar.getMonth() - 1 );
    }
  } );

  function onMonthChange( date ) {
    value = new Date( date.getTime() );
    if( onchange ) onchange( {name, value} );
  }
</script>

<section>
  <p>{label}</p>
  <h3>{valueLabel}</h3>
  <ul>
    {#each weekDays as day}
      <li>{day}</li>
    {/each}
  </ul>
  <article>
    {#each months as month}
      <Month display={month} onchange={onMonthChange} />
    {/each}
  </article>
  <footer>
    <button onclick={onclose} type="button">Cancel</button>
    <button onclick={onsave} type="button">Ok</button>
  </footer>
</section>

<style>
  article {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column-reverse;
    flex-grow: 1;
    margin: 0;       
    overflow: auto;
    padding: 0;    
  }

  footer {
    align-items: center;
    border-top: solid 1px #00000010;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-end;
    margin: 0;
    padding: 8px 12px 12px 12px;
  }

  footer button {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var( --primary-accent-color );
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;    
    margin: 0;
    outline: none;
    padding: 10px 12px 10px 12px;
  }  

  h3 {
    box-sizing: border-box;
    border-bottom: solid 1px #00000010;
    color: var( --primary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 32px;
    margin: 0;
    padding: 0 0 12px 48px;
  }

  p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.50px;
    line-height: 20px;
    margin: 0;
    padding: 0 0 0 48px;
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
    width: 100%;
  }

  ul {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat( 7, 1fr );    
    list-style: none;
    margin: 0;
    padding: 0 12px 0 12px;
  }

  ul li {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin: 0;
    padding: 8px 0 8px 0;
    text-align: center;
  }
</style>
