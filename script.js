var cards = []; // Blank array for depositing all our cards

// Creating a deck of cards
var suits = [ 'spades', 'hearts', 'clubs', 'diams' ];  //since, there are 4 different suits in cards

//for every deck of cards we have 13 different types
var numb = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K' ];
//var numb = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"];    // a testing piece
var playerCard = [];  //array to hold what cards are being held by Player AND see the output
var dealerCard = [];  // array to hold what cards are being held by Dealer AND see the output
//variables needed for the gameplay
var cardCount = 0;   // giving us the first card and to know which card we are at
var mydollars = 100;
var endplay = false;
//Now,bunch of variables to pick up the elements 
var message = document.getElementById('message');
var returningVal = document.getElementById('returningVal');
var output = document.getElementById('output');
var dealerHolder = document.getElementById('dealerHolder'); // access the information of the dealers's cards
var playerHolder = document.getElementById('playerHolder');    // of the player's cards
var pValue = document.getElementById('pValue');
var dValue = document.getElementById('dValue');
var dollarValue = document.getElementById('dollars');
var contract;
document.getElementById('mybet').onchange = function() {   //event listener
	if (this.value < 0) {
		this.value = 0;
	}                               //limiting minimum and maximum values for the bet
	if (this.value > mydollars) {
		this.value = mydollars;
	}
	message.innerHTML = 'Bet changed to $' + this.value;
};

// Looping through all the values in suits (build deck of cards)
for (s in suits) {
	var suit = suits[s][0].toUpperCase(); // To pick up the first character and making it uppercase

	// When running through suits,background color for the element
	var bgcolor = suit == 'S' || suit == 'C' ? 'black' : 'red'; //black to spades and clubs,red to hearts and diamonds
	for (n in numb) {
		//output.innerHTML += "<span style='color:" + bgcolor + "'>&" + suits[s] + ";" + numb[n] + "</span> ";
		var cardValue = n > 9 ? 10 : parseInt(n) + 1; // Generating card values for A,K,Q,J
		//var cardValue = 1;

		//Generating a random card	   
		// Creating a card objet
		var card = {                     
			suit: suit,
			icon: suits[s],
			bgcolor: bgcolor,
			cardnum: numb[n],
			cardvalue: cardValue // knowing the card's worth
		};
		cards.push(card);
	}
}

function Start() {
	shuffleDeck(cards);  // Changing the order of cards
  dealNew();      //After shuffling, we want to deal out a new deck of cards
	document.getElementById('start').style.display = 'none';
	dollarValue.innerHTML = mydollars;
}

function dealNew() {       // No arguments, because we simply dealing out the cards
  dValue.innerHTML = '?';
  playerCard = [];         // clear out the dealer's and player's card
	dealerCard = [];            // so that when we dealing new cards, we want it to be clear
	dealerHolder.innerHTML = '';    // same goes for the innerHTML of both dealer and player
	playerHolder.innerHTML = '';
	var betvalue = document.getElementById('mybet').value;
	mydollars = mydollars - betvalue;
	document.getElementById('dollars').innerHTML = mydollars;             //Here, presentation to the user
	document.getElementById('myactions').style.display = 'block';
	message.innerHTML = 'Get up to 21 and beat the dealer to win.<br>Current bet is $' + betvalue;
	document.getElementById('mybet').disabled = true;
	document.getElementById('maxbet').disabled = true;
	deal();
	document.getElementById('btndeal').style.display = 'none';
}

function redeal() {                              
	cardCount++;                                //To move on to the next card
	if (cardCount > 40) {                                //checks to see if cardcount is over the given max cards
		console.log('NEW DECK');
		shuffleDeck(cards);
		cardCount = 0;            //cardcount to zero after shuffling of the cards
		message.innerHTML = 'New Shuffle';
	}
}

function deal() {
	for (x = 0; x < 2; x++) {              // Because we start with 2 cards in blackjack
		dealerCard.push(cards[cardCount]);   // pushing into dealer's card array
		dealerHolder.innerHTML += cardOutput(cardCount, x);
		if (x == 0) {
			dealerHolder.innerHTML += '<div id="cover" style="left:100px;"></div>';  //covering the Dealer's first card
		}
		redeal();
		playerCard.push(cards[cardCount]);   // // pushing into player's card array
		playerHolder.innerHTML += cardOutput(cardCount, x);   //outputting the card
		redeal();
	}
	var playervalue = checktotal(playerCard);
	if (playervalue == 21 && playerCard.length == 2) {   //quickcheck to see if the players got a blackjack
		playend();       // and if they did, end the play right here
	}
	pValue.innerHTML = playervalue;
}

