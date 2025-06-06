import {error} from '@sveltejs/kit';

export async function load( {fetch, params} ) {
  const catalog = await fetch( '/flavors.json' ).then( ( response ) => response.json() );
  
  const active = catalog.tastes.filter( ( item ) => item.active );
  active.sort( ( a, b ) => {
    if( a.singular > b.singular ) return 1;
    if( a.singular < b.singular ) return -1;    
    return 0;
  } );

  catalog.tastes = [... active];  
  return catalog;
}
