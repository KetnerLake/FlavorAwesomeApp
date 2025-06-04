<script>
  let {children} = $props();
</script>

<nav>
  <ul>
    {@render children()}   
  </ul>
</nav>

<style>
  nav {
    align-items: center;
    background: var( --primary-accent-color );
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 4px;
    margin: 0;
    padding: 0;
    /* padding-bottom: max( 6px, env( safe-area-inset-bottom ) ); */
    transition: background 0.30s ease-in-out;
  }

  ul {
    align-items: center;
    background: #ffffff;
    border-bottom: solid 1px #00000010;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;    
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0 4px 0 4px;
    width: 100%;
  }
</style>
