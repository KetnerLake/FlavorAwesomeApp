<script>
  let {hidden = false} = $props();
</script>

<article class:hidden>
  <p>Coming soon!</p>
</article>

<style>
  article {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    gap: 16px;
    justify-content: center;
    margin: 0;
    overflow: auto;
    padding: 0 0 16px 0;
  }

  article.hidden {
    display: none;
  }

  p {
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.50px;
    line-height: 20px;
    margin: 0;
    padding: 0;
  }
</style>
