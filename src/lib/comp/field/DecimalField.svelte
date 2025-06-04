<script>
  import Icon from "@iconify/svelte";
  import Input from "../Input.svelte";
  import LabelField from "./LabelField.svelte";

  let {
    gap = true, 
    icon, 
    label, 
    name, 
    onchange,
    placeholder, 
    readonly = false, 
    suffix, 
    value = null
  } = $props();

  let format = $derived.by( () => {
    if( value !== null ) {
      return value.toLocaleString( navigator.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      } );
    }
  } );

  function onInputChange( evt ) {
    value = evt.value;
    if( onchange ) onchange( {
      name, 
      value: value === null ? null : parseFloat( value )
    } );
  }
</script>

{#if readonly}
  {#if value !== null}
    <LabelField {gap} {icon} {label} {suffix} {value} />
  {/if}
{:else}
  <div>
    <span class:noicon={!icon}>
      <Icon height="24" icon={icon} width="24" />
    </span>
    <Input 
      {label} 
      mode="decimal" 
      name="decimal"
      onchange={onInputChange} 
      {placeholder} 
      {suffix} 
      {value} />
  </div>
{/if}

<style>
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
