import Immutable from '../node_modules/immutable/dist/immutable.js';

class aataStorage {
  constructor() {
    this.links = Immutable.List([]);
    this.linksData = Immutable.List([]);
    this.items = Immutable.Map({});
  }
  setLink(link, val) {
    this.linksData = this.items.set(Immutable.hash(link), val);
  }
  isLinkInStore(link) {
    return this.links.indexOf(Immutable.hash(link));
  }
  getLink(link) {
    let index = this.isLinkInStore(link);
    return (index === -1) ? false : this.linksData.get(index);
  }
  getItem(key) {
    return this.items.get(key);
  }
  setItem(key, val) {
    this.items = this.items.set(key, val);
  }
}
export default function aataCache() {
  if (localStorage) {
    let aataStore = localStorage.getItem('aataStore');

    if (aataStore == null) {
      aataStore = new aataStorage();
      localStorage.setItem('aataStore', aataStore);
    }
    return aataStore;
  }
  return false;
}