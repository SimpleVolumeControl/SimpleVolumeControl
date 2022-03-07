import ApiMessage from './apiMessage';

/**
 * Splits an API message in its parts.
 * Everything up to the first colon is considered as API code, the rest as content.
 * @param message The message to be split.
 */
const splitMessage = (message: string): ApiMessage => {
  const colonIndex = message.indexOf(':');
  const code = message.slice(0, colonIndex + 1);
  const content = message.slice(colonIndex + 1);
  return { code, content };
};

export default splitMessage;
