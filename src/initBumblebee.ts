// eslint-disable-next-line import/first
import BumbleBee from "bumblebee-hotword";

const bumblebee = new BumbleBee();

bumblebee.setWorkersPath(`./bumblebee-workers`);
// add hotword to bumblebee
bumblebee.addHotword("hey_edison");
// set the hotword to 'bumblebee'
bumblebee.setHotword("hey_edison");

console.debug("initializing bumblebee");

export default bumblebee;
