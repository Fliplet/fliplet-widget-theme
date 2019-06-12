const createClass = function (value) {
  if (value) {
    return `fl-col-${value}`
  }
  return ''
}

export default createClass