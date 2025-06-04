import {error} from '@sveltejs/kit';

export async function load( {fetch, params} ) {
  let catalog = await fetch( '/flavors.json' ).then( ( response ) => response.json() );
  catalog.tastes.sort( ( a, b ) => {
    if( a.singular > b.singular ) return 1;
    if( a.singular < b.singular ) return -1;    
    return 0;
  } );
  return catalog;
}
