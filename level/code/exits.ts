import { Exit } from "@gl/types/exit";

/**
 * This function returns an array of exits that are used in your level. Using
 * `host.map.exit()`, you can use these exits to send the player to another
 * level.
 */
export function exits(): Exit[] {
  return [
    {
      name: "east",
      dest: "a6f53268c77b72a4771b89ae90fbef10cc3bdee8c640abf5a875a6386382712a:main",
    },
    {
      name: "west",
      dest: "a6f53268c77b72a4771b89ae90fbef10cc3bdee8c640abf5a875a6386382712a:main",
    },
    {
      name: "south",
      dest: "a6f53268c77b72a4771b89ae90fbef10cc3bdee8c640abf5a875a6386382712a:main",
    },
    {
      name: "well",
      dest: "a6f53268c77b72a4771b89ae90fbef10cc3bdee8c640abf5a875a6386382712a:main",
    },
    {
      name: "death",
      dest: "a6f53268c77b72a4771b89ae90fbef10cc3bdee8c640abf5a875a6386382712a:main",
    },
  ];
}
