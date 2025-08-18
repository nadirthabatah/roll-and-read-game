// Word database extracted from reference material
// Organized by levels and categories following phonetic progression

export interface WordCategory {
  id: string;
  name: string;
  description: string;
  words: string[];
  nonsenseWords?: string[];
}

export interface Level {
  id: number;
  name: string;
  description: string;
  categories: WordCategory[];
}

export const WORD_DATABASE: Level[] = [
  {
    id: 1,
    name: "Foundation",
    description: "Short vowels and basic consonants",
    categories: [
      {
        id: "short-a",
        name: "Short A",
        description: "Words with short 'a' sound",
        words: ["cat", "bat", "hat", "mat", "rat", "sat", "fat", "pat", "vat", "lap", "cap", "map", "nap", "sap", "tap", "gap", "bad", "dad", "had", "mad", "pad", "sad", "bag", "tag", "wag", "rag", "lag", "jam", "ham", "ram", "dam", "yam", "can", "man", "pan", "ran", "tan", "van", "fan"],
        nonsenseWords: ["zat", "bap", "wam", "jat", "kap", "lam", "pag", "gam", "wat", "zap"]
      },
      {
        id: "short-i",
        name: "Short I", 
        description: "Words with short 'i' sound",
        words: ["sit", "hit", "bit", "fit", "kit", "lit", "pit", "wit", "big", "dig", "fig", "jig", "pig", "wig", "pin", "bin", "fin", "win", "sin", "tin", "din", "hip", "dip", "lip", "rip", "sip", "tip", "zip", "kid", "lid", "bid", "did", "hid", "rid", "rim", "dim", "him", "gym"],
        nonsenseWords: ["git", "zit", "wip", "jib", "kip", "mig", "pim", "gid", "wim", "zib"]
      },
      {
        id: "short-o", 
        name: "Short O",
        description: "Words with short 'o' sound",
        words: ["hot", "pot", "lot", "cot", "dot", "got", "jot", "not", "rot", "hop", "mop", "pop", "cop", "top", "chop", "drop", "stop", "job", "mob", "rob", "sob", "hog", "dog", "fog", "jog", "log", "box", "fox", "sox", "rod", "nod", "pod", "cod"],
        nonsenseWords: ["zot", "wop", "gob", "jop", "kot", "mop", "pog", "wod", "zob", "gop"]
      },
      {
        id: "short-u",
        name: "Short U",
        description: "Words with short 'u' sound", 
        words: ["cut", "but", "hut", "jut", "nut", "rut", "shut", "bug", "dug", "hug", "jug", "mug", "rug", "tug", "bud", "mud", "cud", "dud", "bus", "gus", "pus", "cup", "pup", "up", "fun", "gun", "run", "sun", "bun", "nun", "gum", "hum", "rum", "sum", "yum"],
        nonsenseWords: ["zut", "wug", "jud", "kup", "lum", "pun", "gus", "wud", "zug", "jum"]
      },
      {
        id: "short-e",
        name: "Short E",
        description: "Words with short 'e' sound",
        words: ["bed", "red", "fed", "led", "wed", "net", "bet", "get", "jet", "let", "met", "pet", "set", "vet", "wet", "yet", "pen", "den", "hen", "men", "ten", "leg", "beg", "egg", "peg", "bell", "tell", "sell", "well", "fell", "yell", "mess", "less", "best", "nest", "rest", "test", "west"],
        nonsenseWords: ["zed", "wet", "jep", "keg", "lep", "pem", "gell", "wed", "zet", "jell"]
      }
    ]
  },
  {
    id: 2,
    name: "Building Blocks", 
    description: "Consonant digraphs and blends",
    categories: [
      {
        id: "consonant-digraphs",
        name: "Consonant Digraphs",
        description: "ch, sh, th, wh sounds",
        words: ["chip", "chop", "chat", "chin", "chum", "ship", "shop", "shut", "shed", "shin", "this", "that", "then", "them", "thin", "whip", "when", "what", "whim", "which", "rich", "much", "such", "rush", "hush", "wish", "fish", "dish", "cash", "bash", "wash", "path", "bath", "math", "with"],
        nonsenseWords: ["chep", "shup", "thop", "whap", "chib", "shom", "thim", "wheg", "chud", "shep"]
      },
      {
        id: "l-blends",
        name: "L-Blends", 
        description: "bl, cl, fl, gl, pl, sl blends",
        words: ["black", "blue", "blow", "blob", "block", "clam", "clap", "clip", "club", "class", "flag", "flip", "flop", "flat", "flash", "glad", "glue", "glow", "glass", "globe", "plan", "play", "plug", "plot", "plus", "slip", "slap", "slow", "slam", "sleep"],
        nonsenseWords: ["blep", "clup", "flom", "glip", "pleb", "slup", "blam", "clop", "flub", "glom"]
      },
      {
        id: "r-blends",
        name: "R-Blends",
        description: "br, cr, dr, fr, gr, pr, tr blends", 
        words: ["bring", "brown", "bread", "brick", "bridge", "crab", "crop", "crown", "crack", "cream", "drop", "drum", "drive", "dress", "dry", "frog", "from", "fresh", "free", "front", "grab", "green", "grow", "grass", "grand", "print", "proud", "press", "pretty", "trip", "truck", "tree", "track", "train"],
        nonsenseWords: ["brop", "crup", "drim", "freb", "grop", "prum", "treb", "bram", "crup", "drog"]
      }
    ]
  },
  {
    id: 3,
    name: "Expanding",
    description: "Long vowels and vowel teams",
    categories: [
      {
        id: "long-a",
        name: "Long A (a-e)",
        description: "Magic e with long 'a' sound",
        words: ["make", "take", "cake", "lake", "wake", "bake", "rake", "sake", "name", "game", "same", "tame", "fame", "came", "blame", "flame", "frame", "shame", "place", "space", "race", "face", "lace", "trace", "grace", "brave", "grave", "shave", "slave", "wave", "save", "gave", "cave", "pave"],
        nonsenseWords: ["zake", "wame", "jace", "kave", "lame", "pame", "gace", "wace", "zame", "jave"]
      },
      {
        id: "vowel-teams-ai-ay",
        name: "AI/AY Teams", 
        description: "Long 'a' with ai and ay",
        words: ["rain", "pain", "main", "train", "brain", "chain", "plain", "stain", "grain", "drain", "wait", "bait", "paid", "maid", "said", "tail", "nail", "mail", "sail", "fail", "day", "say", "may", "way", "pay", "play", "stay", "clay", "gray", "pray", "spray", "tray"],
        nonsenseWords: ["wain", "jain", "kait", "lail", "pail", "gait", "wail", "zay", "jay", "kay"]
      },
      {
        id: "long-i",
        name: "Long I (i-e)",
        description: "Magic e with long 'i' sound",
        words: ["bike", "like", "hike", "mike", "pike", "kite", "bite", "site", "white", "quite", "write", "smile", "while", "mile", "file", "pile", "tile", "time", "dime", "lime", "chime", "crime", "prime", "slime", "wine", "dine", "fine", "line", "mine", "nine", "pine", "shine", "spine", "whine"],
        nonsenseWords: ["zike", "wite", "jime", "kine", "lipe", "pime", "gine", "wime", "zine", "jipe"]
      }
    ]
  },
  {
    id: 4,
    name: "Advanced Patterns",
    description: "Complex vowel combinations",
    categories: [
      {
        id: "r-controlled",
        name: "R-Controlled Vowels",
        description: "ar, er, ir, or, ur sounds",
        words: ["car", "far", "bar", "jar", "star", "hard", "yard", "card", "park", "dark", "mark", "bark", "shark", "smart", "start", "her", "term", "fern", "verb", "perch", "clerk", "nerve", "serve", "bird", "girl", "first", "third", "shirt", "skirt", "dirt", "hurt", "turn", "burn", "curl", "fur", "for", "or", "horn", "corn", "born", "torn", "fort", "sort", "short", "sport"],
        nonsenseWords: ["zar", "wer", "jir", "kor", "lur", "par", "ger", "wir", "zor", "jur"]
      },
      {
        id: "diphthongs",
        name: "Diphthongs",
        description: "ow, ou, oi, oy sounds",
        words: ["cow", "how", "now", "wow", "brown", "crown", "down", "town", "clown", "frown", "house", "mouse", "about", "shout", "cloud", "loud", "found", "round", "sound", "ground", "count", "mount", "point", "joint", "moist", "voice", "choice", "noise", "boy", "joy", "toy", "roy", "enjoy", "employ", "destroy"],
        nonsenseWords: ["zow", "wou", "joit", "koy", "low", "pou", "goit", "woy", "zou", "joit"]
      }
    ]
  },
  {
    id: 5,
    name: "Mastery",
    description: "Silent letters and complex patterns",
    categories: [
      {
        id: "silent-letters",
        name: "Silent Letters",
        description: "kn, wr, mb, gh patterns",
        words: ["know", "knee", "knife", "knight", "knock", "knot", "write", "wrong", "wrap", "wrist", "wreck", "lamb", "thumb", "climb", "comb", "tomb", "crumb", "numb", "light", "night", "right", "sight", "fight", "bright", "flight", "tight", "might", "weight", "eight", "neighbor", "sleigh"],
        nonsenseWords: ["knep", "wrib", "jamb", "ligh", "weigh", "knum", "wrel", "jimb", "righ", "feigh"]
      },
      {
        id: "advanced-syllables",
        name: "Multi-syllable Words",
        description: "Two and three syllable combinations",
        words: ["happen", "rabbit", "button", "kitten", "mitten", "sudden", "hidden", "rotten", "cotton", "gotten", "better", "letter", "matter", "butter", "summer", "winter", "sister", "number", "lumber", "under", "thunder", "wonder", "monster", "master", "faster", "chapter", "after", "laughter", "aughter"],
        nonsenseWords: ["rablen", "kippen", "sudmen", "hidlen", "rotpen", "cotmen", "betler", "matler", "sumler", "winler"]
      }
    ]
  }
];

// Utility functions for word selection
export function getWordsForLevel(levelId: number): WordCategory[] {
  const level = WORD_DATABASE.find(l => l.id === levelId);
  return level?.categories || [];
}

export function getRandomWords(category: WordCategory, count: number = 6, includeNonsense: boolean = false): string[] {
  const allWords = includeNonsense 
    ? [...category.words, ...(category.nonsenseWords || [])]
    : category.words;
  
  // Shuffle and take requested count
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getAllLevels(): Level[] {
  return WORD_DATABASE;
}