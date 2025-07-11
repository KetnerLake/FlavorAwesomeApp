import {Resend} from 'resend';

export default async ( request, context ) => {
  try {
    const body = await request.json();

    const resend = new Resend( process.env.RESEND_API_KEY );
    const response = await resend.emails.send( {
      from: 'Flavor Awesome <feedback@flavorawesome.com>',
      to: ['parkerkrhoyt@gmail.com'],
      subject: '[Flavor Awesome] ' + body.subject,
      html: body.email + ' says:<br>' + body.message
    } );

    console.log( response );
    return new Response( response.data.id );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
};

export const config = {
  path: '/api/message'
};
