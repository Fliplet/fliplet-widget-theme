import deviceTypes from '../libs/device-types';
import migrationMapping from '../libs/migration-object';
import bus from '../libs/bus';

const DEFAULT_INTERACT_VERSION = '2.0';

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
};

// Public functions

/**
* Saved the widget data into store
* @param {Object} Widget data object
*   General styles: Contains "activeTab", "id", "version", "package" properties
*   Widget styles: Contains the same as above, plus "widgetInstanceId", "widgetPackage"
*/

export function handleWidgetData(data) {
  let getWidgetAttributes = Promise.resolve();

  state.widgetData = data;

  if (data.widgetInstanceId) {
    getWidgetAttributes = Fliplet.Widget.getAttributes(data.widgetInstanceId)
      .then(function(attributes) {
        state.widgetData.widgetLayout = attributes.layout;
      });
  }

  if (typeof data.activeTab !== 'undefined') {
    setActiveTab(data.activeTab);
    deviceTypes[data.activeTab];
    setComponentContext(deviceTypes[data.activeTab].name);
  }

  return getWidgetAttributes;
}

/**
* Saves new changed fields into store
* @param {Object} Object containing the two arrays
*/

export function setSavedFields(data) {
  const backgroundType = _.find(data.values, { name: 'containerBackgroundType' });

  state.savedFields = _.assignIn({}, state.savedFields, data);
  _.forEach(state.savedFields.values, function(item, index) {
    switch (item.name) {
      case 'containerBackgroundImage':
        if (backgroundType?.value === 'Color' || backgroundType?.value === 'None') {
          state.savedFields.values[index].value = 'none';
        }

        break;
      case 'containerBackgroundColor':
        if (backgroundType?.value === 'Image' || backgroundType?.value === 'None') {
          delete state.savedFields.values[index].value;
        }

        break;
      default:
        break;
    }
  });

  _.forEach(state.savedFields.widgetInstances, function(item, index) {
    if (item.id === state.widgetId) {
      state.savedFields.widgetInstances[index].values = getBackgroundValues(state.savedFields.widgetInstances[index].values);

      return;
    }
  });

  bus.$emit('saved-fields-set');
}

export function getBackgroundValues(values) {
  switch (values.containerBackgroundType) {
    case 'Color':
      delete values.containerBackgroundImage;
      break;
    case 'Image':
      delete values.containerBackgroundColor;
      break;
    case 'None':
      delete values.containerBackgroundColor;
      delete values.containerBackgroundImage;
      break;
    default:
      break;
  }

  return values;
}

/**
* Prepares data from widget styles to be added to the general styles
* @param {Number} Widget id
*/

export function prepareSettingsForTheme(id) {
  // Find the saved values
  const localSavedWidget = _.find(state.savedFields.widgetInstances, { id: id });
  const localValues = localSavedWidget ? localSavedWidget.values : [];
  const instanceSavedWidget = _.find(state.themeInstance.settings.widgetInstances, { id: id });
  const instanceValues = instanceSavedWidget ? instanceSavedWidget.values : [];
  const foundValues = _.merge(instanceValues, localValues);

  const arrayOfValues = [];
  const data = {};

  // Construct a new array of objects
  for (var property in foundValues) {
    if (Object.prototype.hasOwnProperty.call(foundValues, property)) {
      const newObj = {
        name: property,
        value: foundValues[property]
      };

      arrayOfValues.push(newObj);
    }
  }

  data.values = arrayOfValues;
  setSavedFields(data);
}

/**
* Resets all the styles the user changed on a widget back to the general theme defaults
* @param {Number} Widget id
* @param {Object} The appearance group of fields
*/

export function resetStylesToTheme(widgetId, appearanceGroup) {
  _.remove(state.savedFields.widgetInstances, { id: widgetId });
  removeWidgetFromInstance(widgetId);
  updateWidgetData({
    appearanceGroup: appearanceGroup,
    instance: state.themeInstance
  });
  bus.$emit('variables-computed');
}

/**
* Saves the tab context into the store
* @param {String} The name of the tab context can contain the words: "Mobile", "Tablet", "Desktop"
*/

export function setComponentContext(context) {
  state.componentContext = context;
  bus.$emit('component-context-changed');
}

export function setActiveTab(tab) {
  state.activeTab = tab;
}

/**
* Saves the theme instance into the store
* @param {Object} Object of the theme instance
*/

export function setThemeInstance(options) {
  options = options || {};
  state.themeInstance = options.widgetInstance;

  // Run migration of old variables
  const migration = migrateOldVariables(state.themeInstance.settings.values);

  // If migration done save values
  if (Object.keys(migration.migrated).length) {
    // Prevent pre-migration data from being saved again
    state.savedFields.values = migration.data;
    // Update instance settings
    state.themeInstance.settings.values = migration.data;
    bus.$emit('values-migrated');
  }

  if (options.preventRecompute) {
    return;
  }

  // Forces all fields to be recomputed with the latest saved values
  bus.$emit('saved-fields-set');
}

/**
* Saves the theme into the store
* @param {Object} Object of the theme
*/

