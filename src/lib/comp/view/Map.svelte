<script>
  let {hidden = false} = $props();

  // https://www.reddit.com/r/sveltejs/comments/11czcoj/should_i_use_leaflet_with_svelte/

  let leaflet;
  let map;
  let mapElement;

  function startMap() {
    leaflet = window.L;
    map = leaflet.map( mapElement, { 
      preferCanvas: true,
      zoomControl: false
    } ).setView( [39.51, -104.84], 10 );
    
    leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    } ).addTo( map );
    
    /*
    markerLayers = leaflet.layerGroup();
    markerLayers.addTo( map );
    icon = leaflet.icon( {
      iconUrl: '_bicycle.gif',
      iconSize: [50, 50]
    } );
    */
	} 
</script>

<svelte:head>
  <link 
    rel="stylesheet" 
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin="" />  
  <script 
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""
    onload={startMap}>
  </script>  
</svelte:head>

<article class:hidden>
  <div bind:this={mapElement}></div>
</article>

<style>
  article {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    margin: 0;
    overflow: hidden;
    padding: 0;
  }

  article.hidden {
    display: none;
  }

  div {
    width: 100%;
    z-index: 50;
  }  
</style>
