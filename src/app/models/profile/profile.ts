

export interface hdwalletI {
  address : string,
  wif : string,
  childIndex : number
}
export class Profile {
    public createdOn: number;
    public seed: string;
    public privkey: string;
    public pubkey = [];
    public tel: string;
    public email: string;
    public hashedPin : string;
    public onboardingCompleted: boolean;
    public selectedPubKey : number;
    public lockType : string;

    // xpriv,xpub
    public masterPrivKey: string;
    public hdWallet : [hdwalletI]


  constructor() {}

  public create(opts?): Profile {
    opts = opts ? opts : {};
    let x = new Profile();
    x.createdOn = Date.now();
    x.seed = opts.seed;
    x.privkey = opts.privkey;
    x.pubkey.push(opts.pubkey);
    x.tel = opts.tel || '';
    x.email = opts.email || '';
    x.onboardingCompleted = false;
    x.masterPrivKey = opts.masterPrivKey;
    x.hdWallet = (opts.hdWallet);
    return x;
  }

  public fromObj(obj): Profile {
    let x = new Profile();

    x.createdOn = obj.createdOn;
    x.seed = obj.seed;
    x.privkey = obj.privkey;
    x.pubkey = obj.pubkey;
    x.onboardingCompleted = obj.onboardingCompleted;
    x.tel = obj.tel || '';
    x.email = obj.email || '';

    return x;
  }

  public fromString(str: string): Profile {
    return this.fromObj(JSON.parse(str));
  }

  public toObj(): string {
    return JSON.stringify(this);
  }
}
