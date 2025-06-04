<script>
  let {
    name,
    onchange, 
    readonly = false, 
    size = 300, 
    value = null, 
    xlow, 
    xhigh, 
    ylow, 
    yhigh
  } = $props();

  let point = $derived.by( () => {
    if( value === null ) return null;

    return {
      x: map( value.x, -1.0, 1.0, 0 - ( size / 2 ), size / 2 ),
      y: map( value.y, 1.0, -1.0, 0 - ( size / 2 ), size / 2 )
    };
  } );

  let svg = $state();    

  function map( x, in_min, in_max, out_min, out_max ) {
    return ( x - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
  }

  function onDocumentMove( evt ) {
    if( evt.target === svg ) {
      evt.preventDefault();

      const bounds = svg.getBoundingClientRect();
      const x = map( evt.offsetX, 0, bounds.width, -1.0, 1.0 );
      const y = map( evt.offsetY, 0, bounds.height, 1.0, -1.0 );
      value = {x, y};        

      if( onchange ) onchange( {name, value} );
    }
  }

  function onDocumentUp() {
    document.removeEventListener( 'pointermove', onDocumentMove );
    document.removeEventListener( 'pointerup', onDocumentUp );
  }  

  function onPlotDown( evt ) {
    if( readonly ) return;

    evt.preventDefault();

    const bounds = svg.getBoundingClientRect();
    const x = map( evt.offsetX, 0, bounds.width, -1.0, 1.0 );
    const y = map( evt.offsetY, 0, bounds.height, 1.0, -1.0 );
    value = {x, y};            

    document.addEventListener( 'pointermove', onDocumentMove );
    document.addEventListener( 'pointerup', onDocumentUp );    

    if( onchange ) onchange( {name, value} );    
  }  
</script>

<svg 
  bind:this={svg}
  onpointerdown={onPlotDown}
  role={readonly ? 'none' : 'button'} 
  style:cursor={readonly ? 'default' : 'crosshair'}
  tabindex="-1"
  viewBox="{0 - ( size / 2 )} {0 - ( size / 2 )} {size} {size}">

  <rect x={0 - ( size / 2 )} y="-0.50" width={size} height="1" />
  <rect x="-0.50" y={0 - ( size / 2)} width="1" height={size} />
  
  <path d="M {0 - ( size / 4)} {0 - ( size / 2 )} L {0 - ( size / 4)} {size}" />
  <path d="M {size / 4} {0 - ( size - 2)} L {size / 4} {size}" />
  <path d="M {0 - ( size / 2 )} {0 - ( size / 4 )} L {size / 2} {0 - ( size / 4 )}" />    
  <path d="M {0 - ( size / 2 )} {size / 4} L {size / 2} {size / 4}" />        
  
  <text x="0" y={( 0 - ( size / 8 ) ) * 3} dominant-baseline="middle" text-anchor="middle">{yhigh}</text>    
  <text x="0" y={( size / 8 ) * 3} dominant-baseline="middle" text-anchor="middle">{ylow}</text>        
  <text class="left" x="0" y={( 0 - ( size / 8 ) ) * 3} dominant-baseline="middle" text-anchor="middle">{xlow}</text>            
  <text class="right" x="0" y={( 0 - ( size / 8 ) ) * 3} dominant-baseline="middle" text-anchor="middle">{xhigh}</text>                

  {#if value !== null}
    <g style:translate="{point.x}px {point.y}px">
      <circle class="dot" cx="0" cy="0" r="5.5" />
      <circle class="ring" cx="0" cy="0" r="10" />
    </g>
  {/if}
  
</svg>

<style>
  circle.dot {
    fill: var( --primary-text-color );
    stroke: none;
  }

  circle.ring {
    fill: none;
    stroke: var( --primary-text-color );
    stroke-width: 2px;
  }    

  path {
    stroke: var( --secondary-text-color );
    stroke-dasharray: 3px 3px;
    stroke-width: 1px;
  }

  rect {
    fill: var( --secondary-text-color );
    stroke: none;
  }


  svg {
    display: block;
  }

  text {
    cursor: default;
    fill: var( --secondary-text-color );
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }

  text::selection {
    background: none;
  }  

  text.left {
    rotate: -90deg;
  }

  text.right {
    rotate: 90deg;
  }
</style>
