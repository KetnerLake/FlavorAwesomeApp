<script>
  import { onMount } from "svelte";

  let {
    interactive = false,
    labels = true, 
    maximum = 5, 
    name,
    rotate = 0,
    spokes = [],
    value = []
  } = $props();

  const resize = new ResizeObserver( ( entries ) => {
    for( let entry of entries ) {
      if( chart ) {
        if( interactive ) {
          const ratio = svg.clientWidth / svg.clientHeight;
          svg.setAttributeNS( null, 'viewBox', `-75 -150 150 ${150 / ratio}` );
        } else {
          const chart_bounds = {
            width: entry.contentRect.width,
            height: entry.contentRect.height
          };

          svg.setAttributeNS( null, 'viewBox', `${0 - ( chart_bounds.width / 2 )} ${0 - ( chart_bounds.height / 2 )} ${chart_bounds.width} ${chart_bounds.height}` );          

          if( chart_bounds.width !== 0 ) {
            resize.unobserve( chart );
            resize.disconnect();
          }
        }
      }
    }
  } ); 

  let svg = $state();
  let chart = $state();
  let radius = 150;   

  function path( profile ) {
    const count = !spokes || spokes === null ? 16 : spokes.length;
    const max = !maximum || maximum === null ? 5 : maximum;
    const slice = ( 360 / count ) * ( Math.PI / 180 );
    let d = null;    

    if( !profile || profile.length === 0 ) {
      return '';
    }

    for( let p = 0; p < profile.length; p++ ) {
      // Allow close-to-zero value for zero
      // Better charting visualization
      const score = profile[p] === 0 ? 0.25 : profile[p];

      const segment = ( ( radius - 3 ) / max ) * score;
      const current = {
        x: segment * Math.cos( ( slice * p ) - 1.5708 ),
        y: segment * Math.sin( ( slice * p ) - 1.5708 )
      };

      if( p === 0 ) {
        d = `M ${current.x} ${current.y} `;
      } else {
        d = d + `L ${current.x} ${current.y} `;
      }
    }

    return d + 'Z';
  }

  onMount( () => {
    resize.observe( chart );
  } );  

  function placement( index ) {
    let anchor = 'middle'
    let baseline = 'auto';

    const slice = ( 360 / spokes.length ) * ( Math.PI / 180 );      
    const degrees = ( slice * index ) * ( 180 / Math.PI );

    if( degrees === 0 ) {
      anchor = 'middle';
      baseline = 'auto';        
    } else if( degrees > 0 && degrees < 90 ) {
      anchor = 'start';
      baseline = 'auto';   
    } else if( degrees === 90 ) {
      anchor = 'start';
      baseline = 'middle';        
    } else if( degrees > 90 && degrees < 180 ) {
      anchor = 'start';
      baseline = 'hanging';        
    } else if( degrees === 180 ) {
      anchor = 'middle';
      baseline = 'hanging';                
    } else if( degrees > 180 && degrees < 270 ) {
      anchor = 'end';
      baseline = 'hanging';                        
    } else if( degrees === 270 ) {
      anchor = 'end';
      baseline = 'middle';                        
    } else {
      anchor = 'end';
      baseline = 'auto';                                
    }

    return {
      'dominant-baseline': baseline,
      'text-anchor': anchor
    };
  }
</script>

<svg bind:this={svg}>
  <g bind:this={chart} class="chart" style:rotate="{rotate}deg">
    <g class="wheel">
      {#each {length: maximum}, index}
        <circle 
          class="ring"
          cx="0" 
          cy="0" 
          r={( ( radius - 3 ) / maximum ) * ( maximum - index )} 
          stroke-width={ index === 0 ? 3 : 1}
          style:fill={index === 0 ? '#ffffff' : 'none'}>
        </circle>
      {/each}
    </g>
    <g class="spokes">
      {#each spokes as spoke, index}
        <g class="spoke" style:rotate={`${( 360 / spokes.length ) * index}deg`}>
          <rect height={radius - 3} width="1" x="-0.50" y="0"></rect>
          {#each {length: maximum}, stop}
            <circle 
              cx="0" 
              cy={( ( radius - 3 ) / maximum ) * ( stop + 1 )} 
              r="2">
            </circle>
          {/each}      
        </g>
      {/each}  
    </g>
    {#if labels}
      <g class="labels">
        {#each spokes as spoke, index}
          {@const slice = ( 360 / spokes.length ) * ( Math.PI / 180 )}
          <text
            {... placement( index )}
            x={( radius + 5 ) * Math.cos( ( slice * index ) - 1.5708 )}
            y={( radius + 5 ) * Math.sin( ( slice * index ) - 1.5708 )}>
            {spoke}
          </text>
        {/each}      
      </g>
    {/if}
    {#if value.length > 0 && Array.isArray( value[0] )}
      {#each value as profile}
        <path d={path( profile )} />
      {/each}
    {:else}
      <path class="only" d={path ( value )} />
    {/if}
  </g>
</svg>

<style>
  g.chart {
    transition: rotate 0.30s ease-in-out;
  }

  g.wheel circle {
    fill: none;
    stroke: var( --secondary-text-color );    
  }

  g.spokes circle {
    fill: #ffffff;
    stroke: var( --secondary-text-color );    
  }

  g.spokes rect {
    fill: var( --secondary-text-color );    
    stroke: none;
  }

  path {
    fill: none;
    stroke: var( --primary-text-color );
    stroke-linecap: round;
    stroke-linejoin: round;    
    stroke-width: 3px;
    opacity: 0.20;
  }

  path:last-of-type {
    fill: rgb( from var( --primary-text-color ) r g b / 0.12 );
    stroke: var( --primary-accent-color );
    stroke-linecap: round;
    stroke-linejoin: round;    
    stroke-width: 3px;    
    opacity: 1.0;
  }

  path.only {
    stroke: var( --primary-text-color );
  }

  svg {
    height: 100%;
    width: 100%;
  }

  text {
    fill: var( --secondary-text-color );    
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
  }
</style>
