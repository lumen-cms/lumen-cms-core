import { remove } from 'diacritics'
// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
const specialCharsRegex = /[.*+?^${}()|[\]\\]/g
// waiting for new release
// https://github.com/moroshko/autosuggest-highlight
// http://www.ecma-international.org/ecma-262/5.1/#sec-15.10.2.6
const wordCharacterRegex = /[a-z0-9_]/i

const whitespacesRegex = /\s+/

function escapeRegexCharacters(str: string) {
  return str.replace(specialCharsRegex, '\\$&')
}

export function match(text: string, query: string, anyMatch = true) {
  text = remove(text)
  query = remove(query)

  return (
    query
      .trim()
      .split(whitespacesRegex)
      // If query is blank, we'll get empty string here, so let's filter it out.
      .filter((word) => word.length > 0)
      .reduce((result, word) => {
        const wordLen = word.length
        const prefix = wordCharacterRegex.test(word[0]) ? '\\b' : ''
        const regex = new RegExp(prefix + escapeRegexCharacters(word), 'i')
        // Option for highlighting anywhere in the text #5
        const index = anyMatch
          ? text.toLowerCase().search(escapeRegexCharacters(word).toLowerCase())
          : text.search(regex)

        if (index > -1) {
          // @ts-ignore
          result.push([index, index + wordLen])

          // Replace what we just found with spaces so we don't find it again.
          text =
            text.slice(0, index) +
            new Array(wordLen + 1).join(' ') +
            text.slice(index + wordLen)
        }

        return result
      }, [])
      .sort((match1, match2) => match1[0] - match2[0])
  )
}

export function parse(
  text: string,
  matches: Array<[number, number]>
): Array<{ text: string; highlight: boolean }> {
  const result = []

  if (matches.length === 0) {
    result.push({
      text,
      highlight: false
    })
  } else if (matches[0][0] > 0) {
    result.push({
      text: text.slice(0, matches[0][0]),
      highlight: false
    })
  }

  matches.forEach((m, i) => {
    const startIndex = m[0]
    const endIndex = m[1]

    result.push({
      text: text.slice(startIndex, endIndex),
      highlight: true
    })

    if (i === matches.length - 1) {
      if (endIndex < text.length) {
        result.push({
          text: text.slice(endIndex, text.length),
          highlight: false
        })
      }
    } else if (endIndex < matches[i + 1][0]) {
      result.push({
        text: text.slice(endIndex, matches[i + 1][0]),
        highlight: false
      })
    }
  })

  return result
}
