<script>
  let {label, left, right, subtitle, variation} = $props();
</script>

<header class:small={variation === 'sm' ? true : false}>
  {#if variation === 'sm'}
    {@render left?.()}
    <h3>{label}</h3>
    {@render right()}
  {:else}
    <div>
      <div>
        {@render left()}
      </div>
      <div>
        {@render right()}
      </div>
    </div>
    <h3>{label}</h3>    
    {#if subtitle}  
      <p>{subtitle}</p>
    {/if}    
  {/if}
</header>

<style>
  div {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  div > div {
    display: flex;
    flex-direction: row;
  }

  div > div:last-of-type {
    justify-content: flex-end;
  }

  h3 {
    box-sizing: border-box;
    color: var( --secondary-accent-color, #1D1B20 );
    color: #ffffff;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 28px;
    font-weight: 400;   
    letter-spacing: 0; 
    line-height: 36px;
    margin: 0;
    padding: 0 0 0 12px;
  }

  header {
    background: var( --primary-accent-color, #FEF7FF );
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 8px 4px 12px 4px;
    transition: background 0.30s ease-in-out;
    width: 100%;
  }

  header > div {
    display: grid;
    grid-template-columns: repeat( 2, 1fr );
  }

  header.small {
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 12px 4px 12px 4px;
  }

  header.small h3 {
    flex-basis: 0;
    flex-grow: 1;
    font-size: 22px;
    line-height: 28px;
    padding: 0 0 0 4px;
  }

  p {
    box-sizing: border-box;
    color: var( --secondary-accent-color, #49454F );
    color: #ffffff;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0 0 0 12px;                  
  }  
</style>
