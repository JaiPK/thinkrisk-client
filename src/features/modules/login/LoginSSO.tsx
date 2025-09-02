import queryString from 'query-string';

const authority = process.env.REACT_APP_SSO_AUTHORIZE_URL;
const client_id = process.env.REACT_APP_SSO_CLIENT_ID;
const redirect_uri = process.env.REACT_APP_REDIRECT_URL; 

const response_type = 'id_token token'; 

const scope = 'openid';
const prompt = "login";
export const beginAuth = ({ state, nonce } : any) => {
  const params = queryString.stringify({
    client_id,
    redirect_uri,
    response_type,
    scope,
    prompt,
    state,
    nonce,
  });
  const authUrl = `${authority}?${params}`;
  window.location.assign(authUrl);
};