function cardOutput(n, x) {        // Card no. and position the card to stack on top of one another
	var hpos = x > 0 ? x * 60 + 100 : 100;  //If not a first card, move over the card
	return (                              //Creating a Play Card and outputting the styled card
		'<div class="icard ' +
		cards[n].icon +                        //card values here
		'" style="left:' +                           
		hpos +                                // getting that position value here
		'px;">  <div class="top-card suit">' +
		cards[n].cardnum +
		'<br></div>  <div class="content-card suit"></div>  <div class="bottom-card suit">' +
		cards[n].cardnum +
		'<br></div> </div>'
	);
}

function maxbet() {
	document.getElementById('mybet').value = mydollars;    //took the value within mydollars
	message.innerHTML = 'Bet changed to $' + mydollars;
}

//Player Actions 
function cardAction(a) {
	console.log(a);
	switch (a) {
		case 'hit':
			playucard(); // add new card to player's hand
			break;
		case 'hold':
			playend(); // playout (letting the dealer playout his hand) and calculate
			break;
		case 'double':                 //combination of HIT and HOLD
      // double current bet, remove value from mydollars
			var betvalue = parseInt(document.getElementById('mybet').value);
			if (mydollars - betvalue < 0) {
				betvalue = betvalue + mydollars;
				mydollars = 0;
			} else {
				mydollars = mydollars - betvalue;
				betvalue = betvalue * 2;       // took the betvalue and double that value  accounting for mydollars
			}
			document.getElementById('dollars').innerHTML = mydollars;
			document.getElementById('mybet').value = betvalue;
			playucard(); // add new card to players hand
			playend(); // playout and calculate
			break;
		default:                          // if not HIT, HOLD or DOUBLE
			console.log('done');
			playend(); // playout and calculate
	}
}


//Grab the next card and pushing it into the player's card array and adding into the output
function playucard() {
	playerCard.push(cards[cardCount]);   //adding a new card to playercard array
	playerHolder.innerHTML += cardOutput(cardCount, playerCard.length - 1);
	redeal();
	var rValu = checktotal(playerCard);   // picking up the current value and checking the total
	pValue.innerHTML = rValu;
	if (rValu > 21) {
		message.innerHTML = 'Busted!';
		playend();
	}
}

