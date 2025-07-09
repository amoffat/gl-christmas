import { Card } from "@gl/types/card";

// This is your level card. It powers the `Credits` link on your level. As you
// add collaborators, include their details so they get credited for their work.
// If you use any assets that require attribution (like many Creative Commons
// licenses), include those as well.
export function card(): Card {
  return {
    level: {
      name: "Craster's Keep",
      version: 1,
    },
    credits: [
      {
        name: "Andrew",
        role: "Author",
        link: "https://x.com/GetLostTheGame",
      },
      {
        name: "Franuka",
        role: "Tileset artist",
        link: "https://x.com/franuka_art",
      },
      {
        name: "SnowHex",
        role: "Player sprites",
        link: "https://x.com/SnowHexArt",
      },
      {
        name: "Ben Burnes",
        role: "Music",
        link: "https://x.com/ben_burnes",
      },
    ],
  };
}
