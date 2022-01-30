
let sumTotal = 40000;

let squaresFilled = Math.floor(sumTotal / 180);
for(let i=0;i<1000;i++){
  let square = document.getElementById('square');
  var button = document.createElement('BUTTON');
  if(i < squaresFilled){
    button.disabled = true;
    button.style.background = 'lightblue';
  }
  if(i % 50 == 0){
      let breake = document.createElement('br');
        square.appendChild(breake);
    }
    button.classList.add("but"+i, "button");
    square.appendChild(button);
}

function add10(bt){
  var className = bt.className;
  let getPrice = document.getElementById("inlineFormInputGroup").value;
  if(!className.includes('clicked')){
    if(selectCurrency == 'RON') {
      //getPrice = parseInt(getPrice,10) + 10*5;
      getPrice = 10*5;
      
    } else if(selectCurrency == 'EUR') {
      //getPrice = parseInt(getPrice,10) + 10;
      getPrice = 10;
    }
    $(bt).addClass("clicked");
  } else {
    if(selectCurrency == 'RON') {
      //getPrice = parseInt(getPrice,10) - 10*5;  
      getPrice = 0;
    } else if(selectCurrency == 'EUR') {
      //getPrice = parseInt(getPrice,10) - 10;
      getPrice = 0;
    }
    bt.classList.remove("clicked");
  }
  document.getElementById("inlineFormInputGroup").value = getPrice;
  updatePrice();
}
function add50(bt){
  var className = bt.className;
  let getPrice = document.getElementById("inlineFormInputGroup").value;
  if(!className.includes('clicked')){
    if(selectCurrency == 'RON') {
      //getPrice = parseInt(getPrice,10) + 50*5;
      getPrice = 50*5;
      
    } else if(selectCurrency == 'EUR') {
      //getPrice = parseInt(getPrice,10) + 50;
      getPrice = 50;
    }
    $(bt).addClass("clicked");
    let add10 = document.getElementsByClassName("add10");
    console.log('add10:',add10.attributes); 

  } else {
    if(selectCurrency == 'RON') {
      //getPrice = parseInt(getPrice,10) - 50*5; 
      getPrice = 0; 
    } else if(selectCurrency == 'EUR') {
      //getPrice = parseInt(getPrice,10) - 50;
      getPrice = 0;
    }
    bt.classList.remove("clicked");
  }
  document.getElementById("inlineFormInputGroup").value = getPrice;
  updatePrice();
}
function add100(bt){
  var className = bt.className;
  let getPrice = document.getElementById("inlineFormInputGroup").value;
  if(!className.includes('clicked')){
    if(selectCurrency == 'RON') {
      //getPrice = parseInt(getPrice,10) + 100*5;
      getPrice = 100*5;
      
    } else if(selectCurrency == 'EUR') {
      //getPrice = parseInt(getPrice,10) + 100;
      getPrice = 100;
    }
    $(bt).addClass("clicked");
    let add10 = document.getElementsByClassName("add10");
    console.log('add10:',add10.attributes); 

  } else {
    if(selectCurrency == 'RON') {
      //getPrice = parseInt(getPrice,10) - 100*5;  
      getPrice = 0;
    } else if(selectCurrency == 'EUR') {
      //getPrice = parseInt(getPrice,10) - 100;
      getPrice = 0;
    }
    bt.classList.remove("clicked");
  }
  document.getElementById("inlineFormInputGroup").value = getPrice;
  updatePrice();
}
function add150(bt){
  var className = bt.className;
  let getPrice = document.getElementById("inlineFormInputGroup").value;
  if(!className.includes('clicked')){
    if(selectCurrency == 'RON') {
     // getPrice = parseInt(getPrice,10) + 150*5;
     getPrice = 150*5;
      
    } else if(selectCurrency == 'EUR') {
      //getPrice = parseInt(getPrice,10) + 150;
      getPrice = 150;
    }
    $(bt).addClass("clicked");
    let add10 = document.getElementsByClassName("add10");
    console.log('add10:',add10.attributes); 

  } else {
    if(selectCurrency == 'RON') {
     // getPrice = parseInt(getPrice,10) - 150*5;  
     getPrice = 0;
    } else if(selectCurrency == 'EUR') {
     // getPrice = parseInt(getPrice,10) - 150;
     getPrice = 0;
    }
    bt.classList.remove("clicked");
  }
  document.getElementById("inlineFormInputGroup").value = getPrice;
  updatePrice();
}

const btns = document.getElementsByClassName("button");
let getPrice = '';
function updatePrice(){
  getPrice = document.getElementById("inlineFormInputGroup").value;
}
if(getPrice == ''){
  getPrice = 0;
}
var selectCurrency;
/* select currency START*/
function updateSymbol(e){
  var selected = $(".currency-selector option:selected");
  selectCurrency = selected.text();
  convertSum(selectCurrency);
  console.log(selectCurrency);
  $(".currency-symbol").text(selected.data("symbol"))
  $(".currency-amount").prop("placeholder", selected.data("placeholder"))
  $('.currency-addon-fixed').text(selected.text())
}

$(".currency-selector").on("change", updateSymbol);

updateSymbol();
/* select currency END*/
function convertSum(selectCurrency){
  if(selectCurrency == 'EUR'){
    getPrice = getPrice / 5;
    document.getElementById("inlineFormInputGroup").value = getPrice;

  } else if(selectCurrency == 'RON'){
    getPrice = getPrice * 5;
    document.getElementById("inlineFormInputGroup").value = getPrice;
  }
}


console.log('selectCurrency',selectCurrency);
for (var i = 0; i < btns.length; i++) {
    let bt = btns[i];
    btns[i].addEventListener("click", function () {
      var className = bt.className;
      if(!className.includes('clicked')){
        if(selectCurrency == 'RON') {
          getPrice = parseInt(getPrice,10) +750;
        } else if(selectCurrency == 'EUR') {
          getPrice = parseInt(getPrice,10) +150;
        }
        
        document.getElementById("inlineFormInputGroup").value = getPrice;
        bt.style.background = "lightblue";
        bt.classList.add("clicked");
      } else {
        if(selectCurrency == 'RON') {
          getPrice = parseInt(getPrice,10) - 750;
        } else if(selectCurrency == 'EUR') {
          getPrice = parseInt(getPrice,10) - 150;
        }
        document.getElementById("inlineFormInputGroup").value = getPrice;
        bt.style.background = "#f2dede";
        bt.classList.remove("clicked");
      }
      
    });

    
}



