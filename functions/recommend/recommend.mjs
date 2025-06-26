import OpenAI from 'openai';
import {z} from 'zod';
import {zodResponseFormat} from 'openai/helpers/zod';

export default async ( request, context ) => {
  try {
    const body = await request.json();

    if( body.favorites.length > 1 ) {
      body.favorites[body.favorites.length - 1] = 'and ' + body.favorites[body.favorites.length - 1];
    }

    const openai = new OpenAI( {apiKey: process.env.OPENAI_API_KEY} );

    const FlavorRecommendationExtraction = z.object( {
      recommendations: z.array(  
        z.object( {
          name: z.string(),
          description: z.string(),
          price: z.number()
        } )
      )
    } );

    const completion = await openai.chat.completions.parse( {
      model: 'gpt-4.1-mini',
      messages: [
        {role: 'system', content: `You are a ${body.singular} expert. You will be given a question about ${body.plural} and should reply in the given structure.`},
        {role: 'user', content: `I enjoy the following ${body.plural}: ${body.favorites.join( ', ' )}. Recommend five other similar ${body.plural}.`}
      ],
      response_format: zodResponseFormat( FlavorRecommendationExtraction, 'flavor_recommendation_extraction' )
    } );
    const data = completion.choices[0].message.parsed;
    return new Response( JSON.stringify( data ) );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
};

export const config = {
  path: '/api/recommend'
};
