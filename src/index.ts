import { initCardColorSwitcher } from '$utils/card-color-switcher';
import { initCardInfoMapper } from '$utils/card-info-mapper';
import { initCardUpdates } from '$utils/card-updater';
import { greetUser } from '$utils/greet';
import { initLogoCardToggle } from '$utils/logo-card-toggle';
import { initProfileCardTilt } from '$utils/profile-card-tilt';
import { initProfileCardToggle } from '$utils/profile-card-toggle';
import { initSVGIllustration } from '$utils/svg-illustration-generator';
import { initSwiperController } from '$utils/swiper-controller';
import { initTypebotEmailHandler } from '$utils/typebot-email-handler';
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

  // Initialize Typebot email handler
  // This will listen for email completion and trigger card rotation animation
  initTypebotEmailHandler({
    profileCardSelector: '.profile-card_wrapper',
    frontElementsSelector: '.front-elements',
    rotationElementsSelector: '.rotation-elements',
    emailSelector: '[card-info="email"]',
    phoneSelector: '[card-info="telefone"]',
    activeFillClass: 'active_fill',
    rotateClass: 'rotate',
    activeClass: 'active',
    debug: true, // Enable debug logging in development
  });

  // Initialize logo card toggle
  // This will allow users to toggle card rotation by clicking the Reino Capital logo
  initLogoCardToggle({
    logoSelector: '.logo_card',
    debug: true, // Enable debug logging in development
  });

  // Initialize Swiper controller
  // This will handle vertical slide transitions when Typebot form is completed
  initSwiperController({
    containerSelector: '.swiper.is-landingpage',
    direction: 'vertical',
    slidesPerView: 1,
    allowTouchMove: false, // Disable user control
    speed: 600, // Minimal transition effect
    transitionDelay: 500, // Small delay for smoother experience
    debug: true, // Enable debug logging in development
  });

  // Initialize SVG illustrations
  // This will replace illustration divs with dynamic SVG shapes
  initSVGIllustration({
    debug: true, // Enable debug logging in development
  });

  // Initialize profile card tilt effect with glare/shine
  // This will add a 3D tilt effect to the main profile card that follows mouse movement
  // The glare effect creates a reflective highlight that moves across the card
  initProfileCardTilt({
    max: 15, // Subtle tilt rotation (15 degrees max)
    speed: 400, // Smooth transition speed
    glare: true, // Enable shine/glare effect
    maxGlare: 0.2, // Subtle shine opacity (20%) - Material Design inspired
    scale: 1.02, // Slight scale on hover for depth
    debug: true, // Enable debug logging in development
  });

  // Initialize card color switcher
  // This will allow users to cycle through investment category color themes
  // by clicking the visual block element (mini card)
  initCardColorSwitcher({
    debug: true, // Enable debug logging in development
  });
});