export function setActiveTheme(theme) {
  state.activeTheme = theme;
}

/**
* Saves the the web safe fonts into the store
* @param {Array} Array of font names
*/

export function setWebFonts(fonts) {
  state.fonts.web = fonts;
}

/**
* Saves the custom fonts (user uploaded fonts) into the store
* @param {Array} Array of font names
*/

export function setCustomFonts(fonts) {
  state.fonts.custom = fonts;
}

/**
* Saves the widget id into the store
* @param {String} Number as string of the widget id
*/

export function setWidgetId(id) {
  state.widgetId = parseInt(id, 10);
}

/**
* Saves the widget uuid into the store
* @param {String} String of the widget uuid
*/

export function setWidgetUUID(uuid) {
  state.widgetUUID = uuid;
}

/**
* Sets a state to flag if the widget is a child of a flexbox container
* @param {Boolean}
*/

export function setParentFlex(value) {
  state.widgetIsFlexChild = typeof value !== 'undefined'
    ? value
    : state.widgetData.parentIsFlex;
}

/**
* Sets a state to flag if the UI is from a specific widget
* @param {Boolean}
*/

export function setWidgetMode(value) {
  state.widgetMode = value;
}

/**
* Opens the appearance group settings overlay
* @param {String} Name of the group settings
* @param {Object} Object with the group settings and the theme instance
*/

export function openAppearanceGroupSettings(overlayName = '', options) {
  options = options || {};

  if (overlayName === '') {
    return;
  }

  const overlay = {
    name: overlayName,
    context: state.componentContext,
    isOpen: overlayName !== '',
    data: options
  };

  state.appearanceGroupOverlay = overlay;
  bus.$emit('group-overlay-opened');
}

/**
* Closes the appearance group settings overlay
*/

export function closeAppearanceGroupSettings() {
  state.appearanceGroupOverlay = {};
}

/**
* Pushes the new data of a single field into an array of data to save
* @param {Object} Name and Value of the field the user changed
*/

export function saveFieldData(data) {
  if (Array.isArray(data)) {
    _.forEach(data, (dataObject) => {
      state.dataToSave.push(_.pick(dataObject, ['name', 'value']));
    });
  } else {
    state.dataToSave.push(_.pick(data, ['name', 'value']));
  }

  emitSavedData();
}

/**
* Sets flag for saving spinner
* @param {Boolean}
* @return null
*/

export function toggleSavingStatus(toggle) {
  if (typeof toggle !== 'undefined') {
    state.isSaving = toggle;

    return;
  }

  state.isSaving = !state.isSaving;
}

/**
* Clears the array of data to save
*/

export function clearDataToSave() {
  state.dataToSave.splice(0, state.dataToSave.length);
}

/**
* Gets the field CSS variable based on the tab context the user is
* @param {Object} Object of the field JSON configuration
* @return {String} CSS variable name
*/

export function getFieldName(field) {
  const fieldName = state.componentContext === 'Mobile' || field.isQuickSetting
    ? field.name
    : field.breakpoints[state.componentContext.toLowerCase()].name;

  return fieldName;
}

/**
* Gets the field names given the context
* @param {Object} Object containing the field JSON configuration and the context
* @return {String} CSS variable name
*/

export function getFieldNameByContext(options) {
  options = options || {
    field: {},
    context: ''
  };

  const fieldName = options.context.toLowerCase() === 'mobile' || options.field.isQuickSetting
    ? options.field.name
    : options.field.breakpoints[options.context.toLowerCase()].name;

  return fieldName;
}

/**
* Gets the field CSS variable based on the tab context the user is
* @param {Object} Object of the field JSON configuration
* @return {Boolean}
*/

export function checkIsFieldChanged(field) {
  let widgetIndex;
  let fieldIndex;

  if (state.widgetMode) {
    widgetIndex = _.findIndex(state.savedFields.widgetInstances, (widget) => {
      if (widget) {
        let foundValue = false;

        for (const key in widget.values) {
          if (key === field.name) {
            foundValue = true;
            continue;
          }
        }

        return foundValue;
      }

      state.themeInstance.settings.values;
    });

    if (!widgetIndex || widgetIndex < 0) {
      widgetIndex = _.findIndex(state.themeInstance.settings.widgetInstances, (widget) => {
        if (widget) {
          let foundValue = false;

          for (const key in widget.values) {
            if (key === field.name) {
              foundValue = true;
              continue;
            }
          }

          return foundValue;
        }
      });
    }
  } else {
    fieldIndex = _.findIndex(state.savedFields.values, (value) => {
      return value && value.name === field.name;
    });

    if (!fieldIndex || fieldIndex < 0) {
      for (const key in state.themeInstance.settings.values) {
        if (key === field.name) {
          fieldIndex = 1;
          continue;
        }
      }
    }
  }

  return widgetIndex > -1 || fieldIndex > -1;
}

