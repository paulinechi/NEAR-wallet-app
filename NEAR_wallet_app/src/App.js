import 'regenerator-runtime/runtime';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { Component, useState } from 'react';
import logo from './assets/logo.svg';
import nearlogo from './assets/gray_near_logo.svg';
import './App.css';
import * as nearlib from 'nearlib';


import { useTable } from 'react-table'
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableContainer from '@material-ui/core/TableContainer';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import { Button, Modal, DropdownButton, Dropdown } from 'react-bootstrap';

import $ from 'jquery';
import BN from 'bn.js'
import moment from 'moment';

// icons - spending   
import groceries from './assets/toilet-paper.png';
import foodAndDrinks from './assets/juice.png';
import transport from './assets/train.png';
import utilities from './assets/house.png';
import travel from './assets/passport.png';
import shopping from './assets/shopping-cart.png'; 
import exercise from './assets/gym.png';
import beauty from './assets/beauty-treatment.png';
import medical from './assets/medicine.png';
import leisure from './assets/bowling-pins.png';
import education from './assets/diploma.png';
import pets from './assets/dog.png';
import gifts from './assets/gift.png';
import housing from './assets/address.png';
import other from './assets/menu.png';

// icons - income 
// import salary from './assets/toilet-paper.png';
// import investment from './assets/toilet-paper.png';


let rows = [];
let accountBalance = '';
let typeOfTransaction = '';
let requestAlert = false; // set this on blockchain, now it'll reset everytime refreshed
let requestSender = '';
let requestAmount = '';

function setTransactionType(type){
  typeOfTransaction = type;
  console.log(typeOfTransaction);
}


function TransferTokenModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className='transfer-token-btn'>
        Transfer Token
      </Button>

      <Modal show={show} onHide={handleClose} animation={false} id="transfer-token-modal">
        <Modal.Header closeButton>
          <Modal.Title>Send Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='send_token_modal'>
            Account to send to: <input type="text" placeholder=" Account" id='transaction-account' />
          </div>

          <div className='send_token_modal'>
            Amount: <input type="number" placeholder=" Number of token" id='transaction-amount' />
          </div>
          
          <div className='send_token_modal'>
            Note: <input type="text" placeholder=" Note" id='transaction-note' />
          </div>

          <div className='send_token_modal'>
            <div className="token-type-label">
              Type:
            </div>
            <div className="icons-group-div">
              <div className="icons-group">
                <Button id="groceries" className="icon-span" onClick={() => { typeOfTransaction = 'groceries'; }}><img src={groceries} className="icons" /> <p className="icons-label"> Groceries</p> </Button>
                <Button id="foodAndDrinks" className="icon-span" onClick={() => { typeOfTransaction = 'foodAndDrinks'; }}><img src={foodAndDrinks} className="icons" /> <p className="icons-label"> Food And Drinks</p> </Button>
                <Button id="transport" className="icon-span" onClick={() => { typeOfTransaction = 'transport'; }}><img src={transport} className="icons" /> <p className="icons-label"> Transport</p> </Button>
                <Button id="utilities" className="icon-span" onClick={() => { typeOfTransaction = 'utilities'; }}><img src={utilities} className="icons" /> <p className="icons-label"> Utilities</p> </Button>
                <Button id="travel" className="icon-span" onClick={() => { typeOfTransaction = 'travel'; }}><img src={travel} className="icons" /> <p className="icons-label"> Travel</p> </Button>
                <Button id="shopping" className="icon-span" onClick={() => { typeOfTransaction = 'shopping'; }}><img src={shopping} className="icons" /> <p className="icons-label"> Shopping</p> </Button>
                <Button id="exercise" className="icon-span" onClick={() => { typeOfTransaction = 'exercise'; }}><img src={exercise} className="icons" /> <p className="icons-label"> Exercise</p> </Button>
                <Button id="beauty" className="icon-span" onClick={() => { typeOfTransaction = 'beauty'; }}><img src={beauty} className="icons" /> <p className="icons-label"> Beauty</p> </Button>
                <Button id="medical" className="icon-span" onClick={() => { typeOfTransaction = 'medical'; }}><img src={medical} className="icons" /> <p className="icons-label"> Medical</p> </Button>
                <Button id="leisure" className="icon-span" onClick={() => { typeOfTransaction = 'leisure'; }}><img src={leisure} className="icons" /> <p className="icons-label"> Leisure</p> </Button>
                <Button id="education" className="icon-span" onClick={() => { typeOfTransaction = 'education'; }}><img src={education} className="icons" /> <p className="icons-label"> Education</p> </Button>
                <Button id="pets" className="icon-span" onClick={() => { typeOfTransaction = 'pets'; }}><img src={pets} className="icons" /> <p className="icons-label"> Pets</p> </Button>
                <Button id="gifts" className="icon-span" onClick={() => { typeOfTransaction = 'gifts'; }}><img src={gifts} className="icons" /> <p className="icons-label"> Gifts</p> </Button>
                <Button id="housing" className="icon-span" onClick={() => { typeOfTransaction = 'housing'; }}><img src={housing} className="icons" /> <p className="icons-label"> Housing</p> </Button>
                <Button id="other" className="icon-span" onClick={() => { typeOfTransaction = 'other'; }}><img src={other} className="icons" /> <p className="icons-label"> Other</p> </Button>
              </div>
              <p className="attribute">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> </p>
            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <button id="new-transaction" variant="primary" onClick={transferToken}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}




function RequestTokenModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className='transfer-token-btn'>
        Request Token
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Request Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='send_token_modal'>
            Account request from: <input type="text" placeholder=" Account" id='request-account' />
          </div>

          <div className='send_token_modal'>
            Amount: <input type="number" placeholder=" Number of token" id='request-amount' />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <button id="new-transaction" variant="primary" onClick={requestToken}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


function RequestTokenNotificationModal() {
  console.log('request notification');
  // console.log(requestSender, requestAmount);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className='request-token-notification-btn'>
        <span>Message</span>
        { requestAlert &&
          <span className="badge" >1</span>
        }
      </Button>

      {requestAlert &&
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>You have one new token request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='send_token_modal'>
              Request sent from: {requestSender}
            </div>

            <div className='send_token_modal'>
              Amount: {requestAmount}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              handleClose();
              requestAlert = false;
            }}>
              Dismiss
          </Button>
            {/* <button id="new-transaction" variant="primary" onClick={() => {
              return (
                <TransferTokenModal />
              )
            }}>
              Transfer
          </button> */}
          </Modal.Footer>
        </Modal>
      }
    </>
  );
}


function ViewAnalysis() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className='transfer-token-btn'>
        View Analysis
      </Button>
      {/* shouldn't be a modal, change the transaction table view */}
    </>
  );
}

async function transferToken() {
  // document.getElementById('new-transaction').addEventListener('click', async () => {
    console.log('click to submit transaction');
    let receiver = document.getElementById('transaction-account').value;
    let tokenAmount = document.getElementById('transaction-amount').value;
    let amount_to_send = nearlib.utils.format.parseNearAmount(tokenAmount);

    // find a way to store this automatically for each new user ******
    // also located in the /neardev/default/{accountId}.json folder
    let user_account_privateKey = "ed25519:fm46Vy8oggt9qLqUze5R7DDiKm99eHCwaYFyhRa3UZsA83R8oTzWYotw66RQXzJ2Arz44KY5zxBwuuY6aqQUJS5"
    let the_user_account = window.accountId;

    window.localStorage.setItem(`nearlib:keystore:${the_user_account}:default`, user_account_privateKey)
    let near = await nearlib.connect(Object.assign({ deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() } }, window.nearConfig));
    let sender = await near.account(accountId);

    try {
      let final = await sender.sendMoney(receiver, amount_to_send);
      console.log(final);
      // $('#transfer-token-modal').modal('hide');

      // accountBalance = nearlib.utils.format.formatNearAmount(sender._state.amount);  
      // not sure why the account balance isn't updated immediately after transaction
      // minus amount to send to get the correct amount for now 
      
      accountBalance = Math.round((nearlib.utils.format.formatNearAmount(sender._state.amount) - tokenAmount) * 100) / 100;
      console.log((nearlib.utils.format.formatNearAmount(sender._state.amount) - tokenAmount) );
      console.log(accountBalance);

      // print out the results
      console.log("transaction id", final.transaction_outcome.id)
      console.log("gas used", final.transaction_outcome.outcome.gas_burnt)
      console.log("success!")
      alert('success!');

      submitMessage(accountBalance);
    } catch (error) {
      console.warn(error.type, error.message)
    }

  // })
  // transactionSaved = await contract.getMessages();
  // // update the table afte transaction completed 
  // rows = transactionSaved;
}



async function requestToken() {
    console.log('click to request transaction');
    let requestAccount = document.getElementById('request-account').value;
    let amount_to_send = 0;

    let user_account_privateKey = "ed25519:fm46Vy8oggt9qLqUze5R7DDiKm99eHCwaYFyhRa3UZsA83R8oTzWYotw66RQXzJ2Arz44KY5zxBwuuY6aqQUJS5"
    let the_user_account = window.accountId;

    window.localStorage.setItem(`nearlib:keystore:${the_user_account}:default`, user_account_privateKey)
    let near = await nearlib.connect(Object.assign({ deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() } }, window.nearConfig));
    let sender = await near.account(accountId);

    try {
      let final = await sender.sendMoney(requestAccount, amount_to_send);
      console.log(final);

      alert('success!');
      postRequestMessage();
    } catch (error) {
      console.warn(error.type, error.message)
    }
}


function postRequestMessage() {
  let receiver = $('#request-account').val();
  let amount = '0';
  let text = 'Request token amount: ' + $('#request-amount').val();
  let datetime = moment().format('MMMM Do YYYY, h:mm:ss a'); 
  let type = 'Request Token';

  let balance = '';

  $('#text-message').val('');
  contract.addMessage({ text, amount, receiver, datetime, balance, type })
    .then(() => {
      setTimeout(() => {
      }, 1000);
    })
    .catch(console.error);
}


