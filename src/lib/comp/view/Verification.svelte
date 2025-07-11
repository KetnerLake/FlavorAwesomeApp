<script>
  import Input from "../Input.svelte";

  let {ontoken} = $props();

  let otp = $state( null );

  function onSignClick() {
    if( otp === null ) {
      alert( 'Token value is required.' );
      return;
    }

    if( ontoken ) ontoken( otp );
  }
</script>

<div class="screen" style="justify-content: center;">
  <h3>Verification Code</h3>
  <p style="padding: 0 16px 0 16px;">A one-time password (OTP/verification) has been sent to the provided email address.</p>
  <form>
    <Input 
      label="OTP" 
      onchange={( evt ) => otp = evt.value}
      placeholder="One-time password from email" 
      --primary-accent-color="#5fb2ff" />    
    <button onclick={onSignClick} type="button">Sign in</button>
  </form>
</div>

<style>
  button {
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

  form {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 0;
    padding: 0;
    width: 100%;    
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
    padding: 0;
    text-align: center;
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
</style>