export function getWidgetSavedValue(options) {
  options = options || {};

  if ((options.type === 'settings' && !options.savedValues)
    || (options.type === 'local' && !options.localSavedValues)) {
    return false;
  }

  options.inheriting = !!options.inheriting;

  switch (options.context) {
    case 'desktop':
    case 'tablet':
      if (
        (options.type === 'settings' && !options.savedValues[options.fieldName])
        || (options.type === 'local'
          && !options.localSavedValues[options.fieldName]
          && !options.savedValues[options.fieldName])
      ) {
        options.context = options.context === 'desktop' ? 'tablet' : 'mobile';
        options.fieldName = options.context === 'mobile' || options.field.isQuickSetting
          ? options.field.name
          : options.field.breakpoints[options.context].name;
        options.inheriting = true;

        return getWidgetSavedValue(options);
      }

      break;
    default:
      break;
  }

  return {
    value: options[options.type === 'settings'
      ? 'savedValues'
      : 'localSavedValues'][options.fieldName],
    inheriting: options.inheriting
  };
}

/**
* Gets the value saved for the specific field
* @param {Object} Object of the field JSON configuration
* @param {Boolean} Boolean to determine if it should return more values
* @return {String} The value saved
* @return {Object} Object with all the saved values including the default value
*/

export function getSavedValue(field, returnAll, context) {
  context = context || state.componentContext;
  context = context.toLowerCase();

  const fieldName = context === 'mobile' || field.isQuickSetting
    ? field.name
    : field.breakpoints[context].name;

  const generalSavedValue = state.themeInstance.settings
    && state.themeInstance.settings.values
    && state.themeInstance.settings.values[fieldName];
  const savedLocalField = _.find(state.savedFields.values, { name: fieldName });

  const widgetFound = _.find(state.themeInstance.settings.widgetInstances, { id: state.widgetId });
  const localWidgetFound = _.find(state.savedFields.widgetInstances, { id: state.widgetId });

  const widgetSavedData = getWidgetSavedValue({
    type: 'settings',
    savedValues: _.get(widgetFound, 'values', {}),
    localSavedValues: _.get(localWidgetFound, 'values', {}),
    field,
    context,
    fieldName
  });
  const widgetLocalSavedData = getWidgetSavedValue({
    type: 'local',
    savedValues: _.get(widgetFound, 'values', {}),
    localSavedValues: _.get(localWidgetFound, 'values', {}),
    field,
    context,
    fieldName
  });

  const defaultValue = context === 'mobile' || field.isQuickSetting
    ? field.default
    : field.breakpoints[context].default;

  let value;

  if (state.widgetMode) {
    if (widgetLocalSavedData && widgetLocalSavedData.value) {
      value = widgetLocalSavedData.value;
    } else if (widgetSavedData && widgetSavedData.value) {
      value = widgetSavedData.value;
    } else if (savedLocalField) {
      value = savedLocalField.value;
    } else {
      value = generalSavedValue || defaultValue;
    }
  } else {
    value = savedLocalField ? savedLocalField.value : generalSavedValue || defaultValue;
  }

  if (!returnAll) {
    return value;
  }

  return {
    fieldValue: value,
    generalSavedValue: generalSavedValue,
    generalLocalSavedValue: savedLocalField ? savedLocalField.value : undefined,
    widgetSavedValue: widgetSavedData && widgetSavedData.value,
    widgetSavedValueInheriting: widgetSavedData && widgetSavedData.inheriting,
    widgetLocalSavedValue: widgetLocalSavedData && widgetLocalSavedData.value,
    widgetLocalSavedValueInheriting: widgetLocalSavedData && widgetLocalSavedData.inheriting,
    defaultValue: defaultValue
  };
}

/**
* Gets the current value for the specific field, it can be a saved value or the default value
* @param {Object} Object of the field JSON configuration
* @return {String} The default value of the field
*/

export function getCurrentFieldValue(field) {
  // Variables to use later down
  let defaultValue;
  let savedValue;
  // Checks if the UI tab selected is Mobile or not
  const isMobile = state.componentContext === 'Mobile';

  // Gets the value based on which tab the user is (Mobile, Tablet or Desktop)
  defaultValue = isMobile || field.isQuickSetting
    ? field.default
    : field.breakpoints[state.componentContext.toLowerCase()].default;

  savedValue = getSavedValue(field);

  return checkFieldValue(savedValue || defaultValue, field);
}

/**
* Gets the logic object of the field
* @param {Object} Object of the field JSON configuration
* @param {String} String of the value chosen by the user
* @return {Object} Return by "bus.$emit" the object containing the logic based on the value selected
*/

export function checkLogic(fieldConfig, value) {
  if (fieldConfig.hasOwnProperty('logic')) {
    for (const prop in fieldConfig.logic) {
      // skip loop if the property is from prototype
      if (prop === value) {
        bus.$emit('check-field-visibility', fieldConfig, fieldConfig.logic[prop]);
        continue;
      }
    }
  }
}

export function setInstanceValue(settings) {
  state.themeInstance.settings = _.cloneDeep(settings);
}

/**
* Gets the logic object of the margin alignment field
* @param {Object} Object of the field JSON configuration
* @param {String} String of the value chosen by the user
* @param {Boolean} Flag to determine if function is called from loading
* @return {Object} Return by "bus.$emit" the object containing the logic based on the value selected
*/

