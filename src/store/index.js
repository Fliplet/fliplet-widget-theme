import bus from '../libs/bus'

const debouncedSave = _.debounce(emitSavedData, 500)

export const state = {
  themeInstance: undefined,
  activeTheme: undefined,
  fonts: {
    web: [],
    custom: []
  },
  componentMode: false,
  componentId: undefined,
  componentOverlay: {},
  dataToSave: undefined,
  componentContext: 'Mobile',
  savedFields: {
    values: [],
    widgetInstances: []
  },
  widgetData: undefined
}

export function setWidgetData(data) {
  state.widgetData = data
}

export function setSavedFields(data) {
  state.savedFields = _.assignIn({}, state.savedFields, data)
  bus.$emit('saved-fields-set')
}

export function prepareSettingsForTheme(id) {
  // Find the saved values
  const localSavedWidget = _.find(state.savedFields.widgetInstances, { id: id })
  const localValues = localSavedWidget ? localSavedWidget.values : []
  const instaceSavedWidget = _.find(state.themeInstance.settings.widgetInstances, { id: id })
  const instanceValues = instaceSavedWidget ? instaceSavedWidget.values : []
  const foundValues = _.merge(instanceValues, localValues)

  const arrayOfValues = []
  const data = {}

  // Construct a new array of objects
  for (var property in foundValues) {
    const newObj = {
      name: property,
      value: foundValues[property]
    }
    arrayOfValues.push(newObj)
  }

  data.values = arrayOfValues
  setSavedFields(data)
}

export function resetStylesToTheme(componentId, component) {
  _.remove(state.savedFields.widgetInstances, { id: componentId })
  removeComponentFromInstance(componentId)
  updateComponentData({
    component: component,
    instance: state.themeInstance
  })
  bus.$emit('variables-computed')
}

export function setComponentContext(context) {
  state.componentContext = context
}

export function setThemeInstance(instance) {
  state.themeInstance = instance
}

