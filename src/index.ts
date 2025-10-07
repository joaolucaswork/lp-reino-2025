import { initCardInfoMapper } from '$utils/card-info-mapper';
import { initCardUpdates } from '$utils/card-updater';
import { greetUser } from '$utils/greet';
import { initProfileCardToggle } from '$utils/profile-card-toggle';
import { initTypebotNameReplacer } from '$utils/typebot-name-replacer';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'John Doe';
  greetUser(name);

  // Initialize card info mapper and start updates
  const cardMapper = initCardInfoMapper();
  initCardUpdates(cardMapper, 3000);

  // Initialize profile card toggle interactions
  initProfileCardToggle();

  // Initialize Typebot name replacer
  // This will listen for Typebot events and replace asterisks with the user's name
  initTypebotNameReplacer({
    targetSelector: '[card-info="name"]',
    debug: true, // Enable debug logging in development
  });
});