export function checkMarginLogic(fieldConfig, value, fromLoad) {
  if (fieldConfig.hasOwnProperty('logic')) {
    const fieldsArray = [];
    const notMobile = state.componentContext === 'Tablet' || state.componentContext === 'Desktop' ? true : false;

    if (value === 'custom') {
      fieldConfig.logic[value].forEach((fieldName) => {
        fieldsArray.push(fieldName);
      });
      bus.$emit('check-margin-field', fieldsArray, value);
    } else {
      for (const prop in fieldConfig.logic) {
        // skip loop if the property is from prototype
        if (prop === value) {
          for (const key in fieldConfig.logic[prop]) {
            if (Object.prototype.hasOwnProperty.call(fieldConfig.logic[prop], key)) {
              const newObj = {
                name: key + (notMobile ? state.componentContext : ''),
                value: fieldConfig.logic[prop][key]
              };

              fieldsArray.push(key);

              if (!fromLoad) {
                bus.$emit('field-saved', [newObj]);
              }
            }
          }

          bus.$emit('check-margin-field', fieldsArray, value);
          continue;
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
    };

    bus.$emit('field-saved', [newObj]);
  }
}

/**
* Gets the inheritance context
* @param {Array} Array of variables from the theme configuration
* @return {String || Array} Name of context it is inheriting from
*/

export function getInheritance(variables) {
  switch (state.componentContext) {
    case 'Desktop': {
      if (!variables) {
        return 'tablet';
      }

      const newArr = [];

      variables.forEach((variable) => {
        const fields = _.filter(variable.fields, { inheriting: true });

        if (fields.length) {
          let inheritingFrom = [];

          fields.forEach((field) => {
            inheritingFrom.push(field.inheritingFrom);
          });

          inheritingFrom = _.uniq(inheritingFrom);

          if (inheritingFrom.indexOf('tablet') > -1) {
            newArr.push('tablet');

            return;
          }

          newArr.push('mobile');

          return;
        }

        newArr.push('tablet');
      });

      return newArr;
    }

    default:
      return 'mobile';
  }
}

/**
* Send the CSS properties to the iframe
* @param {String} The value of the field being changed
*/

export function sendCssToFrame(value, currentField) {
  if (!value || !currentField) {
    return;
  }

  const configurations = state.activeTheme.settings.configuration;
  const cssProperties = [];
  const styles = currentField.styles || [];
  let savedWidgetFound = _.find(state.themeInstance.settings.widgetInstances, (widget) => {
    return !!widget.values[currentField.name];
  });
  let localSavedWidgetFound = _.find(state.savedFields.widgetInstances, (widget) => {
    return !!widget.values[currentField.name];
  });

  // If there is a "styles" key
  styles.forEach((css) => {
    let widgetSelector;

    if (state.widgetMode) {
      widgetSelector = currentField.name === 'Accordion' ? `[data-collapse-id='${state.widgetId}']` : `[data-id='${state.widgetId}']`;
    } else if (savedWidgetFound || localSavedWidgetFound) {
      widgetSelector = `:not([data-id='${localSavedWidgetFound ? localSavedWidgetFound.id : savedWidgetFound.id}'])`;
    } else {
      widgetSelector = '';
    }

    const preparedStyles = prepareStyles(css, value, widgetSelector, currentField);

    preparedStyles.forEach((styles) => {
      cssProperties.push(styles);
    });
  });

  const dependenciesFound = findDependencies(configurations, currentField);

  dependenciesFound.forEach((field) => {
    const fieldStyles = field.styles || [];

    fieldStyles.forEach((style) => {
      savedWidgetFound = _.find(state.themeInstance.settings.widgetInstances, (widget) => {
        return !!widget.values[field.name];
      });
      localSavedWidgetFound = _.find(state.savedFields.widgetInstances, (widget) => {
        return !!widget.values[field.name];
      });

      const savedValues = getSavedValue(field, true);

      if (savedValues.generalSavedValue
        || savedValues.generalLocalSavedValue
        || savedValues.widgetSavedValue
        || savedValues.widgetLocalSavedValue) {
        return;
      }

      // Add depending fields to changing array of properties
      let widgetSelector;

      if (state.widgetMode) {
        widgetSelector = currentField.name === 'Accordion' ? `[data-collapse-id="${state.widgetId}"]` : `[data-id="${state.widgetId}"]`;
      } else if (savedWidgetFound || localSavedWidgetFound) {
        widgetSelector = currentField.name === 'Accordion' ? `:not([data-collapse-id="${localSavedWidgetFound ? localSavedWidgetFound.id : savedWidgetFound.id}"]) ` : `:not([data-id="${localSavedWidgetFound ? localSavedWidgetFound.id : savedWidgetFound.id}"]) `;
      } else {
        widgetSelector = '';
      }

      const preparedStyles = prepareStyles(style, value, widgetSelector, currentField);

      preparedStyles.forEach((styles) => {
        cssProperties.push(styles);
      });
    });
  });

  if (currentField.name === 'containerBackgroundColor') {
    _.forEach(cssProperties, (css, index) => {
      if (_.has(css.properties, 'background-color')) {
        cssProperties[index].properties['background-image'] = 'none';

        return false;
      }
    });
  }

  if (currentField.name === 'containerBackgroundImage') {
    let bgc;

    _.forEach(state.appearanceGroupOverlay.data.appearanceGroup.variables, function(variable) {
      if (variable.description === 'Background') {
        bgc = _.find(variable.fields, { name: 'containerBackgroundColor' });

        return false;
      }
    });
    _.forEach(cssProperties, (css, index) => {
      if (_.has(css.properties, 'background-image')) {
        cssProperties[index].properties['background-color'] = getCurrentFieldValue({
          ...bgc,
          inheritingFrom: currentField.inheritingFrom
        });

        return false;
      }
    });
  }

  Fliplet.Studio.emit('page-preview-send-event', {
    type: 'inlineCss',
    cssProperties: cssProperties
  });
}

/**
* Function to handle migration of old variables to new variables
* @param {Object} data - Saved theme values
* @return {Object} Final theme values
*/
export function migrateOldVariables(data) {
  const migrated = {};

  data = _.cloneDeep(data);

  _.forIn(data, (value, key) => {
    // Key doesn't need migrating
    if (!migrationMapping[key]) {
      return;
    }

    // Key needs to map to another key
    if (typeof migrationMapping[key] === 'string') {
      // Migrate value if the saved data doesn't already have a value for the key
      if (_.isNil(data[migrationMapping[key]])) {
        migrated[migrationMapping[key]] = value;
      }

      delete data[key];
    }

    // Key needs to map to a list of keys
    if (_.isArray(migrationMapping[key])) {
      migrationMapping[key].forEach((k) => {
        // Saved data already has a value for the key
        if (!_.isNil(data[k])) {
          return;
        }

        migrated[k] = value;
      });

      delete data[key];
    }

    // Key needs to be mapped based on an object configuration
    if (_.isPlainObject(migrationMapping[key])) {
      // Mapping behavior based on the value being "none"
      if (value === 'none') {
        // Only map the value if the saved data doesn't already have a value for the mapped key
        if (_.isNil(data[migrationMapping[key].none])) {
          migrated[migrationMapping[key].none] = value;
        }
      } else {
        let values;

        if (value.indexOf('rgb') > -1) {
          values = value.match(/\w+(\(.*?\))?/g);
        } else {
          values = value.split(' ');
        }

        // Migration is mapping to a single value, so standardize to use a "values" array instead
        if (typeof migrationMapping[key].values === 'undefined'
          && typeof migrationMapping[key].value === 'string') {
          migrationMapping[key].values = [migrationMapping[key].value];
        }

        migrationMapping[key].values.forEach((k, index) => {
          if (!k) {
            return;
          }

          // Only map the value if the saved data doesn't already have a value for the mapped key
          if (_.isNil(data[k])) {
            migrated[k] = values[index];
          }
        });

        if (migrationMapping[key].none && data[migrationMapping[key].none] !== 'all') {
          migrated[migrationMapping[key].none] = 'all';
        }
      }

      if (!migrationMapping[key].keep) {
        delete data[key];
      }
    }
  });

  return {
    migrated: migrated,
    data: _.assign({}, data, migrated)
  };
}

export function appSupportsContainer() {
  const appSettings = Fliplet.Env.get('appSettings');

  return parseInt(_.get(appSettings, 'interactVersion', DEFAULT_INTERACT_VERSION), 10) > 2;
}

// Private functions
function emitSavedData() {
  bus.$emit('field-saved', state.dataToSave);
}

function removeWidgetFromInstance(id) {
  _.remove(state.themeInstance.settings.widgetInstances, { id: id });
}

function updateWidgetData(data) {
  state.appearanceGroupOverlay.data = data;
}

function findDependencies(configurations, currentField) {
  const result = [];

  function recursiveFind(cField) {
    configurations.forEach((config) => {
      config.variables.forEach((variable) => {
        variable.fields.forEach((field) => {
          const inheritingVariable = isInheriting(field.default);

          if (!inheritingVariable || inheritingVariable !== cField.name || currentField.default !== field.default) {
            return;
          }

          result.push(field);
          recursiveFind(field);
        });
      });
    });
  }

  recursiveFind(currentField);

  return result;
}

/**
* Check if it is inheriting from another variable
* @param {String} Default value of a field
*/

function isInheriting(value) {
  if (!value) {
    return false;
  }

  // Checks if the value matches a variable name
  const matchVariable = typeof value === 'string' ? value.match(/^\$([A-z0-9]+)$/) : undefined;
  // If the value matches to a variable get the name of the variable
  const variableName = matchVariable && matchVariable.length ? matchVariable[1] : undefined;

  return variableName ? variableName : false;
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
    return false;
  }

  if (value === 'none') {
    return value;
  }

  let newValue = '';
  const configurations = state.activeTheme.settings.configuration;

  configurations.forEach((config) => {
    config.variables.forEach((variable) => {
      variable.fields.some((field) => {
        for (const key in styles.siblings) {
          if (styles.siblings[key] === field.name) {
            if (styles.siblings[key] === currentField.name) {
              if (value === 'outset') {
                break;
              }

              newValue += ' ' + checkFieldValue(value, currentField);
              break;
            }

            const fieldValue = getSavedValue(field);
            const finalValue = checkFieldValue(fieldValue, field);

            if (finalValue === 'outset') {
              break;
            }

            newValue += ' ' + finalValue;
            break;
          }
        }

        return;
      });
    });
  });

  return newValue.trim();
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
    return false;
  }

  const newValue = {
    property: '',
    value: ''
  };

  const configurations = state.activeTheme.settings.configuration;

  configurations.forEach((config) => {
    config.variables.forEach((variable) => {
      variable.fields.some((field) => {
        for (const key in styles.siblings) {
          if (styles.siblings[key] === field.name) {
            if (key === 'sides') {
              if (styles.siblings[key] === currentField.name) {
                newValue.property = checkFieldValue(value, currentField);
                break;
              }

              const fieldValue = getSavedValue(field);

              newValue.property = checkFieldValue(fieldValue, field);
              break;
            }

            if (styles.siblings[key] === currentField.name) {
              newValue.value += ' ' + checkFieldValue(value, currentField);
              break;
            }

            const fieldValue = getSavedValue(field);
            const finalValue = checkFieldValue(fieldValue, field);

            newValue.value += ' ' + finalValue;
            break;
          }
        }

        return;
      });
    });
  });

  newValue.value = newValue.value.trim();

  return newValue;
}

