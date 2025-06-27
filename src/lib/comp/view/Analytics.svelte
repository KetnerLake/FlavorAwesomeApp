<script>
  import { DexieCloud } from "$lib/DexieCloud.svelte";
  import { onMount } from "svelte";
  import Switch from "../Switch.svelte";
  import Wheel from "../Wheel.svelte";

  let {
    flavor = null, 
    hidden = false, 
    items = [], 
    recommendations = []
  } = $props();

  let all = $state( false );

  let first = $derived( items.length > 0 ? items[items.length - 1].created_at : null );
  let last = $derived( items.length > 0 ? items[0].created_at : null );  
  let entries = $derived( items.length );
  let photos = $derived( items.reduce( ( acc, curr ) => {
    acc = acc + ( curr.photos === null ? 0 : curr.photos.length );
    return acc;
  }, 0 ) );
  let day = $derived.by( () => {
    if( items.length === 0 ) return null;

    const days = {};

    for( let i = 0; i < items.length; i++ ) {
      if( days.hasOwnProperty( items[i].created_at.getDay() ) ) {
        days[items[i].created_at.getDay()] = days[items[i].created_at.getDay()] + 1;
      } else {
        days[items[i].created_at.getDay()] = 1;        
      }
    }

    let maximum = 0;
    let result = 0;
    
    const keys = Object.keys( days );

    for( let k = 0; k < keys.length; k++ ) {
      if( days[keys[k]] > maximum ) {
        maximum = days[keys[k]];
        result = keys[k];
      }
    }

    return result;
  } );
  let time = $derived.by( () => {
    if( items.length === 0 ) return null;

    const hours = {};

    for( let i = 0; i < items.length; i++ ) {
      if( hours.hasOwnProperty( items[i].created_at.getHours() ) ) {
        hours[items[i].created_at.getHours()] = hours[items[i].created_at.getHours()] + 1;
      } else {
        hours[items[i].created_at.getHours()] = 1;        
      }
    }

    let maximum = 0;
    let result = 0;
    
    const keys = Object.keys( hours );

    for( let k = 0; k < keys.length; k++ ) {
      if( hours[keys[k]] > maximum ) {
        maximum = hours[keys[k]];
        result = keys[k];
      }
    }

    return result;
  } );  

  let ratings = $derived( items.reduce( ( acc, curr ) => {
    acc = acc + ( curr.rating === null ? 0 : 1 );
    return acc;
  }, 0 ) );  
  let average = $derived.by( () => {
    const total = items.reduce( ( acc, curr ) => {
      acc = acc + ( curr.rating === null ? 0 : curr.rating );
      return acc;
    }, 0 );
    return ratings === 0 ? 0 : total / ratings;
  } );
  let median = $derived.by( () => {
    const range = items.reduce( ( acc, curr ) => {
      if( curr.rating !== null ) {
        acc.push( curr.rating );
      }
      return acc;
    }, [] );

    if( range.length === 0 ) return 0;

    range.sort( ( a, b ) => {
      if( a > b ) return 1;
      if( a < b ) return -1;
      return 0;
    } );    
    const middle = Math.floor( range.length / 2 );

    if( range.length % 2 === 0 ) {
       return (range[middle - 1] + range[middle] ) / 2;      
     } else {
       return range[middle];
     }    
  } );  
  let mode = $derived.by( () => {
    const range = items.reduce( ( acc, curr ) => {
      if( curr.rating !== null ) {
        acc.push( curr.rating );
      }
      return acc;
    }, [] );

    if( range.length === 0 ) return [];

    const map = {};
    const modes = [];

    let maximum = 0;    

    for( const num of range ) {
      map[num] = ( map[num] || 0 ) + 1;
      if( map[num] > maximum ) {
        maximum = map[num];
      }
    }

    for( const num in map ) {
      if( map[num] === maximum ) {
        modes.push( Number( num ) );
      }
    }

    if( modes.length === Object.keys( map ).length ) {
      return [];
    }    

    return modes;
  } );

  let spokes = $derived.by( () => {
    if( flavor ) {
      for( let f = 0; f < flavor.fields.length; f++ ) {
        if( flavor.fields[f].kind === 'profile' ) {
          return flavor.fields[f].options;
        }
      }

      return [];
    }

    return [];
  } );
  let profiled = $derived.by( () => {
    if( !items || items === null ) return 0;

    const counter = items.reduce( ( acc, curr ) => {
      if( curr.profile !== null ) {
        acc = acc + 1;
      }

      return acc;
    }, 0 );

    return counter;
  } );
  let chart = $derived.by( () => {
    if( spokes.length === 0 ) {
      const blank = new Array( 16 );
      blank.fill( 0 );
      return blank;
    }

    let totals = new Array( spokes.length )
    totals.fill( 0 );

    for( let i = 0; i < items.length; i++ ) {
      if( items[i].profile !== null ) {
        for( let p = 0; p < items[i].profile.length; p++ ) {
          totals[p] = totals[p] + items[i].profile[p];
        }
      }
    }

    totals = totals.map( ( value ) => value / profiled );
    return totals;
  } );
  let charts = $derived.by( () => {
    const filtered = items.filter( ( value ) => value.profile === null ? false : true ).map( ( value ) => value.profile );
    filtered.push( chart );
    return filtered;
  } );

  let favorites = $derived.by( () => {
    if( !items || items === null || items.length === 0 ) return null;
    return items.filter( ( value ) => value.favorite );
  } );  
  let streak = $derived.by( () => {
    if( !items || items === null || items.length === 0 ) return 0;    

    const dates = items.map( ( value ) => value.created_at );
    dates.sort( ( a, b ) => {
      if( a.getTime() > b.getTime() ) return 1;
      if( a.getTime() < b.getTime() ) return -1;
      return 0;
    } );

    let longest = 0;
    let current = 1;

    for( let d = 1; d < dates.length; d++ ) {
      const prev = new Date( dates[d - 1].getTime() );
      const curr = new Date( dates[d].getTime() );
      
      const after = new Date( prev.getTime() );
      after.setDate( after.getDate() + 1 );

      if( 
        after.getFullYear() === curr.getFullYear() &&
        after.getMonth() === curr.getMonth() &&
        after.getDate() === curr.getDate() 
      ) {
        current++;
      } else {
        longest = Math.max( longest, current );
        current = 1;
      }
    }

    longest = Math.max( longest, current );

    return longest;
  } );

  const db = new DexieCloud();

  onMount( () => {
    db.readSettings().then( ( result ) => {
      all = result.all && result.all[flavor.singular] ? result.all[flavor.singular] : false;
    } );  
  } );

  function formatDate( value ) {
    return new Intl.DateTimeFormat( navigator.language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    } ).format( value );
  }

  function formatDay( value ) {
    const date = new Date();
    const distance = value - date.getDay();
    date.setDate( date.getDate() + distance );

    const weekday = new Intl.DateTimeFormat( navigator.language, {
      weekday: 'long'
    } );  

    return weekday.format( date );
  }

  function formatTime( hours, minutes = null ) {
    const today = new Date();
    const date = new Date();
    date.setHours( hours );
    
    const options = {
      hour: 'numeric', 
      hour12: true
    };

    if( minutes !== null ) {
      options.minute = '2-digit';
      date.setMinutes( minutes );
    }

    return date.toLocaleTimeString( navigator.language, options );
  }

  function onAllChange( value ) {
    db.readSettings().then( ( result ) => {
      if( !result.all ) {
        result.all = {};
      }
      
      result.all[flavor.singular] = value;

      return db.updateSettings( result );
    } );
    all = value;
  }
