import * as host from "@gl/api/w2h/host";
import { String } from "@gl/types/i18n";
import * as twine from "@gl/utils/twine";
import * as level from "../main";

const log = host.debug.log;
const logError = host.debug.logError;
const interactButton = "interact";

class State {
  racing: bool;
  wonRace: bool;
  lostRace: bool;
  angeredCraster: bool;
  raceTime: i32;
  constructor() {
    this.racing = false;
    this.wonRace = false;
    this.lostRace = false;
    this.angeredCraster = false;
    this.raceTime = 45;
  }
  get params(): string[] {
    const params = new Array<string>();
    params.push("racing");
    params.push(this.racing.toString());
    params.push("wonRace");
    params.push(this.wonRace.toString());
    params.push("lostRace");
    params.push(this.lostRace.toString());
    params.push("angeredCraster");
    params.push(this.angeredCraster.toString());
    params.push("raceTime");
    params.push(this.raceTime.toString());
    return params;
  }
}

export const state = new State();

// If we're using an alias on our link, then we need to map from our shown
// choice id to our alias choice id.
const choiceToPassage = new Map<string, string>();
choiceToPassage.set("3a8e31e5", "327d21d8");
choiceToPassage.set("ea478db0", "731c272b");
choiceToPassage.set("0006795b", "327d21d8");
choiceToPassage.set("3279dfab", "4ea2afcc");
choiceToPassage.set("94f8cece", "327d21d8");

/**
 * Called when the player interacts with a choice dialog.
 *
 * @param passageId The id of the passage that the user interacted with.
 * @param passageId The id of the choice that the user made.
 */
export function choiceMadeEvent(passageId: string, choiceId: string): void {
  if (choiceId === "") {
    log(`Passage ${passageId} closed.`);
    level.dialogClosedEvent(passageId);
    return;
  }
  log(`Choice made for ${passageId}: ${choiceId}`);
  if (choiceToPassage.has(choiceId)) {
    choiceId = choiceToPassage.get(choiceId);
  }
  dispatch(choiceId);
}

