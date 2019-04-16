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

/**
* Saved the widget data into store
* @param {Object} Widget data object
*   General styles: Contains "activeTab", "id", "version", "package" properties
*   Widget styles: Contains the same as above, plus "widgetInstanceId", "widgetPackage"
*/
export function setWidgetData(data) {
  state.widgetData = data
}

/**
* Saves new changed fields into store
* @param {Object} Object containing the two arrays
*/
export function setSavedFields(data) {
  state.savedFields = _.assignIn({}, state.savedFields, data)
  bus.$emit('saved-fields-set')
}

/**
* Prepares data from widget styles to be added to the general styles
* @param {Number} Widget id
*/
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

/**
* Resets all the styles the user changed on a widget back to the general theme defaults
* @param {Number} Widget id
* @param {Object} The appearance group of fields
*/
export function resetStylesToTheme(widgetId, appearanceGroup) {
  _.remove(state.savedFields.widgetInstances, { id: widgetId })
  removeWidgetFromInstance(widgetId)
  updateWidgetData({
    appearanceGroup: appearanceGroup,
    instance: state.themeInstance
  })
  bus.$emit('variables-computed')
}

/**
* Saves the tab context into the store
* @param {String} The name of the tab context can contain the words: "Mobile", "Tablet", "Desktop"
*/
export function setComponentContext(context) {
  state.componentContext = context
}

/**
* Saves the theme instance into the store
* @param {Object} Object of the theme instance
*/
export function setThemeInstance(instance) {
  state.themeInstance = instance
}

/**
* Saves the theme into the store
* @param {Object} Object of the theme
*/
export function setActiveTheme(theme) {
  state.activeTheme = theme
}

/**
* Saves the the web safe fonts into the store
* @param {Array} Array of font names
*/
export function setWebFonts(fonts) {
  state.fonts.web = fonts
}

/**
* Saves the custom fonts (user uploaded fonts) into the store
* @param {Array} Array of font names
*/
export function setCustomFonts(fonts) {
  state.fonts.custom = fonts
}

/**
* Saves the widget id into the store
* @param {String} Number as string of the widget id
*/
export function setWidgetId(id) {
  state.widgetId = parseInt(id, 10)
}

/**
* Sets a state to flag if the UI is from a specific widget
* @param {Boolean}
*/
export function setWidgetMode(value) {
  state.widgetMode = value
}

/**
* Opens the appearance group settings overlay
* @param {String} Name of the group settings
* @param {Object} Object with the group settings and the theme instance
*/
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

/**
* Closes the appearance group settings overlay
*/
export function closeAppearanceGroupSettings() {
  state.appearanceGroupOverlay = {}
}

/**
* Pushes the new data of a single field into an array of data to save
* @param {Object} Name and Value of the field the user changed
*/
export function saveFieldData(data) {
  state.dataToSave.push(_.pick(data, ['name', 'value']))
  emitSavedData()
}

/**
* Sets flag for saving spinner
* @param {Boolean}
* @return null
*/
export function toggleSavingStatus(toggle) {
  if (typeof toggle !== 'undefined') {
    state.isSaving = toggle
    return
  }
  
  state.isSaving = !state.isSaving
}

/**
* Clears the array of data to save
*/
export function clearDataToSave() {
  state.dataToSave.splice(0, state.dataToSave.length)
}

/**
* Gets the field CSS variable based on the tab context the user is
* @param {Object} Object of the field JSON configuration
* @return {String} CSS variable name
*/
export function getFieldName(field) {
  const fieldName = state.componentContext === 'Mobile'
    ? field.name
    : field.breakpoints[state.componentContext.toLowerCase()].name

  return fieldName
}

/**
* Gets the field CSS variable based on the tab context the user is
* @param {Object} Object of the field JSON configuration
* @return {Boolean}
*/
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

/**
* Gets the value saved for the specific field
* @param {Object} Object of the field JSON configuration
* @param {Boolean} Boolean to determine if it should return more values
* @return {String} The value saved
* @return {Object} Object with all the saved values including the default value
*/
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

/**
* Gets the default value for the specific field
* @param {Object} Object of the field JSON configuration
* @return {String} The default value of the field
*/
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

/**
* Gets the logic object of the field
* @param {Object} Object of the field JSON configuration
* @param {String} String of the value choosen by the user
* @return {Object} Return by "bus.$emit" the object containing the logic based on the value selected
*/
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

/**
* Gets the logic object of the margin alignment field
* @param {Object} Object of the field JSON configuration
* @param {String} String of the value choosen by the user
* @param {Boolean} Flag to determine if function is called from loading
* @return {Object} Return by "bus.$emit" the object containing the logic based on the value selected
*/
export function checkMarginLogic(fieldConfig, value, fromLoad) {
  if (fieldConfig.hasOwnProperty('logic')) {
    const fieldsArray = []
    const notMobile = state.componentContext == 'Tablet' || state.componentContext == 'Desktop' ? true : false

    if (value == 'custom') {
      fieldConfig.logic[value].forEach((fieldName) => {
        fieldsArray.push(fieldName)
      })
      bus.$emit('check-margin-field', fieldsArray, value)
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
            if (!fromLoad) {
              bus.$emit('field-saved', [newObj])
            }
          }
          bus.$emit('check-margin-field', fieldsArray, value)
          continue
        }
      }
    }
  }
}

/**
* Sets the margin-align field to "custom"
* @param {Object} Object of the field JSON configuration
*/
export function checkSizeLogic(fieldConfig) {
  if (fieldConfig.hasOwnProperty('logic')) {
    const newObj = {
      name: fieldConfig.logic,
      value: 'custom'
    }
    bus.$emit('field-saved', [newObj])
  }
}

/**
* Gets the inheritance context
* @return {String} Name of context it is inheriting from
*/
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

function removeWidgetFromInstance(id) {
  _.remove(state.themeInstance.settings.widgetInstances, { id: id })
}

function updateWidgetData(data) {
  state.appearanceGroupOverlay.data = data
}

/**
* Checks the field value to determine if it should inherit and gets the final value
* @param {String} The initial field
* @param {Object} Object of the field JSON configuration
* @return {String} Final field value
*/
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