export function removeComponentFromInstance(id) {
  _.remove(state.themeInstance.settings.widgetInstances, { id: id })
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

export function setComponentId(id) {
  state.componentId = parseInt(id, 10)
}

export function setComponentMode(value) {
  state.componentMode = value
}

export function toggleComponentMode() {
  state.componentMode = !state.componentMode
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

export function updateComponentData(data) {
  state.componentOverlay.data = data
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

export function checkSavedValue(field) {
  const isMobile = state.componentContext === 'Mobile'
  const foundField = _.find(state.savedFields.values, { name: (isMobile ? field.name : field.breakpoints[state.componentContext.toLowerCase()].name) })
  const foundWidgetField = _.find(state.savedFields.widgetInstances, { id: state.componentId })
  const foundWidgetFieldValue = foundWidgetField ? foundWidgetField.values[isMobile ? field.name : field.breakpoints[state.componentContext.toLowerCase()].name] : undefined

  if (!foundField && !foundWidgetField && state.componentOverlay.data && state.componentOverlay.data.instance) {
    const savedValues = state.componentOverlay.data.instance.settings.values
    const widgetValues = state.componentOverlay.data.instance.settings.widgetInstances
    const savedWidget = _.find(widgetValues, { id: state.componentId })

    return state.componentMode && savedWidget
      ? state.componentContext !== 'Mobile'
        ? savedWidget.values[field.name + state.componentContext]
        : savedWidget.values[field.name]
      : state.componentContext !== 'Mobile' ? savedValues[field.name + state.componentContext] : savedValues[field.name]
  }

  return state.componentMode
    ? foundWidgetFieldValue
      ? foundWidgetFieldValue
      : foundField ? foundField.value : undefined
    : foundField ? foundField.value : undefined
}

function checkFieldValue(value, field) {
  let foundValue
  let defaultValue
  let tempVariableName
  // Checks if the UI tab selected is Mobile or not
  const isMobile = state.componentContext === 'Mobile'
  // Checks if the value matches a variable name
  const matchVariable = typeof value === 'string' ? value.match(/^\$([A-z0-9]+)$/) : undefined
  // If the value matches to a variable get the name of the variable
  let variableName = matchVariable && matchVariable.length ? matchVariable[1] : undefined
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
    if (state.componentMode) {
      // Try to find the value in the local saved widget values
      const foundWidgetValue = _.find(state.savedFields.widgetInstances, { id: state.componentId })
      foundValue = foundWidgetValue ? foundWidgetValue.values[variableName] : undefined
      if (foundValue) {
        return checkFieldValue(foundValue, field)
      }

      // Try to find the value in the theme instance saved widget values
      const foundWidget = _.find(state.themeInstance.settings.widgetInstances, { id: state.componentId })
      foundValue = foundWidget ? foundWidget.values[variableName] : undefined
      if (foundValue) {
        return checkFieldValue(foundValue, field)
      }

      // If variableName is from another field
      // we assign the field name to proceed to search for it in the saved general values
      tempVariableName = field.name
    }

    if (tempVariableName) {
      // Try to find the value in the local saved widget values
      const foundWidgetValue = _.find(state.savedFields.widgetInstances, { id: state.componentId })
      foundValue = foundWidgetValue ? foundWidgetValue.values[tempVariableName] : undefined
      if (foundValue) {
        return checkFieldValue(foundValue, field)
      }

      // Try to find the value in the theme instance saved widget values
      const foundWidget = _.find(state.themeInstance.settings.widgetInstances, { id: state.componentId })
      foundValue = foundWidget ? foundWidget.values[tempVariableName] : undefined
      if (foundValue) {
        return checkFieldValue(foundValue, field)
      }

      // Try to find the value in the local saved values
      foundValue = _.find(state.savedFields.values, { name: tempVariableName })
      if (foundValue) {
        return checkFieldValue(foundValue.value, field)
      }

      // Try to find the value in the theme instance saved values
      const savedValues = state.themeInstance.settings.values
      if (savedValues) {
        foundValue = savedValues[tempVariableName]
      }
      if (foundValue) {
        return checkFieldValue(foundValue, field)
      }
    }

    // Try to find the value in the local saved values
    foundValue = _.find(state.savedFields.values, { name: variableName })
    if (foundValue) {
      return checkFieldValue(foundValue.value, field)
    }

    // Try to find the value in the theme instance saved values
    const savedValues = state.themeInstance.settings.values
    if (savedValues) {
      foundValue = savedValues[variableName]
    }
    if (foundValue) {
      return checkFieldValue(foundValue, field)
    }

    // Try to find the value in the theme json configuration
    state.activeTheme.settings.configuration.some((config) => {
      return config.variables.some((variable) => {
        return variable.fields.some((f) => {
          if (f.name === variableName) {
            value = f.default
            return true; // short circuit
          } else {
            if (f.breakpoints.tablet.name === variableName) {
              value = f.breakpoints.tablet.default
              return true; // short circuit
            }
            if (f.breakpoints.desktop.name === variableName) {
              value = f.breakpoints.desktop.default
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

  if (state.componentMode) {
    // Try to find the value in the local saved widget values
    const foundWidgetValue = _.find(state.savedFields.widgetInstances, { id: state.componentId })
    foundValue = foundWidgetValue ? foundWidgetValue.values[inherit === 'mobile' ? field.name : field.breakpoints[inherit].name] : undefined
    if (foundValue) {
      return checkFieldValue(foundValue, field)
    }

    // Try to find the value in the theme instance saved widgets
    const foundWidget = _.find(state.themeInstance.settings.widgetInstances, { id: state.componentId })
    foundValue = foundWidget ? foundWidget.values[inherit === 'mobile' ? field.name : field.breakpoints[inherit].name] : undefined
    if (foundValue) {
      return checkFieldValue(foundValue, field)
    }

    if (inherit != 'mobile') {
      return checkFieldValue(field.breakpoints[inherit].default, field)
    }
  }

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
  let savedValue
  // Checks if the UI tab selected is Mobile or not
  const isMobile = state.componentContext === 'Mobile'

  // Gets the value based on which tab the user is (Mobile, Tablet or Desktop)
  defaultValue = isMobile
    ? field.default
    : field.breakpoints[state.componentContext.toLowerCase()].default

  savedValue = field.value || checkSavedValue(field)

  return checkFieldValue(savedValue || defaultValue, field)
}

export function checkLogic(fieldConfig, value) {
  if (fieldConfig.hasOwnProperty('logic')) {
    for (const prop in fieldConfig.logic) {
      // skip loop if the property is from prototype
      if (prop === value) {
        bus.$emit('check-field-visibility', fieldConfig, fieldConfig.logic[prop])
        continue
      }
    }
  }
}

export function getInheritance() {
  switch(state.componentContext) {
    case 'Desktop':
      return 'tablet'
      break;
    case 'Tablet':
      return 'mobile'
      break;
    default:
      ''
  }
}