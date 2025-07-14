import * as host from "@gl/api/w2h/host";
import { String } from "@gl/types/i18n";
import * as twine from "@gl/utils/twine";
import * as level from "../main";

const log = host.debug.log;
const logError = host.debug.logError;

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
choiceToPassage.set("1de59e0c", "327d21d8");
choiceToPassage.set("38af8020", "731c272b");
choiceToPassage.set("4fb4c407", "327d21d8");
choiceToPassage.set("aa60c7ab", "4ea2afcc");
choiceToPassage.set("2ac741e6", "327d21d8");

export function strings(): String[] {
  return [
    {
      key: "talk",
      values: [
        {
          text: "Talk",
          lang: "en",
        },
      ],
    },

    {
      key: "c665b796",
      values: [
        {
          text: "I've nothing to say to you.",
          lang: "en",
        },
      ],
    },

    {
      key: "a38ee7f7",
      values: [
        {
          text: "What are you still talking to me for? Hurry up and get my gifts, Crow!",
          lang: "en",
        },
      ],
    },

    {
      key: "76ad855e",
      values: [
        {
          text: "Right, bye",
          lang: "en",
        },
      ],
    },

    {
      key: "8aaa2251",
      values: [
        {
          text: "Huh... ok... that was actually impressive. I'd give you your reward, but this level isn't finished yet! Check back soon, Crow!",
          lang: "en",
        },
      ],
    },

    {
      key: "4701611e",
      values: [
        {
          text: "So I get nothing?",
          lang: "en",
        },
      ],
    },

    {
      key: "6105f2f7",
      values: [
        {
          text: "You're a persistent one aren't you? Gonna have another go?",
          lang: "en",
        },
      ],
    },

    {
      key: "630229d0",
      values: [
        {
          text: "Ha, that was awful! You were slipping all over the place! I've never seen such a sorry sight!",
          lang: "en",
        },
      ],
    },

    {
      key: "93206782",
      values: [
        {
          text: "Let me try again",
          lang: "en",
        },
      ],
    },

    {
      key: "42b6786b",
      values: [
        {
          text: "I'm done, get the gifts yourself",
          lang: "en",
        },
      ],
    },

    {
      key: "b5b6165e",
      values: [
        {
          text: "Oh look who's back. I've nothing for you, unless you're willing to work.",
          lang: "en",
        },
      ],
    },

    {
      key: "52c6a4f6",
      values: [
        {
          text: "What do you need?",
          lang: "en",
        },
      ],
    },

    {
      key: "1de59e0c",
      values: [
        {
          text: "I'm busy right now",
          lang: "en",
        },
      ],
    },

    {
      key: "c198c99a",
      values: [
        {
          text: "Oh look here, it's another lone Crow. Let me guess, this Crow is cold and hungry and wants to come in out of the snow?",
          lang: "en",
        },
      ],
    },

    {
      key: "38af8020",
      values: [
        {
          text: "Yes, that would be nice.",
          lang: "en",
        },
      ],
    },

    {
      key: "9f765ac1",
      values: [
        {
          text: "Sorry, who are you?",
          lang: "en",
        },
      ],
    },

    {
      key: "f9a09c6a",
      values: [
        {
          text: "Your lot eats my bread and drinks my ale, but where are you when I need work done?",
          lang: "en",
        },
      ],
    },

    {
      key: "4fb4c407",
      values: [
        {
          text: "I'm busy",
          lang: "en",
        },
      ],
    },

    {
      key: "cbf52166",
      values: [
        {
          text: "Yeah, that's how you want it? Enjoy the rest of your short life as a popsicle. I'll be eating crispy chicken and drinking wine by my toasty hearth. Goodbye, Crow!",
          lang: "en",
        },
      ],
    },

    {
      key: "057e6875",
      values: [
        {
          text: "Try to keep your feet under your arse this time, yeah?",
          lang: "en",
        },
      ],
    },

    {
      key: "9c18d355",
      values: [
        {
          text: "Ha! This should be fun. The first gift is to the east. That's the only help you're getting from me.",
          lang: "en",
        },
      ],
    },

    {
      key: "1ee58671",
      values: [
        {
          text: "Don't take it personally. In the meantime, there is a campsite to the west you can sleep at while I work on your reward.",
          lang: "en",
        },
      ],
    },

    {
      key: "8f6e775f",
      values: [
        {
          text: "Don't take an attitude with me, boy. You Crows are all the same.",
          lang: "en",
        },
      ],
    },

    {
      key: "79329e65",
      values: [
        {
          text: "Have I done something to offend you?",
          lang: "en",
        },
      ],
    },

    {
      key: "aa60c7ab",
      values: [
        {
          text: "Talk to Gnome",
          lang: "en",
        },
      ],
    },

    {
      key: "91d6dc09",
      values: [
        {
          text: "I had gifts here for my daughters. The wind blew them onto the frozen river. If you collect them in the next $raceTime seconds, I might not let you freeze to death out here.",
          lang: "en",
        },
      ],
    },

    {
      key: "0d7b08dc",
      values: [
        {
          text: "Ok let's go",
          lang: "en",
        },
      ],
    },

    {
      key: "2ac741e6",
      values: [
        {
          text: "Maybe later",
          lang: "en",
        },
      ],
    },

    {
      key: "f004de8e",
      values: [
        {
          text: "It's no skin off my hide.",
          lang: "en",
        },
      ],
    },

    {
      key: "4b60cb20",
      values: [
        {
          text: "Well that's really too bad. No room for you here. But I tell you what...\n\nI had gifts here for my daughters. The wind blew them onto the frozen river. If you collect them in the next $raceTime seconds, I might not let you freeze to death out here.",
          lang: "en",
        },
      ],
    },

    {
      key: "21f8c618",
      values: [
        {
          text: "Craster",
          lang: "en",
        },
      ],
    },
  ];
}

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

