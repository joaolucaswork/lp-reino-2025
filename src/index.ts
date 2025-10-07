import { initCardInfoMapper } from '$utils/card-info-mapper';
import { initCardUpdates } from '$utils/card-updater';
import { greetUser } from '$utils/greet';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'John Doe';
  greetUser(name);

  // Initialize card info mapper and start updates
  const cardMapper = initCardInfoMapper();
  initCardUpdates(cardMapper, 3000);
});
