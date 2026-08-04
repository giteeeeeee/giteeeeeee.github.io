const ROUTE_SEGMENT_SLASH_ESCAPE = '~2F~'

/**
 * Keep taxonomy values inside one Astro route segment without changing their
 * visible text. Slash-free values retain their existing URLs.
 */
export function encodeRouteParam(param: string): string {
  return param.replaceAll('/', ROUTE_SEGMENT_SLASH_ESCAPE)
}

/** Decode Astro route params and restore escaped taxonomy slashes. */
export function decodeRouteParam(param?: string): string {
  if (!param) {
    return ''
  }

  return param
    .split('/')
    .map(segment => {
      try {
        return decodeURIComponent(segment)
      } catch {
        return segment
      }
    })
    .join('/')
    .replaceAll(ROUTE_SEGMENT_SLASH_ESCAPE, '/')
}
