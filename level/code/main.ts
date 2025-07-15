import * as host from "@gl/api/w2h/host";

import { ColorMatrixFilter } from "@gl/filters/colormatrix";
import { String } from "@gl/types/i18n";
import { getSunEventName, SunEvent } from "@gl/types/time";
import { Vec2 } from "@gl/utils/la/vec2";
import { PlayerMovement } from "@gl/utils/movement/topdown";
import { SnowParticles } from "@gl/utils/particles";
import { Player } from "@gl/utils/player";
import * as dialogue from "./generated/dialogue";

export { initAsyncStack } from "@gl/utils/asyncify";
export { card } from "./card";
export { entrances, exits } from "./gateways";
export { choiceMadeEvent } from "./generated/dialogue";
export { grantedMarkers, usedMarkers } from "./markers";
export { pickups } from "./pickups";

const log = host.debug.log;

let player!: Player;
let tsfid!: i32;
let snow!: SnowParticles;
let fog!: ColorMatrixFilter;
let snowstorm!: i32;
let ambientMusic!: i32;
let racingMusic!: i32;
let failSound!: i32;
let winSound!: i32;
let gifts: u32 = 0;
const totalGifts: u32 = 8;
let isRacing: bool = false;
let raceTime: i32 = 50; // seconds
let raceTimeMobile: i32 = 65; // seconds

// Modulate filter.overlay with a random amount, smoothly
function modulateFog(speed: f32, min: f32, max: f32): void {
  const now: f64 = ((Date.now() as f64) / 1000.0) * speed;

  // Use a combination of trig functions for a semi-random modulation
  const value: f64 =
    (Math.sin(now) +
      Math.cos(now * 1.33) +
      Math.sin(now * 0.77 + Math.PI / 4)) /
    3;

  // Map the value from [-1, 1] to [0, 1]
  const amt = (value + 1.0) / 2.0;
  const fogAmt = (min + amt * (max - min)) as f32;

  // fog.overlay(fogAmt, fogAmt, fogAmt);
}

export function initRoom(): void {
  const pos = host.map.loadEntryPosition();
  player = new Player(
    new PlayerMovement(
      pos.toVec2(), // Initial position
      new Vec2(200, 200), // Impulse
      Vec2.fromMagnitude(100), // Max velocity
      50 // mass
    )
  );

  fog = new ColorMatrixFilter();
  const fogAmt: f32 = 0.4;
  // fog.overlay(fogAmt, fogAmt, fogAmt);

  snow = new SnowParticles("SnowFlakes.tsj", 0, 2000);
  const baseWind = new Vec2(30, 10);
  const maxSize: f32 = 0.5;
  for (let i: u32 = 0; i < snow.num; i++) {
    const amt: f32 = Math.pow((i as f32) / (snow.num as f32), 5) as f32;
    const size: f32 = 0.35 + amt * maxSize;
    snow.updateScale(i, size, size);
    snow.winds[i] = baseWind.scaled(1 + amt * 10);
  }

  tsfid = host.filters.addTiltShift(0.2);

  snowstorm = host.sound.loadSound({
    name: "snowstorm-looped",
    loop: true,
    autoplay: true,
    volume: 0.5,
    sprites: [],
  });
  ambientMusic = host.sound.loadSound({
    name: "Musics/Sketchbook 2024-09-22",
    loop: true,
    autoplay: true,
    volume: 0.3,
    sprites: [],
  });
  racingMusic = host.sound.loadSound({
    name: "restricted/racing-music",
    loop: true,
    autoplay: false,
    volume: 0.5,
    sprites: [],
  });
  failSound = host.sound.loadSound({
    name: "gl:fail",
    loop: false,
    autoplay: false,
    volume: 1.5,
    sprites: [],
  });
  winSound = host.sound.loadSound({
    name: "gl:success",
    loop: false,
    autoplay: false,
    volume: 1.5,
    sprites: [],
  });

  host.time.setSunTime(Date.now());
  resetGifts();

  // Tick for about a second so it doesn't start with the snow clumped together
  for (let i: u32 = 0; i < 120; i++) {
    snow.tick((1000 / 60.0) as f32);
  }

  // It's harder to do on mobile
  if (host.platform.isMobile()) {
    raceTime = raceTimeMobile;
  }
  dialogue.state.raceTime = raceTime;
}

export function strings(): String[] {
  const ourStrings: String[] = [
    { key: "nap", values: [{ text: "Take a nap", lang: "en" }] },
    { key: "craster-sign", values: [{ text: "Craster's sign", lang: "en" }] },
  ];
  const dialogueStrings = dialogue.strings();
  return ourStrings.concat(dialogueStrings);
}

