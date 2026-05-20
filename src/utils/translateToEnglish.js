import { franc } from 'franc'

const MYMEMORY_API = 'https://api.mymemory.translated.net/get'
const MAX_CHARS = 500

/** ISO 639-3 (franc) → ISO 639-1 (MyMemory) */
const LANG_TO_PAIR = {
  ara: 'ar',
  deu: 'de',
  eng: 'en',
  spa: 'es',
  fra: 'fr',
  hin: 'hi',
  ita: 'it',
  jpn: 'ja',
  kor: 'ko',
  nld: 'nl',
  pol: 'pl',
  por: 'pt',
  rus: 'ru',
  swe: 'sv',
  tur: 'tr',
  urd: 'ur',
  zho: 'zh',
}

const translationCache = new Map()

function decodeHtmlEntities(str) {
  if (typeof document === 'undefined') return str
  const el = document.createElement('textarea')
  el.innerHTML = str
  return el.value
}

function normalizeForCompare(str) {
  return str.trim().replace(/\s+/g, ' ').toLowerCase()
}

function detectSourceLanguage(text) {
  const code3 = franc(text, { minLength: 3, only: Object.keys(LANG_TO_PAIR) })

  if (code3 === 'eng') {
    return { source: 'en', alreadyEnglish: true }
  }

  if (code3 === 'und' || !code3) {
    return { source: null, alreadyEnglish: false }
  }

  const source = LANG_TO_PAIR[code3]
  if (!source) {
    return { source: null, alreadyEnglish: false }
  }

  if (source === 'en') {
    return { source: 'en', alreadyEnglish: true }
  }

  return { source, alreadyEnglish: false }
}

export function getGoogleTranslateUrl(text) {
  const params = new URLSearchParams({
    sl: 'auto',
    tl: 'en',
    text: text.trim(),
  })
  return `https://translate.google.com/?${params.toString()}`
}

async function fetchMyMemory(source, text) {
  const url = new URL(MYMEMORY_API)
  url.searchParams.set('q', text)
  url.searchParams.set('langpair', `${source}|en`)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Translation service unavailable. Try again or use Google Translate.')
  }

  const data = await response.json()

  if (data.quotaFinished || data.responseStatus === 429) {
    throw new Error('Daily free translation limit reached. Try Google Translate instead.')
  }

  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'Translation failed.')
  }

  let translatedText = decodeHtmlEntities(data.responseData?.translatedText?.trim() || '')

  if (!translatedText || translatedText.includes('MYMEMORY WARNING')) {
    throw new Error('Translation limit reached. Try Google Translate instead.')
  }

  return translatedText
}

/**
 * Free translation via MyMemory (detect language → English).
 * Results are cached in memory for the session by cacheKey.
 */
export async function translateToEnglish(text, cacheKey = null) {
  const source = text?.trim()
  if (!source) {
    throw new Error('Nothing to translate.')
  }

  if (source.length > MAX_CHARS) {
    throw new Error(
      `Text is too long to translate here (max ${MAX_CHARS} characters). Use Google Translate instead.`
    )
  }

  if (cacheKey && translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }

  const detected = detectSourceLanguage(source)

  if (detected.alreadyEnglish) {
    const result = {
      translatedText: source,
      alreadyEnglish: true,
      sourceLanguage: 'en',
    }
    if (cacheKey) translationCache.set(cacheKey, result)
    return result
  }

  const langCodesToTry = detected.source
    ? [detected.source]
    : ['ar', 'ur', 'tr', 'de', 'sv', 'fr', 'es', 'ru', 'pt', 'it']

  let lastError = null

  for (const lang of langCodesToTry) {
    if (lang === 'en') continue

    try {
      const translatedText = await fetchMyMemory(lang, source)
      const alreadyEnglish = normalizeForCompare(translatedText) === normalizeForCompare(source)

      const result = {
        translatedText,
        alreadyEnglish,
        sourceLanguage: lang,
      }

      if (cacheKey) translationCache.set(cacheKey, result)
      return result
    } catch (err) {
      lastError = err
    }
  }

  throw (
    lastError ||
    new Error('Could not detect language. Use Google Translate instead.')
  )
}