</script>

<article class:hidden>
  <h3>At a Glance</h3>
  <div class="stats">
    <div style="grid-column: span 2;">
      <p>
        {#if first === null}
          None
        {:else}
          {formatDate( first )} @ {formatTime( first.getHours(), first.getMinutes() )}
        {/if}
      </p>
      <p class="label">First review</p>
    </div>
    <div style="grid-column: span 2;">
      <p>
        {#if first === null}
          None
        {:else}
          {formatDate( last )} @ {formatTime( last.getHours(), last.getMinutes() )}
        {/if}        
      </p>
      <p class="label">Most recent review</p>
    </div>
    <div>
      <p>{entries}</p>      
      <p class="label">Reviews made</p>
    </div>
    <div>
      <p>{photos}</p>      
      <p class="label">Reviews with photos</p>
    </div>
    <div>
      <p>{favorites ? favorites.length : 0}</p>      
      <p class="label">Favorite reviews</p>
    </div>  
    <div>
      <p>{streak}</p>      
      <p class="label">Longest daily streak</p>
    </div>  
    <div>
      <p>{day === null ? 'TBD' : formatDay( day )}</p>      
      <p class="label">Average review day</p>
    </div>
    <div>
      <p>{time === null ? 'TBD' : formatTime( time )}</p>      
      <p class="label">Average review time</p>
    </div>        
  </div>
  <h3>Ratings</h3>
  <div class="stats">
    <div>
      <p>{ratings}</p>
      <p class="label">Reviews with ratings</p>      
    </div>
    <div>
      <p>{average.toFixed( 2 )}</p>      
      <p class="label">Average rating</p>
    </div>
    <div>
      <p>{median.toFixed( 2 )}</p>      
      <p class="label">Middle rating</p>
    </div>    
    <div>
      <p>{mode.length === 0 ? '0' : mode.join( ', ' )}</p>      
      <p class="label">Most frequent</p>
    </div>        
  </div>   
  {#if flavor}
    <div class="profile">
      <h3>Profile</h3>
      <Switch onchange={onAllChange} label="Show all" selected={all} />
    </div>
    <div class="wheel">
      <Wheel {spokes} value={all ? charts : chart}></Wheel>
    </div>
    <h3>Recommendations</h3>
    {#if recommendations.length === 0}
      <div class="recommendations empty">
        <p>AI-based recommendations will appear here once you have three or more favorite reviews.</p>
      </div>
    {:else}
      <ul class="recommendations">
        {#each recommendations as suggest}
          <li>
            <p>{suggest.name}</p>
            <p class="description">{suggest.description}</p>
            <p class="price">Estimated price: ${suggest.price.toFixed( 2 )}</p>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</article>

<style>
  article {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    gap: 16px;
    margin: 0;
    overflow: auto;
    padding: 0 0 16px 0;
  }

  article.hidden {
    display: none;
  }

  div.profile {
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 16px 16px 0 0;
  }

  div.recommendations.empty {
    align-items: center;
    aspect-ratio: 1.0;
    border: dashed #00000010 4px;
    border-radius: 16px;    
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 16px 0 16px;
    width: calc( 100% - 32px );
  }

  div.recommendations.empty p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 20px;
    margin: 0;
    padding: 0 32px 0 32px;
    text-align: center;
  }  

  div.stats {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat( 2, 1fr );
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    padding: 0 16px 0 16px;
  }

  div.stats > div {
    background-color: #00000010;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    padding: 12px;
  }

  div.wheel {
    padding: 0 16px 0 16px;
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
    padding: 16px 16px 0 16px;
  }

  div.profile h3 {
    flex-basis: 0;
    flex-grow: 1;
    padding: 0 0 0 16px;
  }

  p {
    box-sizing: border-box;
    color: var( --primary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }

  p.description {
    font-weight: 400;
  }

  p.label {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    font-family: 'Roboto Variable', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 18px;
  }

  p.price {
    color: var( --secondary-text-color );
    font-size: 14px;
    font-weight: 400;
  }

  ul.recommendations {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;
    margin: 0 16px 0 16px;
    padding: 0;
  }

  ul.recommendations li {
    background: rgb( from var( --primary-accent-color ) r g b / 0.12 );
    border-radius: 16px;
    padding: 16px;
  }
</style>