function submitMessage(accountBalance) {
  let receiver = $('#transaction-account').val();
  let amount = $('#transaction-amount').val();
  let text = $('#transaction-note').val();
  let datetime = moment().format('MMMM Do YYYY, h:mm:ss a'); 
  let type = typeOfTransaction;

  console.log(accountBalance);
  console.log(type);
  let balance = '' + accountBalance;
  console.log(typeof balance);

  console.log(balance);
  $('#text-message').val('');
  contract.addMessage({ text, amount, receiver, datetime, balance, type })
    .then(() => {
      setTimeout(() => {
      }, 1000);
    })
    .catch(console.error);
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      speech: null
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
  }


  componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn();
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
  }

  async signedInFlow() {
    console.log("come in sign in flow")

    this.setState({
      login: true,
    })
    const accountId = await this.props.wallet.getAccountId()

    let near = await nearlib.connect(Object.assign({ deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() } }, window.nearConfig));
    let sender = await near.account(accountId);

    console.log(accountId);
    let transactionSaved = await contract.getMessages();
    for(const eachTransaction of transactionSaved ){
      if((eachTransaction.sender === accountId || eachTransaction.receiver === accountId) && eachTransaction.type !== 'Request Token' ){
        rows.push(eachTransaction);
      }
      if(eachTransaction.type === 'Request Token' && eachTransaction.receiver === accountId){
        requestAlert = true;
        requestSender = eachTransaction.sender;
        requestAmount = eachTransaction.text;
      }
    }
    console.log(rows);

    accountBalance = Math.round(nearlib.utils.format.formatNearAmount(sender._state.amount) * 100) / 100;
    console.log(accountBalance);
    // let accountDetails = await sender.getAccountDetails(); // get authorizedApps: [], transactions: [] can add later 

    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    this.props.contract.welcome({ account_id: accountId }).then(response => this.setState({ speech: response.text }))

    // -------------------------------------------------------------------
    // Displaying the signed in flow container.
    Array.from(document.querySelectorAll('.signed-in')).forEach(el => el.style.display = '');
  }


  async requestSignIn() {
    const appTitle = 'NEAR React template';
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    )
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
    console.log("after sign out", this.props.wallet.isSignedIn())
  }

  signedOutFlow() {
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    this.setState({
      login: false,
      speech: null
    })
  }

  render() {
    let style = {
      fontSize: "2rem",
      color: "#bbbbbb",
      textShadow: "#eeeeee 1px 5px",
      textTransform: "uppercase",
      fontWeight: "bold",
    }

    return (
      <div className="App-header">
        <div className="header-row">
          <img className="logo" src={nearlogo} alt="NEAR logo" />

          {this.state.login ? <button className="login-btn" onClick={this.requestSignOut}>Log out</button>
            : <button  className="login-btn" onClick={this.requestSignIn}>Log in with NEAR</button>}
          
          <RequestTokenNotificationModal />
          
          <DropdownButton id="dropdown-settings-button" title="Settings" className="action-btn">
            <Dropdown.Item href="#/action-1">
              <TransferTokenModal />
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2">
              <RequestTokenModal />
            </Dropdown.Item>
            <Dropdown.Item href="#/action-3"> <ViewAnalysis /></Dropdown.Item>
          </DropdownButton>

          <DropdownButton id="dropdown-basic-button" title="Action" className="action-btn">
            <Dropdown.Item href="#/action-1">
              <TransferTokenModal />
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2">
              <RequestTokenModal />
            </Dropdown.Item>
            <Dropdown.Item href="#/action-3"> <ViewAnalysis /></Dropdown.Item>
          </DropdownButton>
        </div>

        <div className="image-wrapper">
          {/* <p><span role="img" aria-label="fish">🐟</span> NEAR protocol is a new blockchain focused on developer productivity and useability!<span role="img" aria-label="fish">🐟</span></p> */}
          {/* <p><span role="img" aria-label="chain">⛓</span> This little react app is connected to blockchain right now. <span role="img" aria-label="chain">⛓</span></p> */}
          <p style={style}>{this.state.speech}</p>
          <p id="account-balance-statement"> Current Account Balance: {accountBalance}</p>
        </div>

        <div className="table">
          <TableContainer component={Paper}>
            <Table className="table" aria-label="simple table">
              <TableHead className="table-header">
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Sender</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Receiver</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={Math.random()}>
                    {/* <TableRow key={row.datetime} */}
                    {/* change the unique key to the transaction id/date later  */}
                    <TableCell component="th" scope="row">
                      {row.datetime}
                    </TableCell>
                    <TableCell align="right">{row.sender}</TableCell>
                    <TableCell align="right">{row.text}</TableCell>
                    <TableCell align="right">{row.receiver}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.type}</TableCell>
                    <TableCell align="right">{row.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    )
  }

}

export default App;
