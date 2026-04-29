export function parseArgs(argv, config = {}) {
  const { valueOptions = [], booleanOptions = [], aliasMap = {} } = config;
  const options = {};
  const positionals = [];

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      if (booleanOptions.includes(key)) {
        options[key] = true;
        i++;
      } else if (valueOptions.includes(key)) {
        if (i + 1 >= argv.length) {
          throw new Error(`Option --${key} requires a value`);
        }
        options[key] = argv[i + 1];
        i += 2;
      } else {
        i++;
      }
    } else if (arg.startsWith("-") && arg.length > 1) {
      const shortKey = arg.slice(1);
      const key = aliasMap[shortKey] || shortKey;
      if (booleanOptions.includes(key)) {
        options[key] = true;
        i++;
      } else if (valueOptions.includes(key)) {
        if (i + 1 >= argv.length) {
          throw new Error(`Option -${shortKey} requires a value`);
        }
        options[key] = argv[i + 1];
        i += 2;
      } else {
        i++;
      }
    } else {
      positionals.push(arg);
      i++;
    }
  }

  return { options, positionals };
}

export function splitRawArgumentString(raw) {
  const args = [];
  let current = "";
  let inQuote = false;
  let quoteChar = null;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    if ((char === '"' || char === "'") && !inQuote) {
      inQuote = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuote) {
      inQuote = false;
      quoteChar = null;
    } else if (char === " " && !inQuote) {
      if (current.length > 0) {
        args.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }

  if (current.length > 0) {
    args.push(current);
  }

  return args;
}