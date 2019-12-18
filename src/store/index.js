import deviceTypes from '../libs/device-types'
import migrationObject from '../libs/migration-object'
import bus from '../libs/bus'

const DEFAULT_INTERACT_VERSION = '2.0'

export const state = {
  themeInstance: undefined,
  activeTheme: undefined,
  fonts: {
    web: [],
    custom: []
  },
  widgetMode: false,
  widgetId: undefined,
  widgetUUID: undefined,
  appearanceGroupOverlay: {},
  isSaving: false,
  dataToSave: [],
  componentContext: 'Mobile',
  activeTab: 0,
  savedFields: {
    values: [],
    widgetInstances: []
  },
  widgetData: undefined,
  widgetIsFlexChild: false
}

// Public functions

/**
* Saved the widget data into store
* @param {Object} Widget data object
*   General styles: Contains "activeTab", "id", "version", "package" properties
*   Widget styles: Contains the same as above, plus "widgetInstanceId", "widgetPackage"
*/
export function handleWidgetData(data) {
  state.widgetData = data

  if (typeof data.activeTab !== 'undefined') {
    setActiveTab(data.activeTab)
    deviceTypes[data.activeTab]
    setComponentContext(deviceTypes[data.activeTab].name)
  }
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
  bus.$emit('component-context-changed')
}

export function setActiveTab(tab) {
  state.activeTab = tab
}

