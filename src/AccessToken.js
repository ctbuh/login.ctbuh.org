function at(vals) {

    this.access_token = null;
    this.refresh_token = null;
    this.sfdc_community_url = null;
    this.sfdc_community_id = null;
    this.state = null;
    this.signature = null;
    this.scope = null;
    this.instance_url = null;
    this.id = null;
    this.id_token = null;
    this.token_type = null;
    this.issued_at = null;

    if (typeof vals === 'object') {

        let self = this;

        Object.keys(vals).forEach(function (key, index) {

            if(self.hasOwnProperty(key)){
                self[key] = vals[key];
            }

        });

    }
}

module.exports = at;
