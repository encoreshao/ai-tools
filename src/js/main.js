// Entry point: loaded by index.html as <script type="module">.
import { initDirectory } from './render.js';
import { initHero } from './hero.js';
import { initOrbit } from './orbit.js';
import { initSky } from './sky.js';
import { initMarquee, initTilt } from './effects.js';

initDirectory();
initHero();
initMarquee();
initOrbit();
initSky();
initTilt();
