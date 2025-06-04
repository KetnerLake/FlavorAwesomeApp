<script>
  import Icon from "@iconify/svelte";
  import Plot from "../Plot.svelte";

  let {
    icon = 'material-symbols:texture', 
    label, 
    name,
    onchange,
    readonly = false, 
    value = null,
    xhigh, 
    xlow, 
    yhigh, 
    ylow
  } = $props();

  function onPlotChange( point ) {
    value = point.value;
    if( onchange ) onchange( {name, value} );
  }
</script>

{#if readonly}
  {#if value !== null}
    <div class="label">
      <div>
        <span>
          <Icon height="24" icon={icon} width="24" />
        </span>
        <p>{label}</p>
      </div>
      <div class="chart">
        <Plot 
          {label} 
          name="plot" 
          {readonly} 
          {value} 
          {xhigh} 
          {xlow} 
          {yhigh} 
          {ylow} />
      </div>
    </div>
  {/if}
{:else}
  <div class="field">
    <div>
      <span>
        <Icon height="24" icon={icon} width="24" />
      </span>
      <p>{label}</p>
    </div>
    <div class="chart">
      <Plot 
        {label} 
        name="plot"
        onchange={onPlotChange} 
        {readonly} 
        {value} 
        {xhigh} 
        {xlow} 
        {yhigh} 
        {ylow} />
    </div>
  </div>
{/if}

<style>
  div.chart {
    border-color: var( --secondary-text-color );
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    box-sizing: border-box;
    margin: 0 16px 0 48px;
    padding: 0;
  }

  div.field {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  div.label {
    border-bottom: solid 1px #00000010;
    padding: 0 0 11px 0;
  }

  div > div:first-of-type {
    align-items: center;
    box-sizing: border-box;        
    display: flex;
    flex-direction: row;
    padding: 8px 0 8px 0;
  }
  
  p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }

  span {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0 12px 0 12px;
  }
</style>