export function movePlayer(x: f32, y: f32): void {
  player.direction.x = x;
  player.direction.y = y;
}

export function timerEvent(id: u32): void {
  log(`Timer event: ${id}`);
}

// Called when an async asset has been loaded
export function assetLoadedEvent(_id: i32): void {}

export function asyncEvent(id: i32): void {}

export function pickupEvent(slug: string, took: bool): void {
  log(`Pickup event: ${slug}, ${took}`);
}

export function buttonPressEvent(slug: string, down: bool): void {
  log(`Button event: ${slug}, ${down}`);

  // If our dialogue was staged via a `dialogue.stage_<id>` call, then the event
  // may be a press of the "interact" button. This checks for that, and if it
  // is, we'll dispatch to the correct passage.
  if (slug.startsWith("passage/") && down) {
    const passage = slug.split("/")[1];
    dialogue.dispatch(passage);
  } else if (slug === "nap" && down) {
    host.map.exit("nap", false);
  }
}

export function tileCollisionEvent(
  initiator: string,
  tsTileId: i32,
  gid: i32,
  entered: bool,
  column: i32,
  row: i32
): void {
  // log(`Collision event: ${tsTileId}, ${gid}, ${entered} @ ${column}, ${row}`);
}

function setGiftCount(count: u32): void {
  host.ui.setRating(0, 0, count as f32, 8, "gift", "#ff00fb");
}

function failRace(): void {
  endRace();
  host.sound.playSound({ assetId: failSound, spriteId: -1 });
  dialogue.state.lostRace = true;
}

function winRace(): void {
  endRace();
  host.sound.playSound({ assetId: winSound, spriteId: -1 });
  dialogue.state.wonRace = true;
}

function endRace(): void {
  host.ui.clearElement(0, 0);
  host.ui.clearElement(1, 0);
  isRacing = false;
  dialogue.state.racing = false;
  host.sound.stopSound(racingMusic, -1);
  host.sound.playSound({ assetId: ambientMusic, spriteId: -1 });
  gifts = 0;
  resetGifts();
}

function captureGift(sensorName: string): void {
  gifts++;
  setGiftCount(gifts);
  host.sprite.toggleSprite(sensorName, false);
  host.lights.toggleLight(sensorName, false);
  if (gifts >= totalGifts) {
    winRace();
  }
}

function toggleGift(number: u32, enabled: bool): void {
  const giftSensor = `gift/${number}`;
  host.sprite.toggleSprite(giftSensor, enabled);
  host.lights.toggleLight(giftSensor, enabled);
}

function resetGifts(): void {
  for (let i: u32 = 1; i <= totalGifts; i++) {
    toggleGift(i, false);
  }
}

export function startRace(): void {
  host.sound.stopSound(ambientMusic, -1);
  host.sound.playSound({ assetId: racingMusic, spriteId: -1 });
  isRacing = true;
  dialogue.state.racing = true;

  host.ui.setTimer("race", 1, 0, "", raceTime as f32, true, 0, true);
  setGiftCount(0);

  for (let i: u32 = 1; i <= totalGifts; i++) {
    toggleGift(i, true);
  }
}

export function dialogClosedEvent(passageId: string): void {}

export function timerCompletedEvent(name: string): void {
  log(`Timer completed: ${name}`);
  if (name === "race") {
    failRace();
  }
}

export function sensorEvent(
  initiator: string,
  sensorName: string,
  entered: bool
): void {
  log(
    `Sensor event: '${initiator}' ${
      entered ? "entered" : "left"
    } '${sensorName}'`
  );

  if (initiator === "player") {
    if (sensorName.startsWith("gift/") && entered) {
      const giftId = parseInt(sensorName.split("/")[1]);

      if (isRacing) {
        captureGift(sensorName);
      }
    } else if (sensorName === "gnome") {
      dialogue.stage_Craster(entered);
    } else if (sensorName === "nap") {
      if (entered) {
        host.controls.setButtons([{ slug: "nap", label: "nap" }]);
      } else {
        host.controls.setButtons([]);
      }
    } else if (sensorName === "craster-sign" && entered) {
    }
  }
}

export function timeChangedEvent(event: SunEvent): void {
  log(`Time changed: ${getSunEventName(event)}`);
}

export function pauseTick(timestep: f32): void {
  snow.tick(timestep);
}

export function tickRoom(timestep: f32): void {
  player.tick(timestep);
  snow.tick(timestep);
  modulateFog(2.0, 0.1, 0.7);
  host.player.setAction(player.action);
  host.player.setPos(player.pos.x, player.pos.y);
  host.filters.setTiltShiftY(tsfid, player.pos.y);

  // This syncs the time of day with the real world.
  host.time.setSunTime(Date.now());
}
