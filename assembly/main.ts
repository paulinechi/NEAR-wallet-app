//@nearfile
import { context, storage, logging, runtime_api, PersistentVector, PersistentMap, collections } from "near-runtime-ts";
// import transfer from "transcation";
// --- contract code goes below;
import { PostedMessage, PostedMessageTest, MessageArray } from "./model";
// import {collections} from 'near';


// It's good to use common constant, but not required.
const LAST_SENDER_KEY = "last_sender";
const MESSAGE_LIMIT = 10;

// let balances = collections.map<string, u64>("b");


const messages = new PersistentVector<PostedMessage>("m");
// const messages_test = new Array<PostedMessageTest>("t");


// let balances = storage.set<string>("b");
  // storage.setBytes(getGameKey(gameId), game.encode());


// Adds a new message under the name of the sender's account id.
// NOTE: This is a change method. Which means it will modify the state.
// But right now we don't distinguish them with annotations yet.
// export function addMessage(receiver: string, amount: string, text: string): void {
export function addMessage(text: string, amount: string, receiver: string): void {
  // Creating a new message and populating fields with our data
  const message: PostedMessage = {
    sender: context.sender,
    receiver: receiver,
    amount: amount,
    text: text // note, add special type later 
  };


  // Adding the message to end of the the persistent collection
  messages.push(message);
  // let balances = storage.set<string, u64>("b");
  // balances.set('message1', messages);
  // logging.log(typeof messages);

  // if(messages !== null){
  // storage.set<PersistentVector<PostedMessage>>('message', messages);

  // storage.set<Array<string>>('message_test', ['nihao', 'nihao2']);

  // }

}


// Returns an array of last N messages.
// NOTE: This is a view method. Which means it should NOT modify the state.
export function getMessages(): PostedMessage[] {
  // logging.log(messages[messages.length-1].text);
  // logging.log(messages[messages.length-1].receiver);
  // logging.log(messages[messages.length-1].amount);
  //  logging.log(messages[9]. );
  const numMessages = min(MESSAGE_LIMIT, messages.length);


  // let messages = storage.get('message');
  // let messagesOnBC = storage.getSome<PersistentVector<PostedMessage>>('message');
   
  
  // let messagesOnBC = balances.get('message_test');

  // return messagesOnBC;

  // const numMessages = min(1, messages.length);
  // const startIndex = messages.length - numMessages;
  // const result = new Array<PostedMessage>(numMessages);
  // for (let i = 0; i < numMessages; i++) {
  //   result[i] = messages[i + startIndex];
  // }
  // return result;



  // const numMessages = min(1, messagesOnBC.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<PostedMessage>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
    // logging.log(result[i].receiver);
    // logging.log(result[i].amount);

  }
  return result;
}









// This is our change method. It modifies the state of the contract by
// storing the account_id of the sender under the key "last_sender" on the blockchain
export function sayHi(): void {
  logging.log('hiiii');
  logging.log( runtime_api.block_index().toString() ); 
  logging.log( runtime_api.storage_iter_range(10,81300,10,81400).toString() ); 



  // context.sender is the account_id of the user who sent this call to the contract
  // It's provided by the Blockchain runtime. For now we just store it in a local variable.
  let sender = context.sender;
  // `near` class contains some helper functions, e.g. logging.
  // Logs are not persistently stored on the blockchain, but produced by the blockchain runtime.
  // It's helpful to use logs for debugging your functions or when you need to get some info
  // from the change methods (since change methods don't return values to the front-end).
  logging.log(sender + " says \"Hi!\"");
  // storage is a helper class that allows contracts to modify the persistent state
  // and read from it. setString allows you to persitently store a string value for a given string key.
  // We'll store the last sender of this contract who called this method.
  storage.setString(LAST_SENDER_KEY, sender);
}

// This is our view method. It returns the last account_id of a sender who called `sayHi`.
// It reads value from the persistent store under the key "last_sender" and returns it.
export function whoSaidHi(): string | null {
  // getString returns a string value for a given string key.
  logging.log('hiiii');
  logging.log( runtime_api.block_index().toString() ); 

  return storage.getString(LAST_SENDER_KEY);
}
