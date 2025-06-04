<script>
  import Icon from "@iconify/svelte";

  let {active, icon, label, onclick} = $props();
</script>

<li>
  <button class:active {onclick} type="button">
    {#if icon}
      <span class="icon">
        <Icon height="20" icon={icon} width="20" />
      </span>
    {:else}
      <span>{label}</span>
    {/if}
  </button>
</li>

<style>
  button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: var( --primary-text-color );    
    cursor: pointer;
    display: flex;
    flex-direction: column;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    height: 48px;
    justify-content: center;
    letter-spacing: 0.50px;
    line-height: 20px;    
    margin: 0;
    min-width: 48px;
    opacity: 0.62;
    outline: none;
    padding: 4px 12px 4px 12px;
    position: relative;
    transition: opacity 0.30s ease-in-out;
    -webkit-tap-highlight-color: transparent;                    
  }

  button.active {
    opacity: 1.0;
  }

  button.active:after {
    background: var( --primary-text-color );
    border-radius: 6px;
    bottom: 4px;
    content: '';
    height: 6px;
    position: absolute;
    width: 12px;
  }

  li {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  span.icon {
    color: var( --secondary-text-color );
    height: 20px;
    padding: 0;
  }  
</style>
