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

  function onInputChange( evt ) {
    value = evt.value;
    if( onchange ) onchange( {name, value} );
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
    <Input {label} onchange={onInputChange} {placeholder} {suffix} {value} />
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
    padding: 0;
    width: 48px;
  }
</style>
