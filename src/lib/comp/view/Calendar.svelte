<script>
  import {onMount} from "svelte";
  import Icon from "@iconify/svelte";
  import Month from "../Month.svelte";

  let {
    display = new Date(), 
    label, 
    name,
    onchange, 
    value = new Date()
  } = $props();

  let monthLabel = $derived.by( () => {
    return new Intl.DateTimeFormat( navigator.language, {
      month: 'long',
      year: 'numeric'
    } ).format( display );
  } );

  let valueLabel = $derived.by( () => {
    return new Intl.DateTimeFormat( navigator.language, {
      day: 'numeric',
      month: 'short',
      weekday: 'short',
      year: 'numeric'
    } ).format( value ? value : new Date() );
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
  } );

  function onBeforeClick() {
    let month = display.getMonth();
    let year = display.getFullYear();

    year = ( month === 0 ) ? year - 1 : year;
    month = ( month === 0 ) ? 11 : month - 1;

    display = new Date(
      year,
      month,
      display.getDate()
    );
  }

  function onNextClick() {
    let month = display.getMonth();
    let year = display.getFullYear();
    
    year = ( month === 11 ) ? year + 1 : year;
    month = ( month + 1 ) % 12;
    
    display = new Date(
      year,
      month,
      display.getDate()
    );
  }

  function onMonthChange( date ) {
    value = new Date( date.getTime() );
    if( onchange ) onchange( {name, value} );
  }

  function onTodayClick() {
    value = new Date();
    if( onchange ) onchange( {name, value} );    
  }
</script>

<section>
  <p>{label}</p>
  <h3>{valueLabel}</h3>
  <div>
    <p>{monthLabel}</p>
    <button onclick={onBeforeClick} type="button">
      <Icon height="24" icon="material-symbols:navigate-before" width="24" />
    </button>
    <button onclick={onNextClick} type="button">
      <Icon height="24" icon="material-symbols:navigate-next" width="24" />
    </button>    
  </div>
  <ul>
    {#each weekDays as day}
      <li>{day}</li>
    {/each}
  </ul>
  <article>
    <Month {display} onchange={onMonthChange} {value} />
  </article>
  <footer>
    <button onclick={onTodayClick} type="button">Today</button>
  </footer>
</section>

<style>
  article {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    margin: 0;       
    padding: 0;    
  }

  div {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 8px 12px 0 21px;    
  }

  div button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var( --primary-accent-color );
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0;
    width: 40px;    
  }

  div p {
    flex-basis: 0;
    flex-grow: 1;
    font-size: 16px;
    font-weight: 400;
    line-height: 40px;
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
    padding: 0 0 12px 21px;
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
    padding: 0 0 0 21px;
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
