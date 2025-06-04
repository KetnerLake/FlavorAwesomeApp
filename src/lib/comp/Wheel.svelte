<script>
  let {
    interactive = false,
    labels = true, 
    maximum = 5, 
    name,
    rotate = 0,
    spokes = [],
    value = []
  } = $props();

  let svg = $state();
  let chart = $state();
  let radius = 150;  

  $effect( () => {
    if( chart ) {
      if( interactive ) {
        svg.setAttributeNS( null, 'viewBox', '-70 -150 140 200' );
      } else {
        const chart_bounds = chart.getBoundingClientRect();
        svg.setAttributeNS( null, 'viewBox', `${0 - ( chart_bounds.width / 2 )} ${0 - ( chart_bounds.height / 2 )} ${chart_bounds.width} ${chart_bounds.height}` );
      }      
    }
  } );

  let path = $derived.by( () => {
    if( value.length === 0 ) {
      return '';
    }

    const slice = ( 360 / spokes.length ) * ( Math.PI / 180 );

    let d = null;

    for( let v = 0; v < value.length; v++ ) {
      const score = value[v] === 0 ? 0.25 : value[v];
      const segment = ( ( radius - 3 ) / maximum ) * score;
      const current = {
        x: segment * Math.cos( ( slice * v ) - 1.5708 ),
        y: segment * Math.sin( ( slice * v ) - 1.5708 )
      };

      if( v === 0 ) {
        d = `M ${current.x} ${current.y} `;
      } else {
        d = d + `L ${current.x} ${current.y} `;
      }
    }

    return d + 'Z';
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
    <path d={path} />
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
    fill: rgb( from var( --primary-text-color ) r g b / 0.12 );
    stroke: var( --primary-text-color );
    stroke-linecap: round;
    stroke-linejoin: round;    
    stroke-width: 3px;
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
