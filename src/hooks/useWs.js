const useWs = (endpoint, { onOpen, onClose, onError, onMessage }) => {
  const ws = new WebSocket(endpoint);

  console.log('onOpen ->', onOpen);

  ws.addEventListener('open', onOpen);
  ws.addEventListener('close', onClose);
  ws.addEventListener('message', onMessage);
  ws.addEventListener('error', onError);

  return { ws };
};

export default useWs;
