<script>
  import Icon from "@iconify/svelte";
  import Input from "../Input.svelte";

  let {mode = null, oncheckout, onverify} = $props();

  /*
  const pricing = [
    'price_1Rf8dQLoEUocdYIFdfGUdEw9',
    'price_1Rf8etLoEUocdYIFLlhd4Tqg',
    'price_1Rf8fOLoEUocdYIFdprD8aE1'
  ];
  */

  const pricing = [
    {price: 'price_1Rf8dQLoEUocdYIFdfGUdEw9', mode: 'subscription'},
    {price: 'price_1Rf8etLoEUocdYIFLlhd4Tqg', mode: 'subscription'},
    {price: 'price_1Rf8fOLoEUocdYIFdprD8aE1', mode: 'payment'}
  ];

  let email = $state( null );
  let plan = $state( 1 );

  function onVerifyClick() {
    if( email === null ) {
      alert( 'Email address is requred.' );
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if( !regex.test( email ) ) {
      alert( 'Email address is invalid.' );
      return;
    }    

    if( onverify ) onverify( email );
  }
</script>

<div class="screen">
  {#if mode === null}
    <ul>
      <li>
        <button onclick={() => plan = 0} type="button">
          <span>
            <Icon 
              height="24" 
              icon={plan === 0 ? 'material-symbols:check-circle-rounded' : 'material-symbols:circle-outline'}
              width="24" />
          </span>
          <span>Monthly Subscription</span>
          <span>$3.30</span>
        </button>
      </li>
      <li>
        <button onclick={() => plan = 1} type="button">
          <span>
            <Icon 
              height="24" 
              icon={plan === 1 ? 'material-symbols:check-circle-rounded' : 'material-symbols:circle-outline'} 
              width="24" />
          </span>
          <span>Billed annually</span>
          <span>$33.00</span>
        </button>
      </li>
      <li>
        <button onclick={() => plan = 2} type="button">
          <span>
            <Icon 
              height="22" 
              icon={plan === 2 ? 'material-symbols:check-circle-rounded' : 'material-symbols:circle-outline'}
              width="22" />
          </span>
          <span>Lifetime</span>
          <span>$100.00</span>
        </button>
      </li>        
    </ul>
    <button 
      class="action" 
      onclick={() => oncheckout( pricing[plan] )} 
      type="button">
      Proceed to checkout
    </button>

    <h3>Already have an account?</h3>
    <p>Enter your email address<br/>to send one-time password.</p>    
  {:else if mode === 'success'}
    <figure>
      <img alt="Thank you!" src="/img/sticky-note.svg" />
    </figure>
    <h3 class="success">Thank you!</h3>
    <p>An invoice will be sent<br>to the email provided during checkout.</p>
    <p>Complete the process by<br>logging into your account using<br>the email provided during checkout.</p>
  {/if}

  <Input 
    label="Email address" 
    onchange={( evt ) => email = evt.value}    
    placeholder="Use email to login" 
    --flex-grow="0"
    --primary-accent-color="#5fb2ff" />
  <button 
    class="action" 
    onclick={onVerifyClick} 
    type="button">
    Send verification
  </button>
</div>

<style>
  button.action {
    appearance: none;
    background: #5fb2ff;
    border: none;
    border-radius: 40px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    outline: none;
    padding: 0 16px 0 16px;
    width: 100%;
  }

  div.screen {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
    min-width: 100%;    
    overflow: auto;
    padding: 0 16px 16px 16px;
  }  

  figure {
    align-items: center;
    border: dashed 4px #00000010;
    border-radius: 16px;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    justify-content: center;
    margin: 16px 0 0 0;
    padding: 0;
  }

  figure img {
    width: 60%;
  }

  h3 {
    box-sizing: border-box;
    color: var( --primary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 28px;
    margin: 0;
    padding: 16px 0 0 0;
    text-align: center;    
  }

  h3.success {
    padding: 0;
  }

  p {
    box-sizing: border-box;
    color: var( --secondary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 20px;
    margin: 0;
    padding: 0;
    text-align: center;    
  }

  ul {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    border: dashed 4px #00000010;
    border-radius: 16px;
    cursor: pointer;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    margin: 16px 0 0 0;
    padding: 0;
  }

  li button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    gap: 8px;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    outline: none;
    padding: 16px;
    width: 100%;
  }

  li button span:nth-of-type( 1 ) {
    color: var( --secondary-text-color );
    height: 24px;
    padding: 0;
    width: 24px;
  }

  li button span:nth-of-type( 2 ) {
    flex-basis: 0;
    flex-grow: 1;
    text-align: left;
  }
</style>
