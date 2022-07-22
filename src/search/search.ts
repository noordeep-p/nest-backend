export function nestedMatchPhrase(
  propertyPath: string,
  propertyName: string,
  searchPhrases: string[],
  boost = 1,
) {
  const result = [];
  for (const searchPhrase of searchPhrases) {
    result.push({
      nested: {
        path: propertyPath,
        query: {
          match_phrase: {
            [propertyName]: {
              query: searchPhrase,
              boost,
            },
          },
        },
      },
    });
  }
  return result;
}

export function nestedMatch(
  propertyPath: string,
  propertyName: string,
  searchPhrases: string[],
  boost = 1,
) {
  const result = [];
  for (const searchPhrase of searchPhrases) {
    result.push({
      nested: {
        path: propertyPath,
        query: {
          match: {
            [propertyName]: {
              query: searchPhrase,
              fuzziness: 'auto',
              boost,
            },
          },
        },
      },
    });
  }
  return result;
}

export function query(index: string, expressions: any) {
  return {
    query: expressions.filter((x) => x).reduce((a, b) => ({ ...a, ...b })),
  };
}

export function bool(...expressions) {
  return {
    bool: expressions.filter((x) => x).reduce((a, b) => ({ ...a, ...b })),
  };
}

export function must(...expressions) {
  return {
    must: expressions.filter((x) => x).flat(),
  };
}

export function filter(...expressions) {
  return {
    filter: expressions.filter((x) => x).flat(),
  };
}

export function should(...expressions) {
  return {
    should: expressions.filter((x) => x).flat(),
  };
}
