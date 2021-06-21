// https://datatracker.ietf.org/doc/html/rfc7662#section-2.2

export class IntrospectionResponse {

    public active: boolean = true;
    public scope: string = '';

    public client_id: string = '';
    public username: string = '';
    public sub: string = '';
    public token_type: string = '';

    public exp: number = 0;
    public iat: number = 0;
    public nbf: number = 0;
}