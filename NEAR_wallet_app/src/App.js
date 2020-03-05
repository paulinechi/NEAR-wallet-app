import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import logo from './assets/logo.svg';
import nearlogo from './assets/gray_near_logo.svg';
import near from './assets/near.svg';
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
import $ from 'jquery';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(date, description, receiver, amount, balance) {
  return { date, description, receiver, amount, balance };
}

let rows = [];


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
    this.submitMessage = this.submitMessage.bind(this);
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
    let transactionSaved = await contract.getMessages();
    rows = transactionSaved;
    console.log(rows);

    // console.log(this.messages);
    this.setState({
      login: true,
    })
    const accountId = await this.props.wallet.getAccountId()
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    this.props.contract.welcome({ account_id: accountId }).then(response => this.setState({ speech: response.text }))

    // -------------------------------------------------------------------
    $('#new-transaction').click(this.submitMessage);


    // Displaying the signed in flow container.
    Array.from(document.querySelectorAll('.signed-in')).forEach(el => el.style.display = '');

    // Displaying current account name.
    // document.getElementById('account-id').innerText = window.accountId;
    document.getElementById('new-transaction').addEventListener('click', async () => {
      console.log('click to submit transaction');
      let receiver = document.getElementById('transaction-account').value;
      let tokenAmount = document.getElementById('transaction-amount').value;
      let amount_to_send = nearlib.utils.format.parseNearAmount(tokenAmount);

      // find a way to store this automatically for each new user ******
      // also located in the /neardev/default/{accountId}.json folder
      let user_account_privateKey = "ed25519:Ng6Y3w2oyPP8SQhrnQqWrRntL8qwSkn4JZwTmdVTt7N8LnwY2bbx3FCCwV26hnNfXv9D1TgFUmTd5a9pQkUbbWb"
      let the_user_account = window.accountId;

      window.localStorage.setItem(`nearlib:keystore:${the_user_account}:default`, user_account_privateKey)
      let near = await nearlib.connect(Object.assign({ deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() } }, window.nearConfig));

      try {
        let sender = await near.account(accountId);
        console.log(sender);

        let final = await sender.sendMoney(receiver, amount_to_send);
        console.log(final);

        // print out the results
        console.log("transaction id", final.transaction_outcome.id)
        console.log("gas used", final.transaction_outcome.outcome.gas_burnt)
        let note = 'transaction note';

        contract.addMessage({ note })
          .then(() => {
            setTimeout(() => {
            }, 1000);
          })
          .catch(console.error);

        console.log("success!")
        alert('success!');
      } catch (error) {
        console.warn(error.type, error.message)
      }
    })
    transactionSaved = await contract.getMessages();
    // update the table afte transaction completed 
    this.rows = transactionSaved;
  }

  async requestSignIn() {
    const appTitle = 'NEAR React template';
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    )
  }

  // -------------------------------------------------------------
  // use this function to replace other submit message code 
  submitMessage() {
    let receiver = $('#transaction-account').val();
    let amount = $('#transaction-amount').val();
    let text = $('#transaction-note').val();

    $('#text-message').val('');
    contract.addMessage({ text, amount, receiver })
      .then(() => {
        setTimeout(() => {
        }, 1000);
      })
      .catch(console.error);

    let messagesSaved = contract.getMessages();
    console.log(messagesSaved);
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
      fontSize: "1.5rem",
      color: "#0072CE",
      textShadow: "1px 1px #D1CCBD"
    }

    return (
      <div className="App-header">
        <div className="image-wrapper">
          <img className="logo" src={nearlogo} alt="NEAR logo" />
          {/* <p><span role="img" aria-label="fish">🐟</span> NEAR protocol is a new blockchain focused on developer productivity and useability!<span role="img" aria-label="fish">🐟</span></p> */}
          {/* <p><span role="img" aria-label="chain">⛓</span> This little react app is connected to blockchain right now. <span role="img" aria-label="chain">⛓</span></p> */}
          <p style={style}>{this.state.speech}</p>
        </div>
        <div>
          {this.state.login ? <button onClick={this.requestSignOut}>Log out</button>
            : <button onClick={this.requestSignIn}>Log in with NEAR</button>}
        </div>


        <div>
          <p> Easy Transfer </p>
          <input type="text" placeholder="account" id='transaction-account' />
          <input type="number" placeholder="number of token" id='transaction-amount' />
          <input type="text" placeholder="note" id='transaction-note' />
          <button id="new-transaction"> submit </button>
        </div>

        <div className="table">
          <TableContainer component={Paper}>
            <Table className="table" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Sender</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Receiver</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={Math.random()}>
                    {/* change the unique key to the transaction id/date later  */}
                    <TableCell component="th" scope="row">
                      {row.date}
                    </TableCell>
                    <TableCell align="right">{row.sender}</TableCell>
                    <TableCell align="right">{row.text}</TableCell>
                    <TableCell align="right">{row.receiver}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div>
          {/* <div className="logo-wrapper">
            <img src={near} className="App-logo margin-logo" alt="logo" />
            <img src={logo} className="App-logo" alt="logo" />
          </div> */}
          <p>
            {/* Edit <code>src/App.js</code> and save to reload. */}
          </p>
          {/* <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
          {/* <p><span role="img" aria-label="net">🕸</span> <a className="App-link" href="https://nearprotocol.com">NEAR Website</a> <span role="img" aria-label="net">🕸</span> */}
          {/* </p> */}
          {/* <p><span role="img" aria-label="book">📚</span><a className="App-link" href="https://docs.nearprotocol.com"> Learn from NEAR Documentation</a> <span role="img" aria-label="book">📚</span> */}
          {/* </p> */}
        </div>
      </div>
    )
  }

}

export default App;
