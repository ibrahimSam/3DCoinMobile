export class Contacts {
    public createdOn: number;
    public pubkey: string;
    public label: string;
    public tel: string;
    public email: string;

  constructor() {}

  public create(opts?): Contacts {
    opts = opts ? opts : {};
    let x = new Contacts();
    x.createdOn = Date.now();
    x.pubkey = opts.pubkey;
    x.tel = opts.tel || '';
    x.email = opts.email || '';

    return x;
  }

  public fromObj(obj): Contacts {
    let x = new Contacts();
    x.createdOn = obj.createdOn;
    x.pubkey = obj.pubkey;
    x.tel = obj.tel || '';
    x.email = obj.email || '';

    return x;
  }

  public fromString(str: string): Contacts {
    return this.fromObj(JSON.parse(str));
  }

  public toObj(): string {
    return JSON.stringify(this);
  }
}
