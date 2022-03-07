/**
 * Represents the parts of an API message.
 * Every API message consists of an API code that identifies the message type
 * and the actual content.
 */
interface ApiMessage {
  code: string;
  content: string;
}

export default ApiMessage;
