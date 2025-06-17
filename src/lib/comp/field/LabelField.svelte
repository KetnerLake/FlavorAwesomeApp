<script>
  import Icon from "@iconify/svelte";
  
  let {
    bottom = true, 
    gap = true, 
    icon, 
    label, 
    suffix, 
    top = false, 
    value
  } = $props();
</script>

<div class:bottom class:top>
  <span class:noicon={!icon}>
    <Icon 
      height="24" 
      {icon}
      width="24" />
  </span>
  <div>
    <p>{value}{gap ? ' ' : ''}{suffix}</p>
    <p>{label}</p>
  </div>
</div>

<style>
  div {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    padding: 12px 0 11px 0;
  }

  div.bottom {
    border-bottom: solid 1px #00000010;    
  }

  div.top {
    border-top: solid 1px #00000010;
  }

  div div {
    align-items: flex-start;
    border-bottom: none;
    flex-direction: column;
    padding: 0;
  }

  p {
    box-sizing: border-box;
    color: var( --primary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: var( --label-field-font-size, 16px );
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: var( --label-field-line-height, 24px );
    margin: 0;
    padding: 0;
  }

  p:last-of-type {
    color: var( --secondary-text-color );
    font-size: 12px;
    line-height: 16px;
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
