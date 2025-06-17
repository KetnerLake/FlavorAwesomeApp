import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

export class DexieCloud {
  constructor() {
    this._db = new Dexie( 'FlavorAwesome', {addons: [dexieCloud]} );
    this._db.version( 20 ).stores( {
      review: 'id, created_at, updated_at, type',
      settings: 'id'
    } );    
    this._db.cloud.configure( {
      customLoginGui: true,
      databaseUrl: 'https://zwa7o6jty.dexie.cloud',
      requireAuth: false
    } );    
  }

  browseReview( flavor = null ) {
    if( flavor === null ) {
      return this._db.review.orderBy( 'updated_at' ).reverse().toArray();
    } else {
      return this._db.review.where( 'type' ).equals( flavor ).reverse().sortBy( 'updated_at' );
    }
  }

  readReview( id ) {
    return this._db.review.where( 'id' ).equals( id ).toArray().then( ( data ) => {
      return data[0];
    } );
  }

  addReview( flavor, review ) {
    const clone = $state.snapshot( review );

    clone.id = crypto.randomUUID();
    clone.type = flavor;    
    clone.created_at = new Date();
    clone.updated_at = new Date();
    clone.favorite = false;

    return this._db.review.add( clone );
  }

  editReview( value ) {
    const clone = $state.snapshot( value );
    
    clone.updated_at = new Date();

    return this._db.review.put( clone ).then( () => {
      return this._db.review.where( 'id' ).equals( value.id ).toArray().then( ( data ) => data[0] );      
    } );
  }

  deleteReview( id ) {
    return this._db.review.delete( id );
  }

  countReview() {
    return this._db.review.toArray().then( ( data ) => {
      return data.reduce( ( acc, curr ) => {
        if( acc.hasOwnProperty( curr.type ) ) {
          acc[curr.type] = acc[curr.type] + 1;
        } else {
          acc[curr.type] = 1;
        }

        return acc;
      }, {'All': data.length} );
    } );
  }

  favoriteReview( id, favorite ) {
    return this._db.review.update( id, {favorite: favorite, updated_at: new Date()} ).then( () => {
      return this._db.review.where( 'id' ).equals( id ).toArray().then( ( data ) => data[0] );
    } );
  }

  countReviews() {
    return this._db.review.toArray().then( ( data ) => data.length );
  }

  createSettings( settings ) {
    const clone = $state.snapshot( value );
    
    clone.created_at = new Date();
    clone.updated_at = new Date();    

    return this._db.settings.add( clone );
  }

  readSettings() {
    return this._db.settings.toArray().then( ( data ) => {
      if( data.length === 0 ) {
        return null;
      } 
      
      return data[0];      
    } );
  }

  updateSettings( settings ) {
    const clone = $state.snapshot( settings );
    clone.updated_at = new Date();

    return this._db.settings.put( clone ).then( () => this._db.settings.toArray() ).then( ( data ) => data[0] );
  }

  deleteSettings() {
    return this._db.settings.clear();
  }

  login( email ) {
    console.log( 'LOGIN EMAIL: ' + email );
    this._db.cloud.login( {email, grant_type: 'otp'} );
  }

  logout() {
    this._db.cloud.logout();
  }

  sync() {
    console.log( 'DC SYNC' );
    return this._db.cloud.sync( {purpose: 'pull', wait: true} );
  }

  get ui() {
    return this._db.cloud.userInteraction;
  }

  get user() {
    return this._db.cloud.currentUser;
  }

  get userId() {
    return this._db.cloud.currentUserId;
  }
}
