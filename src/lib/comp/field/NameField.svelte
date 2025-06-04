<script>
  import Icon from "@iconify/svelte";
  import Input from "../Input.svelte";
  import LabelField from "./LabelField.svelte";

  let {
    label, 
    name, 
    onchange,
    placeholder, 
    readonly = false, 
    value = null
  } = $props();

  function onInputChange( evt ) {
    value = evt.value;
    if( onchange ) onchange( {name, value} );
  }
</script>

{#if readonly}
  {#if value !== null}
    <LabelField 
      icon="material-symbols:label-outline" 
      {label} 
      --label-field-font-size="22px"       
      --label-field-line-height="28px" 
      {value} />
  {/if}
{:else}
  <div>
    <span>
      <Icon height="24" icon="material-symbols:label-outline" width="24" />
    </span>
    <Input {label} name="name" onchange={onInputChange} {placeholder} {value} />
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
</style>
