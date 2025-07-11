import Stripe from "stripe";

export default async ( request, context ) => {
  try {
    const body = await request.json();

    const stripe = new Stripe( process.env.STRIPE_SECRET_KEY );
    const session = await stripe.checkout.sessions.create( {
      success_url: 'http://localhost:5173?mode=success',
      line_items: [{
        price: body.product.price,
        quantity: 1
      }],
      mode: body.product.mode
    } );    

    return new Response( JSON.stringify( {session} ) );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
};

export const config = {
  path: '/api/checkout'
};