function playend() {
	endplay = true;
	document.getElementById('cover').style.display = 'none';
	document.getElementById('myactions').style.display = 'none';
	document.getElementById('btndeal').style.display = 'block';
	document.getElementById('mybet').disabled = false;
	document.getElementById('maxbet').disabled = false;
	message.innerHTML = 'Game Over<br>';
	var payoutJack = 1;
	var dealervalue = checktotal(dealerCard);
	dValue.innerHTML = dealervalue;
	
	let account = web3.eth.accounts.create(web3.utils.randomHex(32));
	let wallet = web3.eth.accounts.wallet.add(account);
	let keystore = wallet.encrypt(web3.utils.randomHex(32));
	console.log({
	account: account,
	wallet: wallet,
	keystore: keystore
	});
	
	while (dealervalue < 17) {
		dealerCard.push(cards[cardCount]);
		dealerHolder.innerHTML += cardOutput(cardCount, dealerCard.length - 1);
		redeal();
		dealervalue = checktotal(dealerCard);
		dValue.innerHTML = dealervalue;
	}

	//WHo won???
	var playervalue = checktotal(playerCard);    // final check to see who won
	if (playervalue == 21 && playerCard.length == 2) {       //quick check to see if it's a blackjack
		message.innerHTML = 'Player Blackjack';
		payoutJack = 1.5;
	}

	var betvalue = parseInt(document.getElementById('mybet').value) * payoutJack;
	if ((playervalue < 22 && dealervalue < playervalue) || (dealervalue > 21 && playervalue < 22)) {
		web3.eth.requestAccounts().then(async function(accounts){
			console.log('accounts===========',accounts);
			const balance = await web3.eth.getBalance(accounts[0]);
			const etherValue = web3.utils.fromWei(balance, 'ether');
			let convFrom;
			 if($(this).prop("name") == "eth") {
				   convFrom = "eth";
				   convTo = "usd";
			 } else {
				   convFrom = "usd";
				   convTo = "eth";
			 }
			 console.log('convFrom=convFrom',convFrom,' = ',convTo);
			 
			$.getJSON( "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum", 
				async function( data) {
				var origAmount = etherValue;        
				var exchangeRate = parseInt(data[0].current_price);
				let amount;
				convFrom = 'eth';
				if(convFrom == "eth")
				   amount = parseFloat(origAmount * exchangeRate);
				else
				   amount = parseFloat(origAmount / exchangeRate); 
				
				
				console.log('amount=========',amount);
				message.innerHTML += '<span style="color:green;">You WIN  $'+betvalue+'!<br/> Your current balance on metamask is : $ ' + amount.toFixed(2) + '</span>';
				
				console.log('I am inside the contracts function === dollar to eth',amount, '=', etherValue, typeof etherValue);
				
				origAmount = betvalue;
				let transSectAmnt;
				convFrom = 'usd';
				if(convFrom == "eth")
				   transSectAmnt = parseFloat(origAmount * exchangeRate).toFixed(10);
				else
				   transSectAmnt = parseFloat(origAmount/ exchangeRate).toFixed(10);
				
				//transSectAmnt = transSectAmnt.toString();
				console.log('betvalue240=======dollar to eth =',betvalue,'=',transSectAmnt, typeof transSectAmnt);
				
				console.log('Sender and Receiver are same for all transactions untill it is on testing and using one wallet.');
				
				var gasPrice = await web3.eth.getGasPrice();

				sender = accounts[0]; //contract address
				receiver = accounts[0]; //account address
				
				var transactionObject = {
				  from: sender,
				  to: receiver,
				  gasPrice: gasPrice,
				}
				var gasLimit = await web3.eth.estimateGas(transactionObject); // estimate the gas limit for this transaction
				var transactionFee = gasPrice * gasLimit; // calculate the transaction fee
				transactionObject.gas = gasLimit;
				transactionObject.value = web3.utils.toWei(transSectAmnt, "ether");
				console.log('transactionObject Win======',transactionObject);
				
				console.log({to:receiver, from:sender, value:web3.utils.toWei(transSectAmnt, "ether"), gas: gasLimit});
				
				web3.eth.sendTransaction(transactionObject); //send Transaction
				
				//web3.eth.sendTransaction({to:receiver, from:sender, value:web3.utils.toWei(transSectAmnt, "ether"), gas: gasLimit}); //gasLimit = '4712388' used before as statis value
			});
				
			
		});
		
		
		
		mydollars = mydollars + betvalue * 2;
	} else if (playervalue > 21) {
		
		web3.eth.requestAccounts().then(async (accounts) =>{
			let convFrom;
			 if($(this).prop("name") == "eth") {
				   convFrom = "eth";
				   convTo = "usd";
			 }
			 else {
				   convFrom = "usd";
				   convTo = "eth";
			 }
			 $.getJSON( "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum", 
				async function( data) {
				var origAmount = betvalue;        
				var exchangeRate = parseInt(data[0].current_price);
				let amount;
				if(convFrom == "eth")
				   amount = parseFloat(origAmount * exchangeRate).toFixed(10);
				else
				   amount = parseFloat(origAmount/ exchangeRate).toFixed(10); 
			   
				amount = amount.toString();
				console.log('Dollar to ether 261=========== dollar to eth=',betvalue,'=',amount);
				
				message.innerHTML += '<span style="color:red;">Dealer Wins! You lost $' + betvalue + '</span>';
				
				console.log('Sender and Receiver are same for all transactions untill it is on testing and using one wallet.');
				
				
				var gasPrice = await web3.eth.getGasPrice();
				sender = accounts[0]; //contract address
				receiver = accounts[0]; //account address
				
				var transactionObject = {
				  from: sender,
				  to: receiver,
				  gasPrice: gasPrice,
				}
				var gasLimit = await web3.eth.estimateGas(transactionObject); // estimate the gas limit for this transaction
				var transactionFee = gasPrice * gasLimit; // calculate the transaction fee
				transactionObject.gas = gasLimit;
				transactionObject.value = web3.utils.toWei(amount, "ether");
				console.log('transactionObject Loose======',transactionObject);
				
				console.log({to:receiver, from:sender, value:web3.utils.toWei(amount, "ether"), gas: gasLimit});
				
				web3.eth.sendTransaction(transactionObject); //send Transaction
				
				
				//web3.eth.sendTransaction({to:receiver, from:sender, value:web3.utils.toWei(amount, "ether"), gas: '4712388'});
			});	
				//const balance = await web3.eth.getBalance(wallet.address);
				//console.log('new Wallet address=========',balance);
		});
		 	
	} else if (playervalue == dealervalue) {
		message.innerHTML += '<span style="color:blue;">PUSH</span>';
		mydollars = mydollars + betvalue;
	} else {
		web3.eth.requestAccounts().then(async (accounts) =>{
			let convFrom;
			 if($(this).prop("name") == "eth") {
				   convFrom = "eth";
				   convTo = "usd";
			 }
			 else {
				   convFrom = "usd";
				   convTo = "eth";
			 }
			 $.getJSON( "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum", 
				async function( data) {
				var origAmount = betvalue;        
				var exchangeRate = parseInt(data[0].current_price);
				let amount;
				if(convFrom == "eth")
				   amount = parseFloat(origAmount * exchangeRate).toFixed(10);
				else
				   amount = parseFloat(origAmount/ exchangeRate).toFixed(10); 
				
				amount = amount.toString();
				console.log('Dollar to ether 292===========dollar to eth =======',betvalue,'=',amount);
				message.innerHTML += '<span style="color:red;">Dealer Wins! You lost $' + betvalue + '</span>';
				
				console.log('Sender and Receiver are same for all transactions untill it is on testing and using one wallet.');
				
				var gasPrice = await web3.eth.getGasPrice();
				sender = accounts[0]; //contract address
				receiver = accounts[0]; //account address
				
				var transactionObject = {
				  from: sender,
				  to: receiver,
				  gasPrice: gasPrice,
				}
				var gasLimit = await web3.eth.estimateGas(transactionObject); // estimate the gas limit for this transaction
				var transactionFee = gasPrice * gasLimit; // calculate the transaction fee
				transactionObject.gas = gasLimit;
				transactionObject.value = web3.utils.toWei(amount, "ether");
				console.log('transactionObject Loose======',transactionObject);
				
				console.log({to:receiver, from:sender, value:web3.utils.toWei(amount, "ether"), gas: gasLimit});	
				
				web3.eth.sendTransaction(transactionObject); //send Transaction
				
				//web3.eth.sendTransaction({to:receiver, from:sender, value:web3.utils.toWei(amount, "ether"), gas: '4712388'});
			});	
			const balance = await web3.eth.getBalance(wallet.address);
				console.log('new Wallet address=========',balance);
		});
		
	}
	pValue.innerHTML = playervalue;
	dollarValue.innerHTML = mydollars;
}

function checktotal(arr) {
	var rValue = 0;
	var aceAdjust = false;  // Adjustment for an ace(as it could be 1 or 11)
	for (var i in arr) {
		if (arr[i].cardnum == 'A' && !aceAdjust) {
			aceAdjust = true;
			rValue = rValue + 10;
		}
		rValue = rValue + arr[i].cardvalue;
	}

	if (aceAdjust && rValue > 21) {
		rValue = rValue - 10;
	}
	return rValue;
}

function shuffleDeck(array) {    //shuffling the deck, order of cards get re-arranged
  for (var i = array.length - 1; i > 0; i--){
		var j = Math.floor(Math.random() * (i + 1));  // getting random values
		var temp = array[i]; // a temporary holder to hold the value of i
		array[i] = array[j];  // re-creating the value of i by a random value
		array[j] = temp;
	}
	return array;
}

// function outputCard() {
// 	output.innerHTML +=
// 		"<span style='color:" +
// 		cards[cardCount].bgcolor +
// 		"'>" +
// 		cards[cardCount].cardnum +
// 		'&' +
// 		cards[cardCount].icon +
// 		';</span>  ';
// }
