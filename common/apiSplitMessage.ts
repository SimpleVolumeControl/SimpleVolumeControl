import ApiMessage from './apiMessage';

const splitMessage = (message: string): ApiMessage => {
  const colonIndex = message.indexOf(':');
  const code = message.slice(0, colonIndex + 1);
  const content = message.slice(colonIndex + 1);
  return { code, content };
};

export default splitMessage;