/**
* Compile the CSS 'position' values
* @param {Object} Object with the styles configuration
* @param {Object} Object of the current field being changed
* @return {Array} Returns an array of the positions CSS properties
*/

function compilePositionValues(styles) {
  if (!styles.siblings) {
    return false;
  }

  const positionProperties = {};

  const configurations = state.activeTheme.settings.configuration;

  configurations.forEach((config) => {
    config.variables.forEach((variable) => {
      variable.fields.some((field) => {
        for (const key in styles.siblings) {
          if (styles.siblings[key] === field.name) {
            const fieldValue = getSavedValue(field);
            const value = checkFieldValue(fieldValue, field);

            switch (key) {
              case 'top':
                positionProperties['top'] = value;
                break;
              case 'right':
                positionProperties['right'] = value;
                break;
              case 'bottom':
                positionProperties['bottom'] = value;
                break;
              case 'left':
                positionProperties['left'] = value;
                break;
              default:
            }

            break;
          }
        }

        return;
      });
    });
  });

  return positionProperties;
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
    return [];
  }

  styles.parentSelector = styles.parentSelector || '';
  styles.selectors = styles.selectors || '';

  let newValue;
  const cssProperties = [];
  const selectors = {
    selector: undefined,
    properties: {}
  };

  if (Array.isArray(styles.selectors)) {
    styles.selectors.forEach((sel) => {
      // Reset properties object
      selectors.properties = {};

      let selector;

      if (styles.parentSelector) {
        selector = (styles.parentSelector + widgetSelector + ' ' + sel).trim();
      } else {
        selector = widgetSelector ? ('div' + widgetSelector + ' ' + sel + ', ' + 'span' + widgetSelector + ' ' + sel).trim() : sel;
      }

      selectors.selector = selector;

      switch (styles.type) {
        case 'border':
          newValue = compileBorderValues(styles, value, currentField);

          switch (newValue.property) {
            case 'all':
              selectors.properties['border'] = newValue.value;
              break;
            case 'top':
              selectors.properties['border-top'] = newValue.value;
              selectors.properties['border-right'] = 'none';
              selectors.properties['border-bottom'] = 'none';
              selectors.properties['border-left'] = 'none';
              break;
            case 'right':
              selectors.properties['border-top'] = 'none';
              selectors.properties['border-right'] = newValue.value;
              selectors.properties['border-bottom'] = 'none';
              selectors.properties['border-left'] = 'none';
              break;
            case 'bottom':
              selectors.properties['border-top'] = 'none';
              selectors.properties['border-right'] = 'none';
              selectors.properties['border-bottom'] = newValue.value;
              selectors.properties['border-left'] = 'none';
              break;
            case 'left':
              selectors.properties['border-top'] = 'none';
              selectors.properties['border-right'] = 'none';
              selectors.properties['border-bottom'] = 'none';
              selectors.properties['border-left'] = newValue.value;
              break;
            default:
              selectors.properties['border'] = 'none';
          }

          if (styles.ignore) {
            selectors.ignore = styles.ignore;
          }

          cssProperties.push(selectors);

          return cssProperties;
        case 'shadow':
          newValue = compileShadowValues(styles, value, currentField);
          break;

        case 'position': {
          const positions = compilePositionValues(styles, currentField);

          switch (value) {
            case 'relative':
              selectors.properties['position'] = value;

              for (const key in positions) {
                if (Object.prototype.hasOwnProperty.call(positions, key)) {
                  selectors.properties[key] = 'auto';
                }
              }

              break;
            case 'fixed':
            case 'absolute':
              selectors.properties['position'] = value;

              for (const key in positions) {
                if (Object.prototype.hasOwnProperty.call(positions, key)) {
                  selectors.properties[key] = positions[key];
                }
              }

              break;
            default:
          }

          if (styles.ignore) {
            selectors.ignore = styles.ignore;
          }

          cssProperties.push(selectors);

          return cssProperties;
        }

        case 'margin':
          switch (value) {
            case 'left':
              selectors.properties['margin-left'] = '0px';
              selectors.properties['margin-right'] = 'auto';
              break;
            case 'right':
              selectors.properties['margin-left'] = 'auto';
              selectors.properties['margin-right'] = '0px';
              break;
            case 'center':
              selectors.properties['margin-left'] = 'auto';
              selectors.properties['margin-right'] = 'auto';
              break;
            default:
          }

          if (styles.ignore) {
            selectors.ignore = styles.ignore;
          }

          cssProperties.push(selectors);

          return cssProperties;
        case 'height':
          styles.preSelectors.forEach((preSelector) => {
            selectors.selector = preSelector.selector + ' ' + selector;

            switch (preSelector.type) {
              case 'top':
                selectors.properties['height'] = 'calc(' + value + ' - 44px)';
                break;
              case 'bottom':
                selectors.properties['height'] = 'calc(' + value + ' - 65px)';
                break;
              case 'top-with-notch':
                selectors.properties['height'] = 'calc(' + value + ' - (44px + 34px))';
                break;
              case 'bottom-with-notch':
                selectors.properties['height'] = 'calc(' + value + ' - (65px + 34px))';
                break;
              default:
            }

            if (styles.ignore) {
              selectors.ignore = styles.ignore;
            }

            const newSelectors = _.clone(selectors);

            cssProperties.push(newSelectors);
          });

          return cssProperties;
        default:
          newValue = undefined;
      }

      value = newValue || checkFieldValue(value, currentField);
      styles.properties.forEach((prop) => {
        selectors.properties[prop] = value;
      });

      if (styles.ignore) {
        selectors.ignore = styles.ignore;
      }

      const newSelectors = _.clone(selectors);

      cssProperties.push(newSelectors);
    });
  } else {
    let selector;

    if (styles.parentSelector) {
      selector = (styles.parentSelector + widgetSelector + ' ' + styles.selectors).trim();
    } else {
      selector = widgetSelector ? ('div' + widgetSelector + ' ' + styles.selectors + ', ' + 'span' + widgetSelector + ' ' + styles.selectors).trim() : styles.selectors;
    }

    selectors.selector = selector;

    switch (styles.type) {
      case 'border':
        newValue = compileBorderValues(styles, value, currentField);

        switch (newValue.property) {
          case 'all':
            selectors.properties['border'] = newValue.value;
            break;
          case 'top':
            selectors.properties['border-top'] = newValue.value;
            selectors.properties['border-right'] = 'none';
            selectors.properties['border-bottom'] = 'none';
            selectors.properties['border-left'] = 'none';
            break;
          case 'right':
            selectors.properties['border-top'] = 'none';
            selectors.properties['border-right'] = newValue.value;
            selectors.properties['border-bottom'] = 'none';
            selectors.properties['border-left'] = 'none';
            break;
          case 'bottom':
            selectors.properties['border-top'] = 'none';
            selectors.properties['border-right'] = 'none';
            selectors.properties['border-bottom'] = newValue.value;
            selectors.properties['border-left'] = 'none';
            break;
          case 'left':
            selectors.properties['border-top'] = 'none';
            selectors.properties['border-right'] = 'none';
            selectors.properties['border-bottom'] = 'none';
            selectors.properties['border-left'] = newValue.value;
            break;
          default:
            selectors.properties['border'] = 'none';
        }

        if (styles.ignore) {
          selectors.ignore = styles.ignore;
        }

        cssProperties.push(selectors);

        return cssProperties;
      case 'shadow':
        newValue = compileShadowValues(styles, value, currentField);
        break;

      case 'position': {
        const positions = compilePositionValues(styles, currentField);

        switch (value) {
          case 'relative':
            selectors.properties['position'] = value;

            for (const key in positions) {
              if (Object.prototype.hasOwnProperty.call(positions, key)) {
                selectors.properties[key] = 'auto';
              }
            }

            break;
          case 'fixed':
          case 'absolute':
            selectors.properties['position'] = value;

            for (const key in positions) {
              if (Object.prototype.hasOwnProperty.call(positions, key)) {
                selectors.properties[key] = positions[key];
              }
            }

            break;
          default:
        }

        if (styles.ignore) {
          selectors.ignore = styles.ignore;
        }

        cssProperties.push(selectors);

        return cssProperties;
      }

      case 'margin':
        switch (value) {
          case 'left':
            selectors.properties['margin-left'] = '0px';
            selectors.properties['margin-right'] = 'auto';
            break;
          case 'right':
            selectors.properties['margin-left'] = 'auto';
            selectors.properties['margin-right'] = '0px';
            break;
          case 'center':
            selectors.properties['margin-left'] = 'auto';
            selectors.properties['margin-right'] = 'auto';
            break;
          default:
        }

        if (styles.ignore) {
          selectors.ignore = styles.ignore;
        }

        cssProperties.push(selectors);

        return cssProperties;
      case 'height':
        styles.preSelectors.forEach((preSelector) => {
          selectors.selector = preSelector.selector + ' ' + selector;

          switch (preSelector.type) {
            case 'top':
              selectors.properties['height'] = 'calc(' + value + ' - 44px)';
              break;
            case 'bottom':
              selectors.properties['height'] = 'calc(' + value + ' - 65px)';
              break;
            case 'top-with-notch':
              selectors.properties['height'] = 'calc(' + value + ' - (44px + 34px))';
              break;
            case 'bottom-with-notch':
              selectors.properties['height'] = 'calc(' + value + ' - (65px + 34px))';
              break;
            default:
          }

          if (styles.ignore) {
            selectors.ignore = styles.ignore;
          }

          const newSelectors = _.clone(selectors);

          cssProperties.push(newSelectors);
        });

        return cssProperties;
      default:
        newValue = undefined;
    }

    value = newValue || checkFieldValue(value, currentField);
    styles.properties.forEach((prop) => {
      selectors.properties[prop] = value;
    });

    if (styles.ignore) {
      selectors.ignore = styles.ignore;
    }

    const newSelectors = _.clone(selectors);

    cssProperties.push(newSelectors);
  }

  return cssProperties;
}

