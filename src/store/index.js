import bus from '../libs/bus'

export const state = {
  themeInstance: undefined,
  activeTheme: undefined,
  fonts: {
    web: [],
    custom: []
  },
  widgetMode: false,
  widgetId: undefined,
  appearanceGroupOverlay: {},
  isSaving: false,
  dataToSave: [],
  componentContext: 'Mobile',
  savedFields: {
    values: [],
    widgetInstances: []
  },
  widgetData: undefined
}

// Public functions
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

export function resetStylesToTheme(widgetId, appearanceGroup) {
  _.remove(state.savedFields.widgetInstances, { id: widgetId })
  removeWidgetFromInstance(widgetId)
  updateWidgetData({
    appearanceGroup: appearanceGroup,
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

export function removeWidgetFromInstance(id) {
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

export function setWidgetId(id) {
  state.widgetId = parseInt(id, 10)
}

export function setWidgetMode(value) {
  state.widgetMode = value
}

export function openAppearanceGroupSettings(overlayName = '', options) {
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

  state.appearanceGroupOverlay = overlay
  bus.$emit('group-overlay-opened')
}

export function updateWidgetData(data) {
  state.appearanceGroupOverlay.data = data
}

export function closeAppearanceGroupSettings() {
  state.appearanceGroupOverlay = {}
}

export function saveFieldData(data) {
  state.dataToSave.push(_.pick(data, ['name', 'value']))
  emitSavedData()
}

export function toggleSavingStatus(toggle) {
  if (typeof toggle !== 'undefined') {
    state.isSaving = toggle
    return
  }
  
  state.isSaving = !state.isSaving
}

export function clearDataToSave(data) {
  state.dataToSave.splice(0, state.dataToSave.length)
}

export function getFieldName(field) {
  const fieldName = state.componentContext === 'Mobile'
    ? field.name
    : field.breakpoints[state.componentContext.toLowerCase()].name

  return fieldName
}

export function checkIsFieldChanged(field) {
  let widgetIndex
  let fieldIndex

  if (state.widgetMode) {
    widgetIndex = _.findIndex(state.savedFields.widgetInstances, (widget) => {
      if (widget) {
        let foundValue = false
        for (const key in widget.values) {
          if (key == field.name) {
            foundValue = true
            continue
          }
        }
        return foundValue
      }

      state.themeInstance.settings.values
    })

    if (!widgetIndex || widgetIndex < 0) {
      widgetIndex = _.findIndex(state.themeInstance.settings.widgetInstances, (widget) => {
        if (widget) {
          let foundValue = false
          for (const key in widget.values) {
            if (key == field.name) {
              foundValue = true
              continue
            }
          }
          return foundValue
        }
      })
    }
  } else {
    fieldIndex = _.findIndex(state.savedFields.values, (value) => {
      return value && value.name === field.name
    })

    if (!fieldIndex || fieldIndex < 0) {
      for (const key in state.themeInstance.settings.values) {
        if (key == field.name) {
          fieldIndex = 1
          continue
        }
      }
    }
  }

  return widgetIndex > -1 || fieldIndex > -1
}

export function checkSavedValue(field, returnAll) {
  const fieldName = state.componentContext === 'Mobile'
    ? field.name
    : field.breakpoints[state.componentContext.toLowerCase()].name

  const generalSavedValue = state.themeInstance.settings
    && state.themeInstance.settings.values
    && state.themeInstance.settings.values[fieldName]
  const savedLocalField = _.find(state.savedFields.values, { name: fieldName })

  const widgetFound = _.find(state.themeInstance.settings.widgetInstances, { id: state.widgetId })
  const localWidgetFound = _.find(state.savedFields.widgetInstances, { id: state.widgetId })
  const widgetSavedValue = widgetFound ? widgetFound.values[fieldName] : undefined
  const widgetLocalSavedValue = localWidgetFound ? localWidgetFound.values[fieldName] : undefined

  const defaultValue = state.componentContext === 'Mobile'
    ? field.default
    : field.breakpoints[state.componentContext.toLowerCase()].default

  const value = state.widgetMode
    ? widgetLocalSavedValue
      ? widgetLocalSavedValue
      : widgetSavedValue
        ? widgetSavedValue
        : savedLocalField
          ? savedLocalField.value
          : generalSavedValue || defaultValue
    : savedLocalField ? savedLocalField.value : generalSavedValue || defaultValue

  if (!returnAll) {
    return value
  }

  return {
    fieldValue: value,
    generalSavedValue: generalSavedValue,
    generalLocalSavedValue: savedLocalField ? savedLocalField.value : undefined,
    widgetSavedValue: widgetSavedValue,
    widgetLocalSavedValue: widgetLocalSavedValue,
    defaultValue: defaultValue
  }
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

export function checkMarginLogic(fieldConfig, value, fromLoadNotMobile) {
  if (fieldConfig.hasOwnProperty('logic')) {
    const fieldsArray = []
    const notMobile = state.componentContext == 'Tablet' || state.componentContext == 'Desktop' ? true : false

    if (value == 'custom') {
      fieldConfig.logic[value].forEach((fieldName) => {
        fieldsArray.push(fieldName)
      })
      bus.$emit('check-margin-field-visibility', fieldsArray, value)
    } else {
      for (const prop in fieldConfig.logic) {
        // skip loop if the property is from prototype
        if (prop === value) {
          for (const key in fieldConfig.logic[prop]) {
            const newObj = {
              name: key + (notMobile ? state.componentContext : ''),
              value: fieldConfig.logic[prop][key]
            }
            fieldsArray.push(key)
            if (!fromLoadNotMobile) {
              bus.$emit('field-saved', [newObj])
            }
          }
          bus.$emit('check-margin-field-visibility', fieldsArray, value)
          continue
        }
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

// Private functions
function emitSavedData() {
  bus.$emit('field-saved', state.dataToSave)
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
    if (state.widgetMode) {
      // Try to find the value in the local saved widget values
      const foundWidgetValue = _.find(state.savedFields.widgetInstances, { id: state.widgetId })
      foundValue = foundWidgetValue ? foundWidgetValue.values[variableName] : undefined
      if (foundValue) {
        return checkFieldValue(foundValue, field)
      }

      // Try to find the value in the theme instance saved widget values
      const foundWidget = _.find(state.themeInstance.settings.widgetInstances, { id: state.widgetId })
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
      const foundWidgetValue = _.find(state.savedFields.widgetInstances, { id: state.widgetId })
      foundValue = foundWidgetValue ? foundWidgetValue.values[tempVariableName] : undefined
      if (foundValue) {
        return checkFieldValue(foundValue, field)
      }

      // Try to find the value in the theme instance saved widget values
      const foundWidget = _.find(state.themeInstance.settings.widgetInstances, { id: state.widgetId })
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

  if (state.widgetMode) {
    // Try to find the value in the local saved widget values
    const foundWidgetValue = _.find(state.savedFields.widgetInstances, { id: state.widgetId })
    foundValue = foundWidgetValue ? foundWidgetValue.values[inherit === 'mobile' ? field.name : field.breakpoints[inherit].name] : undefined
    if (foundValue) {
      return checkFieldValue(foundValue, field)
    }

    // Try to find the value in the theme instance saved widgets
    const foundWidget = _.find(state.themeInstance.settings.widgetInstances, { id: state.widgetId })
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