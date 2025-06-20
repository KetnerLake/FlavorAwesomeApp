<script>
  import AppBar from "../AppBar.svelte";
  import {DexieCloud} from "$lib/DexieCloud.svelte.js";  
  import DateField from "../field/DateField.svelte";
  import DecimalField from "../field/DecimalField.svelte";
  import IconButton from "../IconButton.svelte";
  import LabelField from "../field/LabelField.svelte";
  import MeterField from "../field/MeterField.svelte";
  import NameField from "../field/NameField.svelte";
  import NotesField from "../field/NotesField.svelte";
  import NumberField from "../field/NumberField.svelte";
  import PhotoField from "../field/PhotoField.svelte";
  import PlotField from "../field/PlotField.svelte";
  import PriceField from "../field/PriceField.svelte";
  import ProfileField from "../field/ProfileField.svelte";  
  import RatingField from "../field/RatingField.svelte";  
  import RadioField from "../field/RadioField.svelte";
  import SliderField from "../field/SliderField.svelte";
  import TextField from "../field/TextField.svelte";
  import UnitsField from "../field/UnitsField.svelte";
    
  let {
    flavor = null, 
    onchange
  } = $props();

  let form = $state();
  let readonly = $state( false );
  let screen = $state();
  let value = $state( null );

  let fields = $derived( flavor === null ? null : flavor.fields );
  let title = $derived.by( () => {
    if( value === null || value.id === null ) {
      return `New ${flavor === null ? '' : flavor.singular}`;
    } else {
      return readonly ? '' : `Edit ${flavor === null ? '' : flavor.singular}`;
    }
  } );
  let valid = $derived( value !== null && value.name !== null ? true : false )

  const db = new DexieCloud();
  
  let geolocation = null;
  let latitude = null;
  let longitude = null;
  let temperature = null;
  let condition = null;
  let weather = null;

  function clear() {
    const clean = {id: null, photos: null};

    for( let f = 0; f < fields.length; f++ ) {
      clean[fields[f].name] = null;
    }

    value = clean;
  }

  export function hide() {
    return screen.animate( [
      {top: 0},
      {top: '100vh'}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'      
    } ).finished.then( () => {
      readonly = true;      
      form.scrollTo( {top: 0} );  
      clear();
      screen.style.display = 'none';
    } );
  }

  export function show( id = null ) {
    screen.style.display = 'flex';
    if( id === null ) {
      clear();
      readonly = false;    
      
      screen.animate( [
        {top: '100vh'},
        {top: 0}
      ], {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
      } ).finished.then( () => {
        geolocation = navigator.geolocation.watchPosition( ( position ) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          navigator.geolocation.clearWatch( geolocation );
          geolocation = null;

          fetch( `/api/weather?location=${latitude},${longitude}` )
          .then( ( response ) => response.json() )
          .then( ( data ) => {
            weather = data.icon;
            temperature = data.temperature;
            condition = data.condition;
          } );
        } );
      } );            
    } else {
      db.readReview( id ).then( ( data ) => {
        value = data;
        readonly = true;              

        screen.animate( [
          {top: '100vh'},
          {top: 0}
        ], {
          duration: 300,
          easing: 'ease-in-out',
          fill: 'forwards'
        } );      
      } );
    }
  }

  async function onCancelClick() {
    if( value === null || value.id === null ) {
      hide();      
    } else {
      db.readReview( value.id ).then( ( data ) => {
        value = data;
        readonly = true;
      } );
    }
  }

  function onDeleteClick() {
    const response = confirm( 'Are you sure you want to delete this review?' );

    if( response ) {
      db.deleteReview( value.id ).then( () => {
        onchange();                 
        hide();
      } );
    }
  }

  function onDoneClick() {
    if( !valid ) {
      const field = fields.find( ( item ) => item.name === 'name' );
      alert( `${field.label} is required.` );
    } else {
      if( value.id === null ) {
        value.latitude = latitude;
        value.longitude = longitude;
        value.temperature = temperature;
        value.condition = condition;
        value.weather = weather;

        db.addReview( flavor.singular, value ).then( () => {
          onchange();
          hide();
        } );
      } else {
        readonly = true;              
        db.editReview( value ).then( ( data ) => {
          value = data;
          onchange(); 
        } );
      }
    }
  }

  function onEditClick() {
    readonly = false;
  }

  function onFavoriteClick() {
    value.favorite = !value.favorite;
    db.favoriteReview( value.id, value.favorite ).then( ( data ) =>  {
      value = data;

      if( onchange ) {
        onchange();
      }
    } );
  }

  function onFieldChange( evt ) {
    if( value !== null ) {
      value[evt.name] = evt.value;
    }
  }

  $inspect( value );
</script>

