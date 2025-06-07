<script>
  import AppBar from "../AppBar.svelte";
  import DateField from "../field/DateField.svelte";
  import DecimalField from "../field/DecimalField.svelte";
  import IconButton from "../IconButton.svelte";
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

  let {
    flavor = null, 
    onback, 
    oncancel, 
    ondelete,
    ondone, 
    onedit,
    onfavorite,
    readonly = false, 
    value = null
  } = $props();

  let fields = $derived( flavor === null ? null : flavor.fields );
  let form = $state();
  let screen = $state();
  let title = $derived.by( () => {
    if( value && value.id === null ) {
      return `New ${flavor.singular}`;
    } else {
      return readonly ? '' : `Edit ${flavor.singular}`;
    }
  } );
  let valid = $derived( value !== null && value.name !== null ? true : false )

  export function hide() {
    return screen.animate( [
      {top: 0},
      {top: '100vh'}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'      
    } ).finished;
  }

  export function show() {
    form.scrollTo( {top: 0} );
    screen.animate( [
      {top: '100vh'},
      {top: 0}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    } );
  }

  function onCancelClick() {
    if( value.id === null ) {
      const clean = {id: null};

      for( let f = 0; f < fields.length; f++ ) {
        clean[fields[f].name] = null;
      }

      value = clean;
      form.scrollTo( {top: 0} );

      oncancel( null );
    } else {
      oncancel( value.id );
    }
  }

  function onDeleteClick() {
    const response = confirm( 'Are you sure you want to delete this review?' );

    if( response ) {
      ondelete( value.id );
    }
  }

  function onDoneClick() {
    if( !valid ) {
      const field = fields.find( ( item ) => item.name === 'name' );
      alert( `${field.label} is required.` );
    } else {
      ondone( value );  
      form.scrollTo( {top: 0} );      
    }
  }

  function onFavoriteClick() {
    onfavorite( value.id, !value.favorite );
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
        <IconButton name="material-symbols:arrow-back" onclick={onback} />      
      {/if}
    {/snippet}
    {#snippet right()}
      {#if value && value.id !== null && readonly}
        <IconButton 
          name={value.favorite ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'}
          onclick={onFavoriteClick} />        
        <IconButton name="material-symbols:delete-rounded" onclick={onDeleteClick} />                                     
        <IconButton name="material-symbols:edit" onclick={onedit} />              
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
    <!--
    <PhotoField name="photos" {readonly} value={[{data: '/img/ashton.jpg'}]} />
    <NameField label="Beer name" name="name" placeholder="Beer name" {readonly} value="Miller Lite" />
    <TextField icon="material-symbols:business-center-outline" label="Brewer" name="brewer" placeholder="Brewer" {readonly} value="Busch InBev" />
    <TextField label="Brewer" name="brewer" placeholder="Brewer" {readonly} value="Busch InBev" />    
    <DecimalField gap={false} label="ABV" name="abv" placeholder="Alcogol By Volume" {readonly} suffix="%" value="3.2" />
    <NumberField label="IBU" name="ibu" placeholder="International Bitterness Unit" {readonly} value="32" />    
    <PriceField name="price" {readonly} value="12.34" />
    <DateField label="Sampled" name="sampled" placeholder="Sampled" {readonly} value={new Date()} />
    <RatingField label="Rating" name="rating" {readonly} value={3} />
    <RadioField icon="material-symbols:sports-bar-outline" items={serving} label="Serving Type" {readonly} value="Cask" />
    <PlotField label="Texture Plot" {readonly} value="0.50, 0.50" xhigh="Smooth" xlow="Grainy" yhigh="Snappy" ylow="Soft" />        
    <MeterField icon="material-symbols:bubble-chart-outline" items={['Three', 'Two', 'One']} label="Bubbles" name="bubbles" {readonly} value="One" />
    <SliderField icon="material-symbols:eyeglasses" high="Shiny" label="Appearance" low="Dull" {readonly} value={3} />    
    <ProfileField label="Flavor Wheel" name="profile" {readonly} {spokes} value={profile} />    
    <NotesField name="notes" {readonly} value="This is a test." />
    -->
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
    display: flex;
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
