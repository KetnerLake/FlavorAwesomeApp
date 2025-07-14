<script>
  let {display = new Date(), onchange, value = new Date()} = $props();

  let days = $derived.by( () => {
    const calendar = new Date( display.getFullYear(), display.getMonth(), 1 );      
    const dates = [];
    const today = new Date();

    calendar.setDate( calendar.getDate() - calendar.getDay() );    

    const weeks = weekCount( 
      display.getFullYear(), 
      display.getMonth() + 1, 
      calendar.getDay() 
    );    

    for( let d = 0; d < ( 7 * weeks ); d++ ) {
      let isOutside = true;
      let isSelected = false;
      let isToday = false;
    
      // Selection
      if( value === null ) {
        isSelected = false;
      } else {
        if(
          calendar.getFullYear() === value.getFullYear() &&
          calendar.getMonth() === value.getMonth() &&
          calendar.getDate() === value.getDate()
        ) {
          isSelected = true;
        }
      }          
  
      // Outside
      if( 
        calendar.getFullYear() === display.getFullYear() && 
        calendar.getMonth() === display.getMonth()
      ) {
        isOutside = false;
      }
  
      // Today
      if(
        calendar.getFullYear() === today.getFullYear() &&
        calendar.getMonth() === today.getMonth() &&
        calendar.getDate() === today.getDate()
      ) {
        isToday = true;
      }
  
      dates.push( {
        date: calendar.getDate(),
        month: calendar.getMonth(),
        year: calendar.getFullYear(),
        outside: isOutside,
        selected: isSelected,
        today: isToday
      } );
  
      calendar.setDate( calendar.getDate() + 1 );
    }

    return dates;
  } );  

  function onDayClick( evt ) {
    const selected = new Date(
      parseInt( evt.currentTarget.getAttribute( 'data-year' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-month' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-date' ) )
    );

    value = new Date( selected.getTime() );

    if( onchange ) {
      onchange( value );    
    }
  }

  // Month is in the range 1 - 12
  // https://stackoverflow.com/questions/2483719/get-weeks-in-month-through-javascript
  function weekCount( year, month, start = 0 ) {
    const firstDayOfWeek = start || 0;
    const firstOfMonth = new Date( year, month - 1, 1 );
    const lastOfMonth = new Date( year, month, 0 );
    const numberOfDaysInMonth = lastOfMonth.getDate();
    const firstWeekDay = ( firstOfMonth.getDay() - firstDayOfWeek + 7 ) % 7;
    const used = firstWeekDay + numberOfDaysInMonth;

    return Math.ceil( used / 7 );
  }
</script>

<ul>
  {#each days as day}
    <li>
      <button  
        class="day"
        class:outside={day.outside} 
        class:selected={day.selected}
        class:today={day.today}
        data-date={day.date}
        data-month={day.month}
        data-year={day.year}
        onclick={onDayClick} 
        type="button">
        {day.date}
      </button>
    </li>
  {/each}    
</ul>

<style>
  button.day {        
    align-items: center;
    appearance: none;
    background: none;
    border: solid 1px transparent;
    border-radius: 40px;
    box-sizing: border-box;          
    color: var( --primary-text-color );
    cursor: pointer;
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    font-size: 16px;       
    font-weight: 400;   
    height: 40px;
    justify-content: center;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    outline: none;
    padding: 0;
    text-align: center;
    width: 40px;
    -webkit-tap-highlight-color: transparent;                
  }  

  button.day.outside {
    visibility: hidden;
  }  

  button.day.today {
    border-color: var( --primary-accent-color );
    border-style: solid;
    border-width: 1px;
    color: var( --primary-accent-color );
    font-weight: 600;
  }

  button.day.selected {
    background: var( --primary-accent-color );
    color: #ffffff;
  }   

  ul {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat( 7, 1fr );
    grid-column-gap: 0px;
    grid-row-gap: 0px;     
    list-style: none;
    margin: 0;       
    padding: 0 12px 0 12px;    
  }

  ul li {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
  }
</style>