<section bind:this={screen}>
  <AppBar label={title} variation="sm">
    {#snippet left()}
      {#if !readonly}
        <IconButton name="material-symbols:close" onclick={onCancelClick} />    
      {:else}
        <IconButton name="material-symbols:arrow-back" onclick={() => hide()} />      
      {/if}
    {/snippet}
    {#snippet right()}
      {#if value && value.id !== null && readonly}
        <IconButton 
          name={value.favorite ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'}
          onclick={onFavoriteClick} />        
        <IconButton 
          name="material-symbols:delete-outline-rounded" 
          onclick={onDeleteClick} />                                     
        <IconButton 
          name="material-symbols:edit-outline-rounded" 
          onclick={onEditClick} />              
      {:else}
        <IconButton onclick={onDoneClick} name="material-symbols:done" />          
      {/if}
    {/snippet}
  </AppBar>

  <form bind:this={form} class:readonly>
    {#each fields as field}
      {#if !field.hidden}
        {#if field.kind === 'photo'}
          <PhotoField 
            name={field.name} 
            onchange={onFieldChange} 
            {readonly}
            value={value && value[field.name] ? value[field.name] : null} />
        {:else if field.kind === 'name'}
          <NameField 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            placeholder={field.label} 
            {readonly} 
            value={value && value[field.name] ? value[field.name] : null} />        
        {:else if field.kind === 'text'}        
          <TextField 
            icon={field.icon} 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            placeholder={field.hint === null ? field.label : field.hint} 
            {readonly} 
            value={value && value[field.name] ? value[field.name] : null} />  
        {:else if field.kind === 'decimal'} 
          <DecimalField 
            icon={field.icon} 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            placeholder={field.hint === null ? field.label : field.hint} 
            {readonly} 
            suffix={field.suffix}  
            value={value && value[field.name] ? value[field.name] : null} />                     
        {:else if field.kind === 'number'} 
          <NumberField 
            icon={field.icon} 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            placeholder={field.hint === null ? field.label : field.hint} 
            {readonly} 
            suffix={field.suffix}  
            value={value && value[field.name] ? value[field.name] : null} />                             
        {:else if field.kind === 'units'} 
          <UnitsField
            icon={field.icon} 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            placeholder={field.hint === null ? field.label : field.hint} 
            {readonly}
            suffix={field.options}
            value={value && value[field.name] ? value[field.name] : null} />                                         
        {:else if field.kind === 'price'} 
          <PriceField 
            currency={value && value.currency ? value.currency : 'USD'}        
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            {readonly} 
            value={value && value[field.name] ? value[field.name] : null} />                                     
        {:else if field.kind === 'date'} 
          <DateField 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            placeholder={field.label} 
            {readonly}
            value={value && value[field.name] ? value[field.name] : null} />
        {:else if field.kind === 'rating'} 
          <RatingField 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange}
            {readonly}
            value={value && value[field.name] ? value[field.name] : null} />
        {:else if field.kind === 'meter'} 
          <MeterField 
            icon={field.icon} 
            items={field.options} 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            {readonly}
            value={value && value[field.name] ? value[field.name] : null} />
        {:else if field.kind === 'radio'} 
          <RadioField 
            icon={field.icon} 
            items={field.options} 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            other={field.other} 
            {readonly}
            value={value && value[field.name] ? value[field.name] : null} />      
        {:else if field.kind === 'profile'} 
          <ProfileField 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            {readonly} 
            spokes={field.options}
            value={value && value[field.name] ? value[field.name] : null} />
        {:else if field.kind === 'slider'} 
          <SliderField 
            icon={field.icon} 
            high={field.high} 
            label={field.label} 
            low={field.low} 
            name={field.name} 
            onchange={onFieldChange} 
            {readonly}
            value={value && value[field.name] ? value[field.name] : null} />
        {:else if field.kind === 'plot'} 
          <PlotField 
            label={field.label} 
            name={field.name} 
            onchange={onFieldChange} 
            {readonly}
            value={value && value[field.name] ? value[field.name] : null}
            xhigh={field.xhigh} 
            xlow={field.xlow} 
            yhigh={field.yhigh} 
            ylow={field.ylow} />
        {:else if field.kind === 'notes'} 
          <NotesField 
            name={field.name} 
            onchange={onFieldChange} 
            {readonly}
            value={value && value[field.name] ? value[field.name] : null} />
        {/if}
      {/if}
    {/each}
    {#if readonly && value && value.latitude}
      <div class="extra">
        <LabelField 
          bottom={false}
          icon="material-symbols:my-location-outline-rounded" 
          label="Coordinates" 
          top={true}
          value="{value.latitude.toFixed( 5 )}, {value.longitude.toFixed( 5 )}">
        </LabelField>
      </div>
    {/if}
    {#if readonly && value && value.weather}
      <div class="extra">
        <LabelField 
          bottom={false}
          icon={value.weather} 
          label="Weather" 
          top={true}
          value="{value.condition}, {value.temperature.toFixed( 0 )}&deg;F">
        </LabelField>
      </div>
    {/if}    
  </form>
</section>

<style>
  form {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    gap: 16px;
    margin: 0;
    overflow: auto;
    padding: 0;
  }

  form.readonly {
    gap: 0;
  }

  section {
    background: #ffffff;
    box-sizing: border-box;
    display: none;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    left: 0;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    top: 100vh;
    transition: top 0.30s ease-in-out;
    width: 100vw;
    z-index: 125;
  }
</style>
