import bus from '../libs/bus'

const debouncedSave = _.debounce(emitSavedData, 500)

export const state = {
  themeInstance: undefined,
  activeTheme: undefined,
  fonts: {
    web: [],
    custom: []
  },
  componentOverlay: {},
  dataToSave: undefined,
  componentContext: 'Mobile',
  savedFields: {
    values: []
  }
}

export function setSavedFields(data) {
  state.savedFields = _.assignIn({}, state.savedFields, data)
}

export function setNewSavedValues(data) {
  data = data || []
  data.forEach(function (value) {
    state.savedFields.values.push(value)
  })
}

export function removeSavedValues(data) {
  data = data || []
  data.forEach(function (valueName) {
    const valueIndex = _.findIndex(state.savedFields.values, { name: valueName })
    if (typeof valueIndex !== 'undefined') {
      // Removes from local saved values
      state.savedFields.values.splice(valueIndex, 1)
    }
    // Removes from instance saved values
    delete state.themeInstance.settings.values[valueName]
  })
}

export function setComponentContext(context) {
  state.componentContext = context
}

export function setThemeInstance(instance) {
  state.themeInstance = instance
}

export function setActiveTheme(theme) {
  state.activeTheme = theme
}

export function setWebFonts(fonts) {
  state.fonts.web = fonts
}

export function setCustomFonts(fonts) {
  state.fonts.custom = fonts
}

export function openComponentSettings(overlayName = '', options) {
  options = options || {}

  if (overlayName === '') {
    return
  }

  const overlay = {
    name: overlayName,
    context: state.componentContext,
    isOpen: overlayName !== '',
    data: options
  }

  state.componentOverlay = overlay
  bus.$emit('component-overlay-opened')
}

export function closeComponentSettings() {
  state.componentOverlay = {}
}

function emitSavedData() {
  bus.$emit('field-saved', state.dataToSave)
}

export function saveFieldData(data) {
  state.dataToSave = _.pick(data, ['name', 'value'])
  debouncedSave()
}

export function getFieldName(field) {
  const fieldName = state.componentContext === 'Mobile'
    ? field.name
    : field.breakpoints[state.componentContext.toLowerCase()].name

  return fieldName
}

function checkFieldValue(value, field) {
  let foundValue
  let defaultValue
  // Checks if the UI tab selected is Mobile or not
  const isMobile = state.componentContext === 'Mobile'
  // Checks if the value matches a variable name
  const matchVariable = typeof value === 'string' ? value.match(/^\$([A-z0-9]+)$/) : undefined
  // If the value matches to a variable get the name of the variable
  const variableName = matchVariable && matchVariable.length ? matchVariable[1] : undefined
  // Checks if the value matches the 'inherit-x' reserved key
  const matchInherit = typeof value === 'string' ? value.match(/^inherit-([a-z]+)$/) : undefined
  // If the value matches the 'inherit-x' reserved key get the inheritance key
  const inherit = matchInherit && matchInherit.length ? matchInherit[1] : undefined

  if ((!variableName && !inherit) || (variableName === value || inherit === value)) {
    // If the value is not a variable
    return value
  }
  
  // If value is a variable name
  if (variableName) {
    // Try to find the value in the local saved values
    foundValue = _.find(state.savedFields.values, { name: variableName })
    if (foundValue) {
      return checkFieldValue(foundValue.value, field)
    }

    // Try to find the value in the theme instance saved values
    const savedValues = state.themeInstance.settings.values
    foundValue = savedValues[variableName]
    if (foundValue) {
      return checkFieldValue(foundValue, field)
    }

    // Try to find the value in the theme json configuration
    state.activeTheme.settings.configuration.some((config) => {
      return config.variables.some((variable) => {
        return variable.fields.some((field) => {
          if (field.name === variableName) {
            value = field.default
            return true; // short circuit
          } else {
            if (field.breakpoints.tablet.name === variableName) {
              value = field.breakpoints.tablet.default
              return true; // short circuit
            }
            if (field.breakpoints.desktop.name === variableName) {
              value = field.breakpoints.desktop.default
              return true; // short circuit
            }

            return;
          }
        })
      })
    })

    return checkFieldValue(value, field)
  }

  // If value is not an inheritance key return
  if (!inherit) { return }

  foundValue = _.find(state.savedFields.values, { name: (inherit === 'mobile' ? field.name : field.breakpoints[inherit].name) })
  if (foundValue) {
    return checkFieldValue(foundValue.value,  field)
  }

  // Try to find the value in the theme instance saved values
  const savedValues = state.themeInstance.settings.values
  foundValue = savedValues[(inherit === 'mobile' ? field.name : field.breakpoints[inherit].name)]
  if (foundValue) {
    return checkFieldValue(foundValue, field)
  }

  return checkFieldValue((inherit === 'mobile' ? field.default : field.breakpoints[inherit].default), field)
}

export function getDefaultFieldValue(field) {
  // Variables to use later down
  let defaultValue
  // Checks if the UI tab selected is Mobile or not
  const isMobile = state.componentContext === 'Mobile'

  // Gets the value based on which tab the user is (Mobile, Tablet or Desktop)
  defaultValue = isMobile
    ? field.default
    : field.breakpoints[state.componentContext.toLowerCase()].default

  return checkFieldValue(defaultValue, field)
}