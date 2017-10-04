debugger
var ids = {
  facebook: {
    clientID: '1976614272625790',
    clientSecret: '8d0c6db644a9afe5619efaf89d9b6c7b',
    callbackURL: "http://localhost:8000/auth/facebook/callback"
  },
  linkedin: {
    clientID: '81lv7ic9frlmtr',
    clientSecret: 'abs2l0M8tdBkgAjl',
    callbackURL: "http://localhost:8000/auth/linkedin/callback"
  },
  twitter: {
    consumerKey: 'EEvTaiajudSrBrDiD8mrqc6AJ',
    consumerSecret: '3G4JRstjNpuKNg2erNUGsLSEyKtkaWOEr0xPJ8MCtysvNM1icv',
    callbackURL: "http://localhost:8000/auth/twitter/callback"
  }
};

module.exports = ids;
