import { context, storage, logging, runtime_api, PersistentVector } from "near-runtime-ts";

//@nearfile
// TODO: Define data model here
export class PostedMessage {
  sender: string;
  receiver: string;
  amount: string;
  text: string;
}


export class PostedMessageTest {
  sender: string;
  // receiver: string;
  // amount: string;
  text: string;
}

export class MessageArray {
  messageList: PersistentVector<PostedMessageTest>;
}