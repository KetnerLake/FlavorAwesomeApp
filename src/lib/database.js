import {createClient} from "@supabase/supabase-js";

export class Database {
  constructor() {
    this._client = createClient( 
      'https://tcstewgnrtqajrofrrjf.supabase.co', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjc3Rld2ducnRxYWpyb2ZycmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDM3NDgsImV4cCI6MjA2NDcxOTc0OH0.90IL2vlSUJadNpG-r6JtxPoiJvxcX4_G9f02ub64SBk'
    );
    
    this._client.auth.getUser().then( ( response ) => {
      if( response.error === null ) {
        return response;
      } else {
        return this._client.auth.signInAnonymously();
      }
    } ).then( ( response ) => {
      this.user = response.data.user.id;
    } );

    this._fields = null;
    this._user = null;
  }

  browseReview( flavor ) {
    return this._client.from( flavor ).select().then( ( response ) => {
      console.log( response.data );

      for( let r = 0; r < response.data.length; r++ ) {
        response.data[r].photos = null;

        delete response.data[r].currency;        
      }

      response.data.sort( ( a, b ) => {
        a = new Date( a.updated_at );
        b = new Date( b.updated_at );

        if( a.getTime() > b.getTime() ) return -1;
        if( a.getTime() < b.getTime() ) return 1;
        return 0;
      } );

      return response.data;
    } );    
  }

  readReview( flavor, id ) {
    return this._client.from( flavor ).select().eq( 'id', id ).limit( 1 ).single().then( ( response ) => {
      response.data.photos = [];
      
      if( response.data.sampled && response.data.sampled !== null ) {
        response.data.sampled = new Date( response.data.sampled );
      }

      return response.data;
    } );
  }

  editReview( flavor, review ) {
    delete review.photos;

    return this._client.from( flavor ).update( review ).eq( 'id', review.id );
  }

  addReview( flavor, review ) {
    // const photos = item.photos === null ? null : [... item.photos];
    delete review.photos;

    review.id = crypto.randomUUID();
    review.user_id = this._user;      

    return this._client.from( flavor ).insert( review );
  }

  deleteReview( flavor, id ) {
    return this._client.from( flavor ).delete().eq( 'id', id );
  }

  favoriteReview( flavor, id, favorite ) {
    return this._client.from( flavor ).update( {favorite} ).eq( 'id', id ).select().single().then( ( response ) => {
      return response.data;
    } );    
  }

  get fields() {
    return this._fields;
  }

  set fields( value ) {
    this._fields = [... value];
  }

  get user() {
    return this._user;
  }

  set user( value ) {
    this._user = value;
  }
}
