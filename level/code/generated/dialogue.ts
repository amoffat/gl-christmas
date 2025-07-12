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
  constructor() {
    this.racing = false;
    this.wonRace = false;
    this.lostRace = false;
    this.angeredCraster = false;
  }
}

export const state = new State();

// If we're using an alias on our link, then we need to map from our shown
// choice id to our alias choice id.
const choiceToPassage = new Map<string, string>();
choiceToPassage.set("1de59e0c", "327d21d8");
choiceToPassage.set("e4990517", "731c272b");
choiceToPassage.set("aa60c7ab", "4ea2afcc");
choiceToPassage.set("2ac741e6", "327d21d8");

export function strings(): String[] {
  return [
    {
      key: "interact",
      values: [
        {
          text: "Interact",
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
      key: "1ef33bb9",
      values: [
        {
          text: "Huh... ok... I'm actually impressed. Ok, as promised.. TODO",
          lang: "en",
        },
      ],
    },

    {
      key: "825035dd",
      values: [
        {
          text: "You're a persistent one aren't you?",
          lang: "en",
        },
      ],
    },

    {
      key: "96455735",
      values: [
        {
          text: "That was awful! You were slipping all over the place! I've never seen such a sorry sight!",
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
      key: "9f765ac1",
      values: [
        {
          text: "Sorry, who are you?",
          lang: "en",
        },
      ],
    },

    {
      key: "e4990517",
      values: [
        {
          text: "Yes, that would be nice actually",
          lang: "en",
        },
      ],
    },

    {
      key: "fe8e7135",
      values: [
        {
          text: "Yeah, that's how you want it? Enjoy the rest of your short life as a human popsicle. I'll be eating crispy chicken and drinking wine by my toasty hearth. Goodbye, Crow!",
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
      key: "b68451b6",
      values: [
        {
          text: "Ha! This should be fun. The first gift is to the east. That's the only help you're getting.",
          lang: "en",
        },
      ],
    },

    {
      key: "337e547a",
      values: [
        {
          text: "TODO",
          lang: "en",
        },
      ],
    },

    {
      key: "e7ac21cd",
      values: [
        {
          text: "Don't take an attitude with me, boy. You Crows are all the same. \"He forgets the well from which he once drank.\" That's your lot.",
          lang: "en",
        },
      ],
    },

    {
      key: "705c3306",
      values: [
        {
          text: "Sorry, have I done something to offend you?",
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
      key: "c6af1532",
      values: [
        {
          text: "I had gifts here for my 8 daughters. The wind took them onto the frozen river. If you collect them in the next 45 seconds, I might not let you freeze to death out here.",
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
      key: "bb280972",
      values: [
        {
          text: "Well that's really too bad. No room for you.\n\nBut I tell you what...I had gifts here for my 8 daughters. The wind took them onto the frozen river. If you collect them in the next 45 seconds, I might not let you freeze to death out here.",
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

// Show interact button for "Gnome"
export function stage_Craster(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
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
  const params = new Map<string, string>();
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
    // "Huh... ok... I'm actually impressed. Ok, as promised.. TODO"
    text = "1ef33bb9";
  } else if (state.lostRace) {
    if (twine.visited("4ea2afcc") > 2) {
      // "You're a persistent one aren't you?"
      text = "825035dd";
    } else {
      // "That was awful! You were slipping all over the place! I've never seen such a sorry sight!"
      text = "96455735";
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
    // Sorry, who are you?
    choices.push("9f765ac1");

    // Yes, that would be nice actually
    choices.push("e4990517");
  }

  host.text.display("4ea2afcc", title, text, choices, params, animate);
}

// Show interact button for "I'm done, get the gifts yourself"
export function stage_42b6786b(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
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
  const params = new Map<string, string>();
  twine.incrementVisitCount("42b6786b");

  // "Yeah, that's how you want it? Enjoy the rest of your short life as a human popsicle. I'll be eating crispy chicken and drinking wine by my toasty hearth. Goodbye, Crow!"
  text = "fe8e7135";
  state.angeredCraster = true;

  host.text.display("42b6786b", title, text, choices, params, animate);
}

// Show interact button for "Let me try again"
export function stage_93206782(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
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
  const params = new Map<string, string>();
  twine.incrementVisitCount("93206782");

  // "Try to keep your feet under your arse this time, yeah?"
  text = "057e6875";
  level.startRace();

  host.text.display("93206782", title, text, choices, params, animate);
}

// Show interact button for "Ok let's go"
export function stage_0d7b08dc(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
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
  const params = new Map<string, string>();
  twine.incrementVisitCount("0d7b08dc");

  // "Ha! This should be fun. The first gift is to the east. That's the only help you're getting."
  text = "b68451b6";
  level.startRace();

  host.text.display("0d7b08dc", title, text, choices, params, animate);
}

// Show interact button for "Sorry, have I done something to offend you?"
export function stage_705c3306(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
        slug: "passage/705c3306",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// "Sorry, have I done something to offend you?"
export function passage_705c3306(): void {
  // "Craster"
  const title = "21f8c618";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  const params = new Map<string, string>();
  twine.incrementVisitCount("705c3306");

  // "TODO"
  text = "337e547a";

  host.text.display("705c3306", title, text, choices, params, animate);
}

// Show interact button for "Sorry, who are you?"
export function stage_9f765ac1(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
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
  const params = new Map<string, string>();
  twine.incrementVisitCount("9f765ac1");

  // "Don't take an attitude with me, boy. You Crows are all the same. \"He forgets the well from which he once drank.\" That's your lot."
  text = "e7ac21cd";
  // Sorry, have I done something to offend you?
  choices.push("705c3306");

  host.text.display("9f765ac1", title, text, choices, params, animate);
}

// Show interact button for "What do you need?"
export function stage_52c6a4f6(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
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
  const params = new Map<string, string>();
  twine.incrementVisitCount("52c6a4f6");

  // "I had gifts here for my 8 daughters. The wind took them onto the frozen river. If you collect them in the next 45 seconds, I might not let you freeze to death out here."
  text = "c6af1532";
  // Ok let's go
  choices.push("0d7b08dc");

  // Maybe later
  choices.push("2ac741e6");

  host.text.display("52c6a4f6", title, text, choices, params, animate);
}

// Show interact button for "no-deal"
export function stage_327d21d8(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
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
  const params = new Map<string, string>();
  twine.incrementVisitCount("327d21d8");

  // "It's no skin off my hide."
  text = "f004de8e";

  host.text.display("327d21d8", title, text, choices, params, animate);
}

// Show interact button for "yes-warm"
export function stage_731c272b(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
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
  const params = new Map<string, string>();
  twine.incrementVisitCount("731c272b");

  // "Well that's really too bad. No room for you.\n\nBut I tell you what...I had gifts here for my 8 daughters. The wind took them onto the frozen river. If you collect them in the next 45 seconds, I might not let you freeze to death out here."
  text = "bb280972";
  // Ok let's go
  choices.push("0d7b08dc");

  // Maybe later
  choices.push("2ac741e6");

  host.text.display("731c272b", title, text, choices, params, animate);
}

export function dispatch(passageId: string): void {
  let found = false;

  if (passageId === "4ea2afcc") {
    found = true;
    passage_Craster();
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

  if (passageId === "705c3306") {
    found = true;
    passage_705c3306();
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

