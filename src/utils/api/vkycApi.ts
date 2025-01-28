// VKYC API calls

export const getToken = async () => {
  if (!process.env.REACT_APP_TOKEN_ENDPOINT) {
    throw new Error('REACT_APP_TOKEN_ENDPOINT is not defined');
  }
  const response = await fetch(process.env.REACT_APP_TOKEN_ENDPOINT);
  const data = await response.json();
  return data.token;
};
