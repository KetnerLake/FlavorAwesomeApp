export default async ( request, context ) => {
  try {
    const body = await request.json();
    console.log( body.type );

    if( body.type === 'checkout.session.completed' ) {
      const email = body.data.object.customer_details.email;
      console.log( email );      

      let response = await fetch( 'https://zwa7o6jty.dexie.cloud/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {
          grant_type: 'client_credentials',
          scopes: [
            'ACCESS_DB',
            'GLOBAL_READ',
            'GLOBAL_WRITE'
          ],
          client_id: process.env.DEXIE_CLIENT_ID,
          client_secret: process.env.DEXIE_CLIENT_SECRET
        } )
      } );
      let data = await response.json();
      const token = data.accessToken;
      console.log( token );

      response = await fetch( 'https://zwa7o6jty.dexie.cloud/users', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( [
          {userId: email, type: 'prod'}
        ] )
      } );    
      data = await response.json();      
    }
    
    return new Response( JSON.stringify( {status: 'success'} ), {
      status: 200
    } );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
};

export const config = {
  path: '/api/complete'
};
