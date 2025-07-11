<script>
  import AppBar from "../AppBar.svelte";
  import IconButton from "../IconButton.svelte";
  import Input from "../Input.svelte";

  let {oncancel} = $props();

  let screen = $state();
  let email = $state( null );
  let message = $state( null );
  let subject = $state( null );

  function onCancelClick() {
    hide();
    if( oncancel ) oncancel();
  }

  function onSendClick() {
    if( email === null ) {
      alert( 'Email address is required.' );
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if( !regex.test( email ) ) {
      alert( 'Email address appears to be invalid.' );
      return;
    }    

    if( subject === null ) {
      alert( 'Subject is a required field.' );
      return;
    }

    if( message === null || message.trim().length === 0 ) {
      alert( 'Please provide a message with more detail.' );
      return;
    }

    hide();    

    fetch( '/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        email,
        subject,
        message
      } )
    } )
    .then( ( response ) => response.text() )
    .then( ( data ) => {
      console.log( data );
    } );  
  }

  export function hide() {
    return screen.animate( [
      {top: 0},
      {top: '100vh'}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'      
    } ).finished.then( () => {
      email = null;
      subject = null;
      message = null;
      screen.style.display = 'none';
    } );
  }

  export function show() {
    screen.style.display = 'flex';
    // clear();
      
    screen.animate( [
      {top: '100vh'},
      {top: 0}
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    } );            
  }
</script>

<section bind:this={screen}>
  <AppBar label="Help and Feedback" variation="sm" --primary-accent-color="#5fb2ff">
    {#snippet left()}
      <div class="spacer"></div>
    {/snippet}        
    {#snippet right()}
      <IconButton name="material-symbols:close" onclick={onCancelClick} />        
    {/snippet}
  </AppBar>
  <h3>Need help? Got feedback?</h3>
  <p>Every effort is made to respond to each and every message.</p>
  <Input onchange={( evt ) => email = evt.value} value={email} label="Email address" placeholder="Where can we reach you" --flex-grow="0" --margin="0 16px 16px 16px" --primary-accent-color="#5fb2ff" />
  <Input onchange={( evt ) => subject = evt.value} value={subject} label="Subject" placeholder="Feature? Help? Feedback?" --flex-grow="0" --margin="0 16px 16px 16px" --primary-accent-color="#5fb2ff" />  
  <textarea placeholder="What is on your mind?" bind:value={message}></textarea>
  <button onclick={onSendClick} type="button">Send message</button>
</section>

<style>
  button {
    align-items: center;
    appearance: none;
    background: #5fb2ff;
    border: none;
    border-radius: 40px;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    justify-content: center;
    line-height: 20px;
    height: 40px;
    padding: 0;
    outline: none;
    margin: 0 16px 16px 16px;
    -webkit-tap-highlight-color: transparent;
  }

  div.spacer {
    min-width: 8px;
  }    

  h3 {
    color: var( --primary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    margin: 0;
    padding: 16px;
  }

  p {
    color: var( --primary-text-color );
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin: 0;
    padding: 0 16px 16px 16px;    
  }

  section {
    background: #ffffff;
    box-sizing: border-box;
    display: none;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    left: 0;
    margin: 0;
    max-width: 430px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    top: 100vh;
    transition: top 0.30s ease-in-out;
    width: 100vw;
    z-index: 150;
  }

  textarea {
    border-color: var( --secondary-text-color );
    border-radius: 4px;        
    border-style: solid;
    border-width: 1px;
    color: var( --primary-text-color );
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin: 0 16px 16px 16px;
    outline: none;    
    padding: 8px 12px 12px 12px;
    resize: none;
  }

  textarea::placeholder {
    color: #16161640;          
    opacity: 1.0;
  }     

  textarea:focus-within {
    border-color: #5fb2ff;    
    box-shadow: 0 0 0 3px rgb( from #5fb2ff r g b / 0.38 );
  }  
</style>
