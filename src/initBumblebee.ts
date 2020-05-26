import BumbleBee from 'bumblebee-hotword';

const bumblebee = new BumbleBee();

bumblebee.setWorkersPath('/bumblebee-workers')
// add hotword to bumblebee
bumblebee.addHotword('bumblebee');
// set the hotword to 'bumblebee'
bumblebee.setHotword('bumblebee');

export default bumblebee;