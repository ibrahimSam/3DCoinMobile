import { Profile } from "./../../models/profile/profile";
import { Contacts } from "./../../models/contacts/contacts";
import { LoggerService } from "./../logger/logger.service";
import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { File } from "@ionic-native/file/ngx";
import { Platform } from "@ionic/angular";
import { FileStorage } from "./storage/file-storage";

interface Storage {
  get(k: string): Promise<any>;
  set(k: string, v): Promise<void>;
  remove(k: string): Promise<void>;
  create(k: string, v): Promise<void>;
}

const Keys = {
  PROFILE: "profile",
  CONTACT: "contact"
};

@Injectable({
  providedIn: "root"
})
export class PersistanceService {
  public storage: Storage;

  constructor(
    private file: File,
    private pltf: Platform,
    private logger: LoggerService
  ) {
    this.storage = new FileStorage(this.file, this.logger);
  }

  storeNewProfile(profile): Promise<void> {
    return this.storage.create(Keys.PROFILE, profile);
  }

  storeProfile(profile): Promise<void> {
    return this.storage.set(Keys.PROFILE, profile);
  }

  getProfile(): Promise<Profile> {
    return new Promise(resolve => {
      this.storage.get(Keys.PROFILE).then(profile => {
        resolve(profile);
      });
    });
  }

  deleteProfile() {
    return this.storage.remove(Keys.PROFILE);
  }

  setPK(encryptedPK) {
    this.getProfile().then(profile => {
      profile.privkey = encryptedPK;
      this.storeProfile(profile);
    });
  }

  storeNewContact(contact): Promise<void> {
    return this.storage.create(Keys.CONTACT, contact);
  }

  storeContact(contact): Promise<void> {
    this.getContact().then(contacts => {
      contacts.push(contact);
      this.storage.set(Keys.CONTACT, contacts);
    });
    return;
  }

  getContact(): Promise<Contacts[]> {
    return new Promise(resolve => {
      this.storage.get(Keys.CONTACT).then(contact => {
        resolve(contact);
      });
    });
  }

  deleteContact(contact) {
    return new Promise(resolve => {
      this.getContact().then(contacts => {
        for (var i = 0; i < contacts.length; i++) {
          if (contacts[i].pubkey == contact.pubkey) {
            contacts.splice(i, 1);
          }
        }
        this.storeNewContact(contacts);
        resolve(contacts);
      });
    });
  }
}