// Show interact button for "Gnome"
export function stage_Craster(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/4ea2afcc",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "Gnome"
export function passage_Craster(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("4ea2afcc");

  if (state.angeredCraster) {
    // "I've nothing to say to you."
    text = "2dba5c1e";
  } else if (state.racing) {
    // "What are you still talking to me for? Hurry up and get my gifts, Crow!"
    text = "3f8ecbc0";
    // Right, bye
    choices.push("76ad855e");
  } else if (state.wonRace) {
    // "Huh... ok... that was actually impressive. I'd give you your reward, but this level isn't finished yet! Check back soon, Crow!"
    text = "ce3f2074";
    // So I get nothing?
    choices.push("4701611e");
  } else if (state.lostRace) {
    if (twine.visited("4ea2afcc") > 2) {
      // "You're a persistent one aren't you? Gonna have another go?"
      text = "03ba139a";
    } else {
      // "Ha, that was awful! You were slipping all over the place! I've never seen such a sorry sight!"
      text = "ec95b2d0";
    }

    // Let me try again
    choices.push("93206782");

    // I'm done, get the gifts yourself
    choices.push("42b6786b");
  } else if (twine.visited("4ea2afcc") > 1) {
    // "Oh look who's back. I've nothing for you, unless you're willing to work."
    text = "afab7423";
    // What do you need?
    choices.push("52c6a4f6");

    // I'm busy right now
    choices.push("3a8e31e5");
  } else {
    // "Oh look here, it's another lone Crow. Let me guess, this Crow is cold and hungry and wants to come in out of the snow?"
    text = "a1d93243";
    // Yes, that would be nice.
    choices.push("ea478db0");

    // Sorry, who are you?
    choices.push("9f765ac1");
  }

  host.text.display("4ea2afcc", title, text, choices, state.params, animate);
}

// Show interact button for "Have I done something to offend you?"
export function stage_79329e65(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/79329e65",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "Have I done something to offend you?"
export function passage_79329e65(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("79329e65");

  // "Your lot eats my bread and drinks my ale, but where are you when I need work done?"
  text = "40a39c3d";
  // What do you need?
  choices.push("52c6a4f6");

  // I'm busy
  choices.push("0006795b");

  host.text.display("79329e65", title, text, choices, state.params, animate);
}

// Show interact button for "I'm done, get the gifts yourself"
export function stage_42b6786b(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/42b6786b",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "I'm done, get the gifts yourself"
export function passage_42b6786b(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("42b6786b");

  // "Yeah, that's how you want it? Enjoy the rest of your short life as a popsicle. I'll be eating crispy chicken and drinking wine by my toasty hearth. Goodbye, Crow!"
  text = "b1398514";
  state.angeredCraster = true;

  host.text.display("42b6786b", title, text, choices, state.params, animate);
}

// Show interact button for "Let me try again"
export function stage_93206782(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/93206782",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "Let me try again"
export function passage_93206782(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("93206782");

  // "Try to keep your feet under your arse this time, yeah?"
  text = "2025e6d9";
  level.startRace();

  host.text.display("93206782", title, text, choices, state.params, animate);
}

// Show interact button for "Ok let's go"
export function stage_0d7b08dc(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/0d7b08dc",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "Ok let's go"
export function passage_0d7b08dc(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("0d7b08dc");

  // "Ha! This should be fun. The first gift is to the east. That's the only help you're getting from me."
  text = "47862c45";
  level.startRace();

  host.text.display("0d7b08dc", title, text, choices, state.params, animate);
}

// Show interact button for "So I get nothing?"
export function stage_4701611e(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/4701611e",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "So I get nothing?"
export function passage_4701611e(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("4701611e");

  // "Don't take it personally. In the meantime, there is a campsite to the west you can sleep at while I work on your reward."
  text = "1ee58671";

  host.text.display("4701611e", title, text, choices, state.params, animate);
}

// Show interact button for "Sorry, who are you?"
export function stage_9f765ac1(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/9f765ac1",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "Sorry, who are you?"
export function passage_9f765ac1(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("9f765ac1");

  // "Don't take an attitude with me, boy. You Crows are all the same."
  text = "eddd5658";
  // Have I done something to offend you?
  choices.push("79329e65");

  host.text.display("9f765ac1", title, text, choices, state.params, animate);
}

// Show interact button for "What do you need?"
export function stage_52c6a4f6(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/52c6a4f6",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "What do you need?"
export function passage_52c6a4f6(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("52c6a4f6");

  // "I had gifts here for my daughters. The wind blew them onto the frozen river. If you collect them in the next $raceTime seconds, I might not let you freeze to death out here."
  text = "1bd50d4e";
  // Ok let's go
  choices.push("0d7b08dc");

  // Maybe later
  choices.push("94f8cece");

  host.text.display("52c6a4f6", title, text, choices, state.params, animate);
}

// Show interact button for "no-deal"
export function stage_327d21d8(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/327d21d8",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "no-deal"
export function passage_327d21d8(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("327d21d8");

  // "It's no skin off my hide."
  text = "f004de8e";

  host.text.display("327d21d8", title, text, choices, state.params, animate);
}

// Show interact button for "yes-warm"
export function stage_731c272b(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: interactButton,
        slug: "passage/731c272b",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "yes-warm"
export function passage_731c272b(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  twine.incrementVisitCount("731c272b");

  // "Well that's really too bad. No room for you here. But I tell you what...\n\nI had gifts here for my daughters. The wind blew them onto the frozen river. If you collect them in the next $raceTime seconds, I might not let you freeze to death out here."
  text = "1dc1822e";
  // Ok let's go
  choices.push("0d7b08dc");

  // Maybe later
  choices.push("94f8cece");

  host.text.display("731c272b", title, text, choices, state.params, animate);
}

export function dispatch(passageId: string): void {
  let found = false;

  if (passageId === "4ea2afcc") {
    found = true;
    passage_Craster();
  }

  if (passageId === "79329e65") {
    found = true;
    passage_79329e65();
  }

  if (passageId === "42b6786b") {
    found = true;
    passage_42b6786b();
  }

  if (passageId === "93206782") {
    found = true;
    passage_93206782();
  }

  if (passageId === "0d7b08dc") {
    found = true;
    passage_0d7b08dc();
  }

  if (passageId === "4701611e") {
    found = true;
    passage_4701611e();
  }

  if (passageId === "9f765ac1") {
    found = true;
    passage_9f765ac1();
  }

  if (passageId === "52c6a4f6") {
    found = true;
    passage_52c6a4f6();
  }

  if (passageId === "327d21d8") {
    found = true;
    passage_327d21d8();
  }

  if (passageId === "731c272b") {
    found = true;
    passage_731c272b();
  }

  if (!found) {
    log(`No passage found for ${passageId}, does it have content?`);
  }
}
