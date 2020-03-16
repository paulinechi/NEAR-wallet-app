import { context, logging, storage, runtime_api, PersistentVector, PersistentMap, collections  } from "near-runtime-ts";
// available class: near, context, storage, logging, base58, base64,
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math
import { TextMessage } from "./model";
import { PostedMessage, PostedMessageTest, MessageArray } from "./model";

const DEFAULT_MESSAGE = "WELCOME"
const LAST_SENDER_KEY = "last_sender"; // not used
const MESSAGE_LIMIT = 10; // change this after we have proper pagination
const messages = new PersistentVector<PostedMessage>("m");


export function welcome(account_id: string): TextMessage {
  logging.log("simple welcome test");
  let message = new TextMessage();
  let greetingPrefix = storage.get<String>(account_id);
  if (!greetingPrefix) {
    greetingPrefix = DEFAULT_MESSAGE;
  }
  const s = printString(account_id);
  message.text = greetingPrefix + " " + s;
  return message;
}

export function setGreeting(message: string): void {
  storage.set<String>(context.sender, message);
}

function printString(s: string): string {
  return s;
}


// ------------------------- old function from Near wallet ----------------
export function addMessage(text: string, amount: string, receiver: string, datetime: string, balance: string, type: string): void {
  // Creating a new message and populating fields with our data
  const message: PostedMessage = {
    sender: context.sender,
    receiver: receiver,
    amount: amount,
    text: text,
    datetime: datetime,
    balance: balance,
    type: type
  };

  // Adding the message to end of the the persistent collection
  messages.push(message);
}


// Returns an array of last N messages.
// NOTE: This is a view method. Which means it should NOT modify the state.
export function getMessages(): PostedMessage[] {
  // const numMessages = min(MESSAGE_LIMIT, messages.length);
  const numMessages = messages.length;

  const startIndex = messages.length - numMessages;
  const result = new Array<PostedMessage>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}