/**
* Saves the theme instance into the store
* @param {Object} Object of the theme instance
*/
export function setThemeInstance(options) {
  options = options || {}
  state.themeInstance = options.widgetInstance

  // Run migration of old variables
  const migration = migrateOldVariables(state.themeInstance.settings.values)

  // If migration done save values
  if (migration.migrated) {
    state.themeInstance.settings.values = migration.data
    bus.$emit('values-migrated')
  }

  if (options.preventRecompute) {
    return
  }

  // Forces all fields to be recomputed with the latest saved values
  bus.$emit('saved-fields-set')
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
* Saves the widget uuid into the store
* @param {String} String of the widget uuid
*/
export function setWidgetUUID(uuid) {
  state.widgetUUID = uuid
}

/**
* Sets a state to flag if the widget is a child of a flexbox container
* @param {Boolean}
*/
export function setParentFlex(value) {
  state.widgetIsFlexChild = typeof value !== 'undefined'
    ? value
    : state.widgetData.parentIsFlex
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
  const fieldName = state.componentContext === 'Mobile' || field.isQuickSetting
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
          if (key === field.name) {
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
            if (key === field.name) {
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
        if (key === field.name) {
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
export function getSavedValue(field, returnAll, context) {
  context = context || state.componentContext
  context = context.toLowerCase()

  const fieldName = context === 'mobile' || field.isQuickSetting
    ? field.name
    : field.breakpoints[context].name

  const generalSavedValue = state.themeInstance.settings
    && state.themeInstance.settings.values
    && state.themeInstance.settings.values[fieldName]
  const savedLocalField = _.find(state.savedFields.values, { name: fieldName })

  const widgetFound = _.find(state.themeInstance.settings.widgetInstances, { id: state.widgetId })
  const localWidgetFound = _.find(state.savedFields.widgetInstances, { id: state.widgetId })
  const widgetSavedValue = widgetFound ? widgetFound.values[fieldName] : undefined
  const widgetLocalSavedValue = localWidgetFound ? localWidgetFound.values[fieldName] : undefined

  const defaultValue = context === 'mobile' || field.isQuickSetting
    ? field.default
    : field.breakpoints[context].default

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
* Gets the current value for the specific field, it can be a saved value or the default value
* @param {Object} Object of the field JSON configuration
* @return {String} The default value of the field
*/
export function getCurrentFieldValue(field) {
  // Variables to use later down
  let defaultValue
  let savedValue
  // Checks if the UI tab selected is Mobile or not
  const isMobile = state.componentContext === 'Mobile'

  // Gets the value based on which tab the user is (Mobile, Tablet or Desktop)
  defaultValue = isMobile || field.isQuickSetting
    ? field.default
    : field.breakpoints[state.componentContext.toLowerCase()].default

  savedValue = getSavedValue(field)

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
    const notMobile = state.componentContext === 'Tablet' || state.componentContext === 'Desktop' ? true : false

    if (value === 'custom') {
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
* @param {Array} Array of variables from the theme configuration
* @return {String || Array} Name of context it is inheriting from
*/
export function getInheritance(variables) {
  switch(state.componentContext) {
    case 'Desktop':
      if (!variables) {
        return 'tablet'
      }

      const newArr = []
      variables.forEach((variable) => {
        const fields = _.filter(variable.fields, { inheriting: true })
        if (fields.length) {
          let inheritingFrom = []
          fields.forEach((field) => {
            inheritingFrom.push(field.inheritingFrom)
          })

          inheritingFrom = _.uniq(inheritingFrom)
          if (inheritingFrom.indexOf('tablet') > -1) {
            newArr.push('tablet')
            return
          }

          newArr.push('mobile')
          return
        }

        newArr.push('tablet')
      })

      return newArr
      break;
    default:
      return 'mobile'
  }
}

/**
* Send the CSS properties to the iframe
* @param {String} The value of the field being changed
*/
export function sendCssToFrame(value, currentField) {
  if (!value || !currentField) {
    return
  }

  const configurations = state.activeTheme.settings.configuration
  const cssProperties = []
  const styles = currentField.styles || []
  let savedWidgetFound = _.find(state.themeInstance.settings.widgetInstances, (widget) => {
    return !!widget.values[currentField.name]
  })
  let localSavedWidgetFound = _.find(state.savedFields.widgetInstances, (widget) => {
    return !!widget.values[currentField.name]
  })

  // If there is a "styles" key
  styles.forEach((css) => {
    const widgetSelector = state.widgetMode
      ? currentField.name === 'Accordion'
        ? `[data-collapse-id='${state.widgetId}']` : `[data-id='${state.widgetId}']`
      : savedWidgetFound || localSavedWidgetFound
        ? `:not([data-id='${localSavedWidgetFound ? localSavedWidgetFound.id : savedWidgetFound.id}'])`
        : ''

    const preparedStyles = prepareStyles(css, value, widgetSelector, currentField)
    preparedStyles.forEach((styles) => {
      cssProperties.push(styles)
    })
  })

  const dependenciesFound = findDependencies(configurations, currentField)

  dependenciesFound.forEach((field) => {
    const fieldStyles = field.styles || []
    fieldStyles.forEach((style) => {
      savedWidgetFound = _.find(state.themeInstance.settings.widgetInstances, (widget) => {
        return !!widget.values[field.name]
      })
      localSavedWidgetFound = _.find(state.savedFields.widgetInstances, (widget) => {
        return !!widget.values[field.name]
      })

      const savedValues = getSavedValue(field, true)

      if (savedValues.generalSavedValue
        || savedValues.generalLocalSavedValue
        || savedValues.widgetSavedValue
        || savedValues.widgetLocalSavedValue) {
        return
      }

      // Add depending fields to changing array of properties
      const widgetSelector = state.widgetMode
        ? currentField.name === 'Accordion'
          ? `[data-collapse-id="${state.widgetId}"]` : `[data-id="${state.widgetId}"]`
        : savedWidgetFound || localSavedWidgetFound
          ? currentField.name === 'Accordion'
            ? `:not([data-collapse-id="${localSavedWidgetFound ? localSavedWidgetFound.id : savedWidgetFound.id}"]) `
            : `:not([data-id="${localSavedWidgetFound ? localSavedWidgetFound.id : savedWidgetFound.id}"]) `
          : ''

      const preparedStyles = prepareStyles(style, value, widgetSelector, currentField)
      preparedStyles.forEach((styles) => {
        cssProperties.push(styles)
      })
    })
  })

  Fliplet.Studio.emit('page-preview-send-event', {
    type: 'inlineCss',
    cssProperties: cssProperties
  })
}

/**
* Function to handle migration of old variables to new variables
* @param {String} The type of migration needed
* @param {Object} Saved theme values
* @return {Object} Final theme values
*/
export function migrateOldVariables(data) {
  let migrated = []
  data = _.cloneDeep(data)

  _.forIn(data, (value, key) => {
    let preventDelete = false

    if(!migrationObject[key]) {
      return
    }

    if (typeof migrationObject[key] === 'string') {
      data[migrationObject[key]] = value
      migrated.push(true)
      delete data[key]
    }

    if (_.isArray(migrationObject[key])) {
      migrationObject[key].forEach((val) => {
        data[val] = value
      })
      migrated.push(true)
      delete data[key]
    }

    if (_.isPlainObject(migrationObject[key])) {
      if (value === 'none') {
        data[migrationObject[key].none] = value
        preventDelete = migrationObject[key].none === key || migrationObject[key].keep
      } else {
        let borderArray

        if (value.indexOf('rgb') > -1) {
          borderArray = value.match(/\w+(\(.*?\))?/g)
        } else {
          borderArray = value.split(' ')
        }

        migrationObject[key].values.forEach((val, index) => {
          if (!val) {
            return
          }

          data[val] = borderArray[index]
          data[migrationObject[key].none] = 'all'
          preventDelete = val === key || migrationObject[key].keep
        })
      }
      migrated.push(!preventDelete)

      if (!preventDelete) {
        delete data[key]
      }
    }
  })

  return {
    migrated: migrated.indexOf(true) > -1,
    data: data
  }
}

export function appSupportsContainer() {
  const appSettings = Fliplet.Env.get('appSettings')
  return parseInt(_.get(appSettings, 'interactVersion', DEFAULT_INTERACT_VERSION), 10) > 2
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

function findDependencies(configurations, currentField) {
  const result = []

  function recursiveFind(cField) {
    configurations.forEach((config) => {
      config.variables.forEach((variable) => {
        variable.fields.forEach((field) => {
          const inheritingVariable = isInheriting(field.default);

          if (!inheritingVariable || inheritingVariable !== cField.name) {
            return
          }

          result.push(field)
          recursiveFind(field)
        })
      })
    })
  }
	
  recursiveFind(currentField)
  return result
}

/**
* Check if it is inheriting from another variable
* @param {String} Default value of a field
*/
function isInheriting(value) {
  if (!value) {
    return false
  }
  // Checks if the value matches a variable name
  const matchVariable = typeof value === 'string' ? value.match(/^\$([A-z0-9]+)$/) : undefined
  // If the value matches to a variable get the name of the variable
  const variableName = matchVariable && matchVariable.length ? matchVariable[1] : undefined

  return variableName ? variableName : false
}

/**
* Compile the CSS 'box-shadow' values
* @param {Object} Object with the styles configuration
* @param {String} The value of the field being changed
* @param {Object} Object of the current field being changed
* @return {String | Boolean} Returns a string of the compiled values, or returns 'false'
*/
function compileShadowValues(styles, value, currentField) {
  if (!styles.siblings) {
    return false
  }

  if (value === 'none') {
    return value
  }

  let newValue = ''
  const configurations = state.activeTheme.settings.configuration
  configurations.forEach((config) => {
    config.variables.forEach((variable) => {
      variable.fields.some((field) => {
        for (const key in styles.siblings) {
          if (styles.siblings[key] === field.name) {
            if (styles.siblings[key] === currentField.name) {
              if (value === 'outset') {
                break
              }

              newValue += " " + checkFieldValue(value, currentField)
              break
            }

            const fieldValue = getSavedValue(field)
            const finalValue = checkFieldValue(fieldValue, field)

            if (finalValue === 'outset') {
              break
            }

            newValue += " " + finalValue
            break
          }
        }

        return
      })
    })
  })

  return newValue.trim()
}

/**
* Compile the CSS 'border' values
* @param {Object} Object with the styles configuration
* @param {String} The value of the field being changed
* @param {Object} Object of the current field being changed
* @return {String | Boolean} Returns a string of the compiled values, or returns 'false'
*/
function compileBorderValues(styles, value, currentField) {
  if (!styles.siblings) {
    return false
  }

  const newValue = {
    property: '',
    value: ''
  }
  
  const configurations = state.activeTheme.settings.configuration
  configurations.forEach((config) => {
    config.variables.forEach((variable) => {
      variable.fields.some((field) => {
        for (const key in styles.siblings) {
          if (styles.siblings[key] === field.name) {
            if (key === 'sides') {
              if (styles.siblings[key] === currentField.name) {
                newValue.property = checkFieldValue(value, currentField)
                break
              }

              const fieldValue = getSavedValue(field)
              newValue.property = checkFieldValue(fieldValue, field)
              break
            }

            if (styles.siblings[key] === currentField.name) {
              newValue.value += " " + checkFieldValue(value, currentField)
              break
            }

            const fieldValue = getSavedValue(field)
            const finalValue = checkFieldValue(fieldValue, field)

            newValue.value += " " + finalValue
            break
          }
        }

        return
      })
    })
  })

  newValue.value = newValue.value.trim()
  return newValue
}

/**
* Compile the CSS 'position' values
* @param {Object} Object with the styles configuration
* @param {Object} Object of the current field being changed
* @return {Array} Returns an array of the positions CSS properties
*/
function compilePositionValues(styles, currentField) {
  if (!styles.siblings) {
    return false
  }

  const positionProperties = {}
  
  const configurations = state.activeTheme.settings.configuration
  configurations.forEach((config) => {
    config.variables.forEach((variable) => {
      variable.fields.some((field) => {
        for (const key in styles.siblings) {
          if (styles.siblings[key] === field.name) {
            const fieldValue = getSavedValue(field)
            const value = checkFieldValue(fieldValue, field)
            switch (key) {
              case 'top':
                positionProperties['top'] = value
                break
              case 'right':
                positionProperties['right'] = value
                break
              case 'bottom':
                positionProperties['bottom'] = value
                break
              case 'left':
               positionProperties['left'] = value
                break
              default:
            }
            break
          }
        }
        return
      })
    })
  })

  return positionProperties
}

/**
* Prepares the selectors, properties and values to be sent to interact.js
* @param {Object} Object with the selectors and properties to by modified
* @param {String} The value to be modified
* @param {String} String of widget ID selector
* @return {Array} Array of all the compiled selectors and properties with the value
*/
function prepareStyles(styles, value, widgetSelector, currentField) {
  if (!styles || !value || typeof widgetSelector === 'undefined') {
    return []
  }

  styles.parentSelector = styles.parentSelector || ''
  styles.selectors = styles.selectors || ''
  let newValue
  const cssProperties = []
  const selectors = {
    selector: undefined,
    properties: {}
  }

  if (Array.isArray(styles.selectors)) {
    styles.selectors.forEach((sel) => {
      // Reset properties object
      selectors.properties = {}
      const selector = styles.parentSelector
        ? (styles.parentSelector + widgetSelector + ' ' + sel).trim()
        : widgetSelector
          ? ('div' + widgetSelector + ' ' + sel + ', ' + 'span' + widgetSelector + ' ' + sel).trim()
          : sel
      selectors.selector = selector

      switch (styles.type) {
        case 'border':
          newValue = compileBorderValues(styles, value, currentField)

          switch(newValue.property) {
            case 'all':
              selectors.properties['border'] = newValue.value
              break
            case 'top':
              selectors.properties['border-top'] = newValue.value
              selectors.properties['border-right'] = 'none'
              selectors.properties['border-bottom'] = 'none'
              selectors.properties['border-left'] = 'none'
              break
            case 'right':
              selectors.properties['border-top'] = 'none'
              selectors.properties['border-right'] = newValue.value
              selectors.properties['border-bottom'] = 'none'
              selectors.properties['border-left'] = 'none'
              break
            case 'bottom':
              selectors.properties['border-top'] = 'none'
              selectors.properties['border-right'] = 'none'
              selectors.properties['border-bottom'] = newValue.value
              selectors.properties['border-left'] = 'none'
              break
            case 'left':
              selectors.properties['border-top'] = 'none'
              selectors.properties['border-right'] = 'none'
              selectors.properties['border-bottom'] = 'none'
              selectors.properties['border-left'] = newValue.value
              break
            default:
              selectors.properties['border'] = 'none'
          }

          if (styles.ignore) {
            selectors.ignore = styles.ignore
          }

          cssProperties.push(selectors)
          return cssProperties
          break
        case 'shadow':
          newValue = compileShadowValues(styles, value, currentField)
          break
        case 'position':
          const positions = compilePositionValues(styles, currentField)

          switch (value) {
            case 'relative':
              selectors.properties['position'] = value
              for (const key in positions) {
                selectors.properties[key] = 'auto'
              }
              break
            case 'fixed':
            case 'absolute':
              selectors.properties['position'] = value
              for (const key in positions) {
                selectors.properties[key] = positions[key]
              }
              break
            default:
          }

          if (styles.ignore) {
            selectors.ignore = styles.ignore
          }

          cssProperties.push(selectors)
          return cssProperties
          break
        case 'margin':
          switch (value) {
            case 'left':
              selectors.properties['margin-left'] = '0px'
              selectors.properties['margin-right'] = 'auto'
              break
            case 'right':
              selectors.properties['margin-left'] = 'auto'
              selectors.properties['margin-right'] = '0px'
              break
            case 'center':
              selectors.properties['margin-left'] = 'auto'
              selectors.properties['margin-right'] = 'auto'
              break
            default:
          }

          if (styles.ignore) {
            selectors.ignore = styles.ignore
          }

          cssProperties.push(selectors)
          return cssProperties
          break
        case 'height':
          styles.preSelectors.forEach((preSelector) => {
            selectors.selector = preSelector.selector + ' ' + selector
            switch (preSelector.type) {
              case 'top':
                selectors.properties['height'] = 'calc(' + value + ' - 44px)'
                break
              case 'bottom':
                selectors.properties['height'] = 'calc(' + value + ' - 65px)'
                break
              case 'top-with-notch':
                selectors.properties['height'] = 'calc(' + value + ' - (44px + 34px))'
                break
              case 'bottom-with-notch':
                selectors.properties['height'] = 'calc(' + value + ' - (65px + 34px))'
                break
              default:
            }

            if (styles.ignore) {
              selectors.ignore = styles.ignore
            }

            const newSelectors = _.clone(selectors)
            cssProperties.push(newSelectors)
          })

          return cssProperties
          break
        default:
          newValue = undefined
      }

      value = newValue || checkFieldValue(value, currentField)
      styles.properties.forEach((prop) => {
        selectors.properties[prop] = value
      })

      if (styles.ignore) {
        selectors.ignore = styles.ignore
      }

      const newSelectors = _.clone(selectors)
      cssProperties.push(newSelectors)
    })
  } else {
    const selector = styles.parentSelector
      ? (styles.parentSelector + widgetSelector + ' ' + styles.selectors).trim()
      : widgetSelector
        ? ('div' + widgetSelector + ' ' + styles.selectors + ', ' + 'span' + widgetSelector + ' ' + styles.selectors).trim()
        : styles.selectors
    selectors.selector = selector

    switch (styles.type) {
      case 'border':
        newValue = compileBorderValues(styles, value, currentField)

        switch(newValue.property) {
          case 'all':
            selectors.properties['border'] = newValue.value
            break
          case 'top':
            selectors.properties['border-top'] = newValue.value
            selectors.properties['border-right'] = 'none'
            selectors.properties['border-bottom'] = 'none'
            selectors.properties['border-left'] = 'none'
            break
          case 'right':
            selectors.properties['border-top'] = 'none'
            selectors.properties['border-right'] = newValue.value
            selectors.properties['border-bottom'] = 'none'
            selectors.properties['border-left'] = 'none'
            break
          case 'bottom':
            selectors.properties['border-top'] = 'none'
            selectors.properties['border-right'] = 'none'
            selectors.properties['border-bottom'] = newValue.value
            selectors.properties['border-left'] = 'none'
            break
          case 'left':
            selectors.properties['border-top'] = 'none'
            selectors.properties['border-right'] = 'none'
            selectors.properties['border-bottom'] = 'none'
            selectors.properties['border-left'] = newValue.value
            break
          default:
            selectors.properties['border'] = 'none'
        }

        if (styles.ignore) {
          selectors.ignore = styles.ignore
        }

        cssProperties.push(selectors)
        return cssProperties
        break
      case 'shadow':
        newValue = compileShadowValues(styles, value, currentField)
        break
      case 'position':
        const positions = compilePositionValues(styles, currentField)

        switch (value) {
          case 'relative':
            selectors.properties['position'] = value
            for (const key in positions) {
              selectors.properties[key] = 'auto'
            }
            break
          case 'fixed':
          case 'absolute':
            selectors.properties['position'] = value
            for (const key in positions) {
              selectors.properties[key] = positions[key]
            }
            break
          default:
        }

        if (styles.ignore) {
          selectors.ignore = styles.ignore
        }

        cssProperties.push(selectors)
        return cssProperties
        break
      case 'margin':
        switch (value) {
          case 'left':
            selectors.properties['margin-left'] = '0px'
            selectors.properties['margin-right'] = 'auto'
            break
          case 'right':
            selectors.properties['margin-left'] = 'auto'
            selectors.properties['margin-right'] = '0px'
            break
          case 'center':
            selectors.properties['margin-left'] = 'auto'
            selectors.properties['margin-right'] = 'auto'
            break
          default:
        }

        if (styles.ignore) {
          selectors.ignore = styles.ignore
        }

        cssProperties.push(selectors)
        return cssProperties
        break
      case 'height':
        styles.preSelectors.forEach((preSelector) => {
          selectors.selector = preSelector.selector + ' ' + selector
          switch (preSelector.type) {
            case 'top':
              selectors.properties['height'] = 'calc(' + value + ' - 44px)'
              break
            case 'bottom':
              selectors.properties['height'] = 'calc(' + value + ' - 65px)'
              break
            case 'top-with-notch':
              selectors.properties['height'] = 'calc(' + value + ' - (44px + 34px))'
              break
            case 'bottom-with-notch':
              selectors.properties['height'] = 'calc(' + value + ' - (65px + 34px))'
              break
            default:
          }

          if (styles.ignore) {
            selectors.ignore = styles.ignore
          }

          const newSelectors = _.clone(selectors)
          cssProperties.push(newSelectors)
        })

        return cssProperties
        break
      default:
        newValue = undefined
    }

    value = newValue || checkFieldValue(value, currentField)
    styles.properties.forEach((prop) => {
      selectors.properties[prop] = value
    })

    if (styles.ignore) {
      selectors.ignore = styles.ignore
    }

    const newSelectors = _.clone(selectors)
    cssProperties.push(newSelectors)
  }

  return cssProperties
}

/**
* Checks the field value to determine if it should inherit and gets the final value
* @param {String} The initial field
* @param {Object} Object of the field JSON configuration
* @return {String} Final field value
*/
function checkFieldValue(value, field) {
  if (!value) {
    return
  }

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
          } else if (f.breakpoints) {
            if (f.breakpoints.tablet.name === variableName) {
              value = f.breakpoints.tablet.default
              return true; // short circuit
            }
            if (f.breakpoints.desktop.name === variableName) {
              value = f.breakpoints.desktop.default
              return true; // short circuit
            }

            return;
          } else {
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
    foundValue = foundWidgetValue ? foundWidgetValue.values[inherit === 'mobile' || field.isQuickSetting ? field.name : field.breakpoints[inherit].name] : undefined
    if (foundValue) {
      return checkFieldValue(foundValue, field)
    }

    // Try to find the value in the theme instance saved widgets
    const foundWidget = _.find(state.themeInstance.settings.widgetInstances, { id: state.widgetId })
    foundValue = foundWidget ? foundWidget.values[inherit === 'mobile' || field.isQuickSetting ? field.name : field.breakpoints[inherit].name] : undefined
    if (foundValue) {
      return checkFieldValue(foundValue, field)
    }
  }

  foundValue = _.find(state.savedFields.values, { name: (inherit === 'mobile' || field.isQuickSetting ? field.name : field.breakpoints[inherit].name) })
  if (foundValue) {
    return checkFieldValue(foundValue.value,  field)
  }

  // Try to find the value in the theme instance saved values
  const savedValues = state.themeInstance.settings.values
  foundValue = savedValues ? savedValues[(inherit === 'mobile' || field.isQuickSetting ? field.name : field.breakpoints[inherit].name)] : undefined
  if (foundValue) {
    return checkFieldValue(foundValue, field)
  }

  return checkFieldValue((inherit === 'mobile' || field.isQuickSetting ? field.default : field.breakpoints[inherit].default), field)
}