/**
* Checks the field value to determine if it should inherit and gets the final value
* @param {String} The initial field
* @param {Object} Object of the field JSON configuration
* @return {String} Final field value
*/

function checkFieldValue(value, field) {
  if (!value) {
    return;
  }

  let foundValue;

  // Checks if the value matches a variable name
  const matchVariable = typeof value === 'string' ? value.match(/^\$([A-z0-9]+)$/) : undefined;

  // If the value matches to a variable get the name of the variable
  let variableName = matchVariable && matchVariable.length ? matchVariable[1] : undefined;

  // Checks if the value matches the 'inherit-x' reserved key
  const matchInherit = typeof value === 'string' ? value.match(/^inherit-([a-z]+)$/) : undefined;

  // If the value matches the 'inherit-x' reserved key get the inheritance key
  const inherit = matchInherit && matchInherit.length ? matchInherit[1] : undefined;

  if ((!variableName && !inherit) || (variableName === value || inherit === value)) {
    // If the value is not a variable
    return value;
  }

  // If value is a variable name
  if (variableName) {
    // Try to find the value in the local saved values
    foundValue = _.find(state.savedFields.values, { name: variableName });

    if (foundValue) {
      return checkFieldValue(foundValue.value, field);
    }

    // Try to find the value in the theme instance saved values
    const savedValues = state.themeInstance.settings.values;

    if (savedValues) {
      foundValue = savedValues[variableName];
    }

    if (foundValue) {
      return checkFieldValue(foundValue, field);
    }

    // Try to find the value in the theme json configuration
    state.activeTheme.settings.configuration.some((config) => {
      return config.variables.some((variable) => {
        return variable.fields.some((f) => {
          if (f.name === variableName) {
            value = f.default;

            return true; // short circuit
          } else if (f.breakpoints) {
            if (f.breakpoints.tablet.name === variableName) {
              value = f.breakpoints.tablet.default;

              return true; // short circuit
            }

            if (f.breakpoints.desktop.name === variableName) {
              value = f.breakpoints.desktop.default;

              return true; // short circuit
            }

            return;
          }

          return;
        });
      });
    });

    return checkFieldValue(value, field);
  }

  // If value is not an inheritance key return
  if (!inherit) { return; }

  if (state.widgetMode) {
    // Try to find the value in the local saved widget values
    const foundWidgetValue = _.find(state.savedFields.widgetInstances, { id: state.widgetId });

    foundValue = foundWidgetValue ? foundWidgetValue.values[inherit === 'mobile' || field.isQuickSetting ? field.name : field.breakpoints[inherit].name] : undefined;

    if (foundValue) {
      return checkFieldValue(foundValue, field);
    }

    // Try to find the value in the theme instance saved widgets
    const foundWidget = _.find(state.themeInstance.settings.widgetInstances, { id: state.widgetId });

    foundValue = foundWidget ? foundWidget.values[inherit === 'mobile' || field.isQuickSetting ? field.name : field.breakpoints[inherit].name] : undefined;

    if (foundValue) {
      return checkFieldValue(foundValue, field);
    }
  }

  foundValue = _.find(state.savedFields.values, { name: (inherit === 'mobile' || field.isQuickSetting ? field.name : field.breakpoints[inherit].name) });

  if (foundValue) {
    return checkFieldValue(foundValue.value,  field);
  }

  // Try to find the value in the theme instance saved values
  const savedValues = state.themeInstance.settings.values;

  foundValue = savedValues ? savedValues[(inherit === 'mobile' || field.isQuickSetting ? field.name : field.breakpoints[inherit].name)] : undefined;

  if (foundValue) {
    return checkFieldValue(foundValue, field);
  }

  return checkFieldValue((inherit === 'mobile' || field.isQuickSetting ? field.default : field.breakpoints[inherit].default), field);
}
