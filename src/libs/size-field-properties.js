const sizeProperties = {
  'withoutAuto': ['px', 'em', 'rem', '%'],
  'lineHeight': ['x', 'px', 'em', 'rem', '%'],
  'withAuto': ['px', 'em', 'rem', '%', 'auto', { name: 'none', value: 'initial' }],
  'withNone': ['px', 'em', 'rem', '%', 'none'],
  'full': ['px', 'em', 'rem', '%', 'vw', 'vh', 'auto'],
  'zIndex': ['auto', 'index']
}

const subtypes = {
  'all-props': 'full',
  'font': 'withoutAuto',
  'width': 'withAuto',
  'max-width': 'withNone',
  'height': 'withAuto',
  'max-height': 'withNone',
  'padding': 'withoutAuto',
  'margin': 'withAuto',
  'position': 'withAuto',
  'border': 'withoutAuto',
  'shadow': 'withoutAuto',
  'line-height': 'lineHeight',
  'z-index': 'zIndex'
}

const propertiesMap = {
  properties: sizeProperties,
  types: subtypes
}

export default propertiesMap