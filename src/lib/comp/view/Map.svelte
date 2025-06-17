<script>
  let {hidden = false, items = [], onchange} = $props();

  // https://www.reddit.com/r/sveltejs/comments/11czcoj/should_i_use_leaflet_with_svelte/

  let leaflet;
  let map;
  let mapElement;
  let markerLayer = null;  

  export function update() {
    if( leaflet ) {
      markerLayer.clearLayers();

      for( let i = 0; i < items.length; i++ ) {
        const markup = `<svg width="32" height="32" viewBox="0 0 24 24"><path fill="${items[i].color}" d="M12 12q.825 0 1.413-.587T14 10t-.587-1.412T12 8t-1.412.588T10 10t.588 1.413T12 12m0 10q-4.025-3.425-6.012-6.362T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 2.5-1.987 5.438T12 22"/></svg>`;
        const icon = leaflet.divIcon( {
          className: 'pin',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          html: markup
        } );        
        const marker = leaflet.marker( 
          [items[i].latitude, items[i].longitude], {
            icon: icon
          } 
        );
        marker.data = items[i].id;
        marker.addTo( markerLayer ).on( 'click', ( evt ) => {
          if( onchange ) onchange( evt.target.data );
        } );
      }
    }
  }

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

    markerLayer = leaflet.layerGroup();    
    markerLayer.addTo( map );

    update();
	} 

  $effect( () => {
    items;
    update();
  } )
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
