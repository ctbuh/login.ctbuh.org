## login.ctbuh.org

check if `sso_uid` exists:

if YES:
 - redirect to `?next.domain/initiate_sso_auth/` with params:
    - sso_uid
    - next - where to redirect after auth stored
 
if NO:
 - redirect to salesforce login with
    
    WHEN success:  
        - redirect to login.ctbuh.org/callback?code=SALESFORCE_AUTH_CODE 
        which will store new session credentials in DB under some unique KEY


## Other endpoints:

- /logout
- /register???

- /sso/unison_request returns either: 
`Chorus.ssoLogin = "/sso/unison_complete_request?auto_login_token={token}";`

or: `Chorus.ssoLogin = false;`
    
local endpoint to query to set proper cookies

## query data

- POST /auth/info `sso_uid` returns all info about that particular session

- GET /auth/info ^ same as above when used for ajax. With CORS + JsonP



> You can use username/password authentication for Salesforce, it is correct, 
>but if you would like the session to be persistent, 
>it is recommended to use refresh tokens. 
>The refresh token is returned in OAuth2 web server flow in Salesforce, 
>so you should implement it. 
>The session refresh is automatically done by JSforce if refresh token is applied, 
>so you do not have to care about the session invalidation.
>

