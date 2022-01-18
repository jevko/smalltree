export const astToXml7 = (ast) => {
  return recur(ast)
}
const recur = (ast) => {
  const {subvalues, suffix} = ast

  let ret = ''
  if (subvalues.length > 0) {
    for (let i = 0; i < subvalues.length; ++i) {
      let attrs = '', content = ''
      const {prefix, value} = subvalues[i]
      const [pre, tag, post] = trim(prefix)
  
      if (tag === '') { 
        ret += recur(value)
        continue
      }
  
      let hasAttrs = false  
      for (let j = 0; j < post.length; ++j) {
        if (isWhitespace(post[j]) === false) {
          hasAttrs = true
          break
        }
      }
  
      if (hasAttrs) {
        attrs += post + `="${astToAttrValue(value)}"`
        ++i
        for (; i < subvalues.length; ++i) {
          const {prefix, value} = subvalues[i]
          const [pre, tag, post] = trim(prefix)
          if (tag === '') break
          attrs += prefix + `="${astToAttrValue(value)}"`
        }
      }
  
      content += recur(subvalues[i].value)

      ret += `${pre}<${tag}${attrs}`
      
      if (content === '') ret += '/>'
      else ret += `>${content}</${tag}>`
    }
  }
  ret += suffix
  return ret
}
const astToAttrValue = (ast) => {
  const {subvalues, suffix} = ast
  if (subvalues.length > 0) throw Error('expected 0 subvalues')
  return suffix.replaceAll('"', '&quot;')
}
const trim = (prefix) => {
  let i = 0, j = 0
  for (; i < prefix.length; ++i) {
    if (isWhitespace(prefix[i]) === false) break
  }
  for (j = i; j < prefix.length; ++j) {
    if (isWhitespace(prefix[j])) break
  }
  return [prefix.slice(0, i), prefix.slice(i, j), prefix.slice(j)]
}
const isWhitespace = (c) => {
  return ' \n\r\t'.includes(c)
}