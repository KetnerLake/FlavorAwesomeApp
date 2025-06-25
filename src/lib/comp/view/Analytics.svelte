<script>
  import Wheel from "../Wheel.svelte";

  let {flavor = null, hidden = false, items = []} = $props();

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

  function formatDay( value ) {
    const date = new Date();
    const distance = value - date.getDay();
    date.setDate( date.getDate() + distance );

    const weekday = new Intl.DateTimeFormat( navigator.language, {
      weekday: 'long'
    } );  

    return weekday.format( date );
  }

  function formatTime( value ) {
    const today = new Date();
    const date = new Date();
    date.setHours( value );
    
    return date.toLocaleTimeString( navigator.language, {
      hour: 'numeric', 
      hour12: true 
    } );
  }
</script>

<article class:hidden>
  <h3>At a Glance</h3>
  <div class="stats">
    <div>
      <p>{entries}</p>      
      <p class="label">Entries</p>
    </div>
    <div>
      <p>{photos}</p>      
      <p class="label">Photos</p>
    </div>
    <div>
      <p>{day === null ? 'TBD' : formatDay( day )}</p>      
      <p class="label">Day of posts</p>
    </div>
    <div>
      <p>{time === null ? 'TBD' : formatTime( time )}</p>      
      <p class="label">Time of posts</p>
    </div>        
  </div>
  <h3>Ratings</h3>
  <div class="stats">
    <div>
      <p>{ratings}</p>
      <p class="label">Ratings</p>      
    </div>
    <div>
      <p>{average.toFixed( 2 )}</p>      
      <p class="label">Average</p>
    </div>
    <div>
      <p>{median.toFixed( 2 )}</p>      
      <p class="label">Middle</p>
    </div>    
    <div>
      <p>{mode.length === 0 ? '0' : mode.join( ', ' )}</p>      
      <p class="label">Most frequent</p>
    </div>        
  </div>   
  {#if flavor}
    <h3>Profile <span>(average across reviews)</span></h3>
    <div class="wheel">
      <Wheel {spokes} value={chart}></Wheel>
    </div>
    <h3>Recommendations</h3>
    {#if !items || items === null || items.length < 3}
      <div class="recommendations empty">
        <p>AI-based recommendations will appear here once you have three or more reviews.</p>
      </div>
    {:else}
      <div class="recommendations">
        <p>List AI results</p>
      </div>
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

  div.recommendations {
    box-sizing: border-box;
    margin: 0 16px 0 16px;
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

  h3 span {
    color: var( --secondary-text-color );
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
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

  p.label {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    font-family: 'Roboto Variable', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 18px;
  }
</style>