// Show talk button for "Gnome"
export function stage_Craster(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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
    text = "c665b796";
  } else if (state.racing) {
    // "What are you still talking to me for? Hurry up and get my gifts, Crow!"
    text = "a38ee7f7";
    // Right, bye
    choices.push("76ad855e");
  } else if (state.wonRace) {
    // "Huh... ok... that was actually impressive. I'd give you your reward, but this level isn't finished yet! Check back soon, Crow!"
    text = "8aaa2251";
    // So I get nothing?
    choices.push("4701611e");
  } else if (state.lostRace) {
    if (twine.visited("4ea2afcc") > 2) {
      // "You're a persistent one aren't you? Gonna have another go?"
      text = "6105f2f7";
    } else {
      // "Ha, that was awful! You were slipping all over the place! I've never seen such a sorry sight!"
      text = "630229d0";
    }

    // Let me try again
    choices.push("93206782");

    // I'm done, get the gifts yourself
    choices.push("42b6786b");
  } else if (twine.visited("4ea2afcc") > 1) {
    // "Oh look who's back. I've nothing for you, unless you're willing to work."
    text = "b5b6165e";
    // What do you need?
    choices.push("52c6a4f6");

    // I'm busy right now
    choices.push("1de59e0c");
  } else {
    // "Oh look here, it's another lone Crow. Let me guess, this Crow is cold and hungry and wants to come in out of the snow?"
    text = "c198c99a";
    // Yes, that would be nice.
    choices.push("38af8020");

    // Sorry, who are you?
    choices.push("9f765ac1");
  }

  host.text.display("4ea2afcc", title, text, choices, state.params, animate);
}

// Show talk button for "Have I done something to offend you?"
export function stage_79329e65(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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
  text = "f9a09c6a";
  // What do you need?
  choices.push("52c6a4f6");

  // I'm busy
  choices.push("4fb4c407");

  host.text.display("79329e65", title, text, choices, state.params, animate);
}

// Show talk button for "I'm done, get the gifts yourself"
export function stage_42b6786b(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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
  text = "cbf52166";
  state.angeredCraster = true;

  host.text.display("42b6786b", title, text, choices, state.params, animate);
}

// Show talk button for "Let me try again"
export function stage_93206782(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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
  text = "057e6875";
  level.startRace();

  host.text.display("93206782", title, text, choices, state.params, animate);
}

// Show talk button for "Ok let's go"
export function stage_0d7b08dc(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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
  text = "9c18d355";
  level.startRace();

  host.text.display("0d7b08dc", title, text, choices, state.params, animate);
}

// Show talk button for "So I get nothing?"
export function stage_4701611e(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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

// Show talk button for "Sorry, who are you?"
export function stage_9f765ac1(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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
  text = "8f6e775f";
  // Have I done something to offend you?
  choices.push("79329e65");

  host.text.display("9f765ac1", title, text, choices, state.params, animate);
}

// Show talk button for "What do you need?"
export function stage_52c6a4f6(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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
  text = "91d6dc09";
  // Ok let's go
  choices.push("0d7b08dc");

  // Maybe later
  choices.push("2ac741e6");

  host.text.display("52c6a4f6", title, text, choices, state.params, animate);
}

// Show talk button for "no-deal"
export function stage_327d21d8(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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

// Show talk button for "yes-warm"
export function stage_731c272b(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "talk",
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
  text = "4b60cb20";
  // Ok let's go
  choices.push("0d7b08dc");

  // Maybe later
  choices.push("2ac741e6");

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

