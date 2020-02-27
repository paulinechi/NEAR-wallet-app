
let refreshTimeout = 100;




// Initializing contract
async function initContract() {
  console.log('nearConfig', nearConfig);

  // Initializing connection to the NEAR DevNet.
  window.near = await nearlib.connect(Object.assign({ deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() } }, nearConfig));

  // Initializing Wallet based Account. It can work with NEAR DevNet wallet that
  // is hosted at https://wallet.nearprotocol.com
  window.walletAccount = new nearlib.WalletAccount(window.near);

  // Getting the Account ID. If unauthorized yet, it's just empty string.
  window.accountId = window.walletAccount.getAccountId();

  // Initializing our contract APIs by contract name and configuration.
  window.contract = await near.loadContract(nearConfig.contractName, {
    // NOTE: This configuration only needed while NEAR is still in development
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['whoSaidHi', 'getMessages'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: [
      'addMessage',
      'sayHi'
      ],
    // Sender is the account ID to initialize transactions.
    sender: window.accountId,
  });

 contract.getMessages({})
    .then(renderMessages)
    .catch(console.log);
//   contract.whoSaidHi().then((who) => {
//     const el = document.getElementById('who');
//     el.innerText = who || 'No one';
// })
}



// Renders given array of messages
function renderMessages(messages) {
  let objs = [];
  for (let i = 0; i < messages.length; ++i) {
    objs.push(
      $('<div/>').addClass('row').append([   
        $('<div/>').addClass('message-text').text(messages[i].sender),
        $('<p>').addClass('message-text').text(messages[i].receiver),
        $('<p>').addClass('message-text').text(messages[i].amount),
        $('<p>').addClass('message-text').text(messages[i].text),
        $('<div/>'),
      ])
    );
  } 
     objs.push(
        $('<div/>').addClass('row').append([    
        $('<div/>').addClass('message-text').append($('<strong/>').text('Sender')),
        $('<p>').addClass('message-text').append($('<strong/>').text('Receiver')),
        $('<p>').addClass('message-text').append($('<strong/>').text('Amount')),
        $('<p>').addClass('message-text').append($('<strong/>').text('Note')),
        $('<div/>'),
      ])
    );
  $('#messages').empty().append(objs.reverse());
  // $('#refresh-span').removeClass(animateClass);
}



// should call this method when doing a transaction 
function submitMessage() {
  let receiver = $('#transaction-account').val();
  let amount = $('#transaction-amount').val();
  let text = $('#transaction-note').val();

  $('#text-message').val('');
  // Calls the addMessage on the contract with arguments {text=text}.
  contract.addMessage({text, amount, receiver})
    .then(() => {
      // Starting refresh animation
      // $('#refresh-span').addClass(animateClass);
      // Refreshing the messages in 1 seconds to account for the block creation
      setTimeout(() => {
        refreshMessages();
      }, 1000);
    })
    .catch(console.error);
}

function refreshMessages() {
  // If we already have a timeout scheduled, cancel it
  // if (refreshTimeout) {
  //   clearTimeout(refreshTimeout);
  //   refreshTimeout = null;
  // }
  // Schedules a new timeout
  // refreshTimeout = setTimeout(refreshMessages, 5000);
  // // Checking if the page is not active and exits without requesting messages from the chain
  // // to avoid unnecessary queries to the devnet.
  // if (document.hidden) {
  //   return;
  // }
  // Adding animation UI
  // $('#refresh-span').addClass(animateClass);
  // Calling the contract to read messages which makes a call to devnet.
  // The read call works even if the Account ID is not provided.
  contract.getMessages({})
    .then(renderMessages)
    .catch(console.log);
}








// Using initialized contract
async function doWork() {
  // Based on whether you've authorized, checking which flow we should go.
  if (!window.walletAccount.isSignedIn()) {
    signedOutFlow();
  } else {
    signedInFlow();
  }
}

// Function that initializes the signIn button using WalletAccount
function signedOutFlow() {
  // Displaying the signed out flow container.
  Array.from(document.querySelectorAll('.signed-out')).forEach(el => el.style.display = '');
  // Adding an event to a sing-in button.
  document.getElementById('sign-in').addEventListener('click', () => {
    window.walletAccount.requestSignIn(
      // The contract name that would be authorized to be called by the user's account.
      window.nearConfig.contractName,
      // This is the app name. It can be anything.
      'Who was the last person to say "Hi!"?',
      // We can also provide URLs to redirect on success and failure.
      // The current URL is used by default.
    );
  });
}

// Main function for the signed-in flow (already authorized by the wallet).
async function signedInFlow() {
  $('#guest-book-container').removeClass('hidden');

  // Enablid enter key to send messages as well.
  $('#text-message').keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();
      submitMessage();
      return false;
    }
  });



  // Post button to send messages
  $('#submit-tx-button').click(submitMessage); // to be deleted 
  $('#new-transaction').click(submitMessage);


  // Displaying the signed in flow container.
  Array.from(document.querySelectorAll('.signed-in')).forEach(el => el.style.display = '');

  // Displaying current account name.
  document.getElementById('account-id').innerText = window.accountId;


  document.getElementById('new-transaction').addEventListener('click', async () => {

  console.log('click to submit transaction');
    let receiver = document.getElementById('transaction-account').value;
    let tokenAmount = document.getElementById('transaction-amount').value;
    
    console.log(receiver);
    console.log(tokenAmount);



    // nearlib.sendToken(2,'pchi', 'pchi2');
    console.log(window.accountId);
    let amount_to_send = nearlib.utils.format.parseNearAmount(tokenAmount);
  
    // find a way to store this automatically for each new user
    let user_account_privateKey = "ed25519:36wau29Hn5jp5ZJff4XRt81etEL2DoAoS9XyVKLUnnCwLFQ7g1Ta6SEMm9qiv7SGPRMHcGU8FTGgxiEnPoKko1Ju"
    let the_user_account = window.accountId;
    window.localStorage.setItem(`nearlib:keystore:${the_user_account}:default`, user_account_privateKey)

    try {
      let sender = await near.account(window.accountId);
      console.log(sender);
      let final = await sender.sendMoney(receiver, amount_to_send);
      console.log(final);

      // print out the results
      console.log("transaction id", final.transaction_outcome.id)
      console.log("gas used", final.transaction_outcome.outcome.gas_burnt)
      let note = 'transaction note';

      contract.addMessage({note})
        .then(() => {
          // Starting refresh animation
          // $('#refresh-span').addClass(animateClass);
          // Refreshing the messages in 1 seconds to account for the block creation
          setTimeout(() => {
            refreshMessages();
          }, 1000);
        })
        .catch(console.error);
          
      // celebrate
      console.log("success!")
      alert('success!');





    } catch (error) {
      console.warn(error.type, error.message)
    }

  });



  // Adding an event to a sing-out button.
  document.getElementById('sign-out').addEventListener('click', e => {
    e.preventDefault();
    walletAccount.signOut();
    // Forcing redirect.
    window.location.replace(window.location.origin + window.location.pathname);
  });
}

// Loads nearlib and this contract into window scope.
window.nearInitPromise = initContract()
  .then(doWork)
  .catch(console.error);
