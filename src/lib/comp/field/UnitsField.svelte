<script>
  import Icon from "@iconify/svelte";
  import Input from "../Input.svelte";
  import LabelField from "./LabelField.svelte";

  let {
    icon, 
    label, 
    name, 
    onchange, 
    placeholder, 
    readonly = false, 
    suffix,
    value = null
  } = $props();

  let units = $state( value === null ? suffix[0] : value.units );  
  let measure = $derived( value === null ? null : value.measure.toString( 10 ) );
  let format = $derived.by( () => {
    if( value === null ) {
      return null;
    } else {
      return value.measure.toLocaleString( navigator.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      } );
    }
  } );  

  function onInputChange( evt ) {
    if( evt.value === null ) {
      value = null;
    } else {
      value = {
        measure: evt.value,
        units
      };
    }

    /*
     * The problem is that it comes back in parsed.
     * This fills the field weird, and value gets jumbled with further typing.
     * Should only relate to this change.
     * Suffix change should not matter since we are not in the field editing it.
     */
    if( onchange ) {
      onchange( {
        name, 
        value: {
          measure: parseFloat( value.measure ),
          units
        }
      } );
    }
  }  

  function onSuffixClick() {
    let index = suffix.indexOf( units );

    if( index === ( suffix.length - 1 ) ) {
      index = 0;
    } else {
      index = index + 1;
    }

    units = suffix[index];

    if( value !== null ) {
      if( onchange ) {
        onchange( {
          name, 
          value: {
            measure: parseFloat( value.measure ),
            units
          } 
        } );
      };          
    }
  }
</script>

{#if readonly}
  {#if value !== null}
    <LabelField {icon} {label} suffix={value.units} value={format} />
  {/if}
{:else}
  <div>
    <span class:noicon={!icon}>
      <Icon height="24" icon={icon} width="24" />
    </span>
    <Input 
      {label} 
      mode="decimal" 
      name="units" 
      onchange={onInputChange} 
      {placeholder} 
      suffix={units}
      value={format}>
      <button onclick={onSuffixClick} tabindex="-1" type="button">
        <Icon 
          height="24" 
          icon="material-symbols:conversion-path" 
          width="24" />
      </button>      
    </Input>
  </div>
{/if}

<style>
  button {
    align-items: center;
    appearance: none;
    background: var( --primary-accent-color );
    border: none;
    border-radius: 40px;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    margin: 0 0 0 16px;
    outline: none;
    padding: 0;
    width: 40px;
    -webkit-tap-highlight-color: transparent;    
  }

  div {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 0 16px 0 0;
  }

  span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }

  span.noicon {
    padding: 0 !important;
    width: 48px;
  }
</style>
