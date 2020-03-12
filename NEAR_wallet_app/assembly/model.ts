//@nearfile
import { context, storage, logging, runtime_api, PersistentVector } from "near-runtime-ts";

export class TextMessage {
    text: string;
}

// ---------------------------------------
export class PostedMessage {
  sender: string;
  receiver: string;
  amount: string;
  text: string;
  datetime: string;
  balance: string;
  type: string;
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