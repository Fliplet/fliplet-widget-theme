/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/Application.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Application.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_WidgetHeader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/WidgetHeader */ \"./src/components/WidgetHeader.vue\");\n/* harmony import */ var _components_UI_ThemeSelection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/UI/ThemeSelection */ \"./src/components/UI/ThemeSelection.vue\");\n/* harmony import */ var _components_UI_SettingsButtons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/UI/SettingsButtons */ \"./src/components/UI/SettingsButtons.vue\");\n/* harmony import */ var _components_UI_ComponentSettings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/UI/ComponentSettings */ \"./src/components/UI/ComponentSettings.vue\");\n/* harmony import */ var _components_fields_QuickSettings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/fields/QuickSettings */ \"./src/components/fields/QuickSettings.vue\");\n/* harmony import */ var _libs_bus__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./libs/bus */ \"./src/libs/bus.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n// @TODO: Handle errors\n\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {\n      isLoading: true,\n      themes: undefined,\n      fonts: undefined,\n      themeInstance: undefined,\n      activeTheme: undefined,\n      webFonts: undefined,\n      customFonts: undefined,\n      savedFields: []\n    };\n  },\n  components: {\n    WidgetHeader: _components_WidgetHeader__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n    ThemeSelection: _components_UI_ThemeSelection__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n    SettingsButtons: _components_UI_SettingsButtons__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n    ComponentSettings: _components_UI_ComponentSettings__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n    QuickSettings: _components_fields_QuickSettings__WEBPACK_IMPORTED_MODULE_4__[\"default\"]\n  },\n  methods: {\n    initialize: function initialize() {\n      var _this = this;\n\n      // Get themes and fonts simultaneously\n      return Promise.all([this.getThemes(), this.getFonts()]).then(function (response) {\n        _this.themes = response[0];\n        _this.fonts = response[1];\n\n        _this.getThemeInstance();\n      }).catch(function (err) {\n        var error = Fliplet.parseError(err);\n        console.error(error);\n      });\n    },\n    getThemes: function getThemes() {\n      return Fliplet.Themes.get();\n    },\n    getFonts: function getFonts() {\n      return Fliplet.App.Fonts.get();\n    },\n    getThemeInstance: function getThemeInstance() {\n      var _this2 = this;\n\n      var themeWithoutInstances = 0;\n      this.themes.forEach(function (theme) {\n        console.log(theme);\n\n        if (!theme.instances.length) {\n          themeWithoutInstances++;\n          return;\n        }\n\n        _this2.themeInstance = theme.instances[0]; // Get the first instance\n\n        _this2.activeTheme = theme;\n        _this2.webFonts = _.reject(_this2.fonts, function (font) {\n          return font.url;\n        });\n        _this2.customFonts = _.filter(_this2.fonts, function (font) {\n          return font.url;\n        });\n        _this2.isLoading = false;\n      });\n\n      if (themeWithoutInstances == this.themes.length) {\n        // @TODO: Update Fliplet Theme name\n        var flipletTheme = _.find(this.themes, {\n          name: 'Bootstrap'\n        });\n\n        this.createDefaultInstance(flipletTheme.id).then(this.initialize).then(this.reloadPage) // @TODO: Confirm we need this\n        .catch(function (err) {\n          var error = Fliplet.parseError(err);\n          console.error(error);\n        });\n      }\n    },\n    createDefaultInstance: function createDefaultInstance(themeId) {\n      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({\n        method: 'POST',\n        url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),\n        data: {\n          widgetId: !themeId ? undefined : themeId,\n          reuse: true\n        }\n      });\n    },\n    reloadPage: function reloadPage() {\n      Fliplet.Studio.emit('reload-page-preview');\n    },\n    onFieldSave: function onFieldSave(data) {\n      var fieldIndex = _.findIndex(this.savedFields, function (field) {\n        return field && field.name === data.name;\n      });\n\n      if (fieldIndex >= 0) {\n        this.savedFields[fieldIndex].value = data.value;\n      } else {\n        this.savedFields.push(data);\n      }\n    },\n    updateInstance: function updateInstance(dataObj) {\n      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({\n        url: 'v1/widget-instances/' + this.themeInstance.id,\n        method: 'PUT',\n        data: {\n          package: this.activeTheme.package,\n          values: dataObj || {}\n        }\n      });\n    },\n    save: function save() {\n      _libs_bus__WEBPACK_IMPORTED_MODULE_5__[\"default\"].$emit('save-settings'); // Map data\n\n      var dataObj = _.mapValues(_.keyBy(this.savedFields, 'name'), 'value');\n\n      this.updateInstance(dataObj).then(this.initialize).then(this.reloadPage).catch(function (err) {\n        var error = Fliplet.parseError(err);\n        console.error(error);\n      });\n    }\n  },\n  created: function created() {\n    // Listeners\n    _libs_bus__WEBPACK_IMPORTED_MODULE_5__[\"default\"].$on('field-saved', this.onFieldSave);\n    _libs_bus__WEBPACK_IMPORTED_MODULE_5__[\"default\"].$on('initialize-widget', this.initialize);\n    _libs_bus__WEBPACK_IMPORTED_MODULE_5__[\"default\"].$on('reload-page', this.reloadPage); // Initialize\n\n    this.initialize(); // Save Request\n\n    Fliplet.Widget.onSaveRequest(this.save);\n  },\n  destroyed: function destroyed() {\n    _libs_bus__WEBPACK_IMPORTED_MODULE_5__[\"default\"].$off('field-saved', this.onFieldSave);\n    _libs_bus__WEBPACK_IMPORTED_MODULE_5__[\"default\"].$off('initialize-widget', this.initialize);\n    _libs_bus__WEBPACK_IMPORTED_MODULE_5__[\"default\"].$off('reload-page', this.reloadPage);\n  }\n});\n\n//# sourceURL=webpack:///./src/Application.vue?./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/ComponentSettings.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/ComponentSettings.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../store */ \"./src/store/index.js\");\n/* harmony import */ var _fields_TextField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../fields/TextField */ \"./src/components/fields/TextField.vue\");\n/* harmony import */ var _fields_ColorField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fields/ColorField */ \"./src/components/fields/ColorField.vue\");\n/* harmony import */ var _fields_FontField__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../fields/FontField */ \"./src/components/fields/FontField.vue\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {\n      state: _store__WEBPACK_IMPORTED_MODULE_0__[\"state\"]\n    };\n  },\n  props: {\n    webFonts: Array,\n    customFonts: Array\n  },\n  components: {\n    TextField: _fields_TextField__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n    ColorField: _fields_ColorField__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n    FontField: _fields_FontField__WEBPACK_IMPORTED_MODULE_3__[\"default\"]\n  },\n  methods: {\n    closeComponentSettings: _store__WEBPACK_IMPORTED_MODULE_0__[\"closeComponentSettings\"],\n    componentType: function componentType(fieldType) {\n      return \"\".concat(fieldType, \"-field\");\n    },\n    fieldData: function fieldData(field) {\n      var data = {\n        fieldConfig: field\n      };\n\n      if (field.type === 'font') {\n        data.webFonts = this.webFonts;\n        data.customFonts = this.customFonts;\n      }\n\n      return data;\n    },\n    savedValue: function savedValue(field) {\n      debugger;\n      var value = undefined;\n\n      if (_store__WEBPACK_IMPORTED_MODULE_0__[\"state\"].componentOverlay.data && _store__WEBPACK_IMPORTED_MODULE_0__[\"state\"].componentOverlay.data.instance.settings.values) {\n        value = _store__WEBPACK_IMPORTED_MODULE_0__[\"state\"].componentOverlay.data.instance.settings.values[field.name];\n      }\n\n      return value;\n    }\n  }\n});\n\n//# sourceURL=webpack:///./src/components/UI/ComponentSettings.vue?./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/SettingsButtons.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/SettingsButtons.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../store */ \"./src/store/index.js\");\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {};\n  },\n  props: {\n    componentConfig: Object,\n    componentIndex: Number,\n    themeInstance: Object\n  },\n  methods: {\n    componentSettings: function componentSettings() {\n      Object(_store__WEBPACK_IMPORTED_MODULE_0__[\"openComponentSettings\"])(this.componentConfig.name, {\n        component: this.componentConfig,\n        instance: this.themeInstance\n      });\n    }\n  }\n});\n\n//# sourceURL=webpack:///./src/components/UI/SettingsButtons.vue?./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/ThemeSelection.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/ThemeSelection.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _libs_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libs/bus */ \"./src/libs/bus.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n// @TODO: Handle errors\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {\n      selectedTheme: this.activeTheme ? this.activeTheme.id : 'none'\n    };\n  },\n  props: {\n    themes: Array,\n    activeTheme: Object,\n    themeInstance: Object\n  },\n  watch: {\n    selectedTheme: function selectedTheme(newVal) {\n      var _this = this;\n\n      if (newVal === \"none\") {\n        return this.removeInstance().then(function () {\n          _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$emit('initialize-widget');\n        }).then(function () {\n          // @TODO: Confirm we need this\n          _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$emit('reload-page');\n        }).catch(function (err) {\n          var error = Fliplet.parseError(err);\n          console.error(error);\n        });\n      }\n\n      if (newVal !== this.activeTheme.id) {\n        this.removeInstance().then(function () {\n          return _this.createInstance(newVal);\n        }).then(function () {\n          return _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$emit('initialize-widget');\n        }).then(function () {\n          // @TODO: Confirm we need this\n          return _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$emit('reload-page');\n        }).catch(function (err) {\n          var error = Fliplet.parseError(err);\n          console.error(error);\n        });\n      }\n    }\n  },\n  methods: {\n    removeInstance: function removeInstance() {\n      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({\n        method: 'DELETE',\n        url: 'v1/widget-instances/' + this.themeInstance.id\n      });\n    },\n    createInstance: function createInstance(themeId) {\n      return Fliplet.Env.get('development') ? Promise.resolve() : Fliplet.API.request({\n        method: 'POST',\n        url: 'v1/widget-instances?appId=' + Fliplet.Env.get('appId'),\n        data: {\n          widgetId: themeId === 'none' ? undefined : themeId,\n          reuse: true\n        }\n      });\n    }\n  }\n});\n\n//# sourceURL=webpack:///./src/components/UI/ThemeSelection.vue?./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/WidgetHeader.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WidgetHeader.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n//\n//\n//\n//\n//\n//\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {};\n  },\n  methods: {\n    closeSideView: function closeSideView() {\n      Fliplet.Studio.emit('navigate', {\n        name: 'appEdit'\n      });\n    }\n  }\n});\n\n//# sourceURL=webpack:///./src/components/WidgetHeader.vue?./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/ColorField.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields/ColorField.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _libs_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libs/bus */ \"./src/libs/bus.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {\n      value: this.savedValue || this.data.fieldConfig.default,\n      saveDebounced: _.debounce(this.saveData, 500)\n    };\n  },\n  props: {\n    data: Object,\n    savedValue: String\n  },\n  watch: {\n    value: function value(newVal, oldVal) {\n      if (newVal !== oldVal) {\n        this.saveDebounced();\n      }\n    }\n  },\n  methods: {\n    saveData: function saveData() {\n      var newData = {\n        name: this.data.fieldConfig.name,\n        value: this.value\n      };\n      _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$emit('field-saved', newData);\n    }\n  },\n  mounted: function mounted() {\n    _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$on('save-settings', this.saveDebounced);\n  },\n  destroyed: function destroyed() {\n    _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$off('save-settings', this.saveDebounced);\n  }\n});\n\n//# sourceURL=webpack:///./src/components/fields/ColorField.vue?./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/FontField.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields/FontField.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _libs_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libs/bus */ \"./src/libs/bus.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {\n      value: this.getFontValue(),\n      customValue: this.getCustomValue(),\n      saveDebounced: _.debounce(this.saveData, 500),\n      showInputField: false\n    };\n  },\n  props: {\n    data: Object,\n    savedValue: String\n  },\n  watch: {\n    value: function value(newVal, oldVal) {\n      if (newVal !== oldVal) {\n        this.saveDebounced();\n      }\n\n      this.showInputField = newVal === 'custom';\n    },\n    customValue: function customValue(newVal, oldVal) {\n      if (newVal !== oldVal) {\n        this.saveDebounced();\n      }\n    }\n  },\n  computed: {\n    customFonts: function customFonts() {\n      return this.data.customFonts;\n    },\n    webFonts: function webFonts() {\n      return this.data.webFonts;\n    }\n  },\n  methods: {\n    getFontValue: function getFontValue() {\n      var value = '';\n      var webFont = undefined;\n      var customFont = undefined;\n      webFont = _.find(this.data.webFonts, {\n        name: this.savedValue\n      });\n\n      if (!webFont) {\n        customFont = _.find(this.data.customFonts, {\n          name: this.savedValue\n        });\n      }\n\n      if (this.savedValue && (webFont || customFont)) {\n        value = this.savedValue;\n      } else if (this.savedValue && !webFont && !customFont) {\n        value = 'custom';\n        this.showInputField = true;\n      } else if (!this.savedValue) {\n        value = this.data.fieldConfig.default;\n      }\n\n      return value;\n    },\n    getCustomValue: function getCustomValue() {\n      var value = '';\n      var webFont = undefined;\n      var customFont = undefined;\n      webFont = _.find(this.data.webFonts, {\n        name: this.savedValue\n      });\n\n      if (!webFont) {\n        customFont = _.find(this.data.customFonts, {\n          name: this.savedValue\n        });\n      }\n\n      if (this.savedValue && !webFont && !customFont) {\n        value = this.savedValue;\n      } else {\n        value = '';\n      }\n\n      return value;\n    },\n    saveData: function saveData() {\n      var newData = {\n        name: this.data.fieldConfig.name,\n        value: this.showInputField ? this.customValue : this.value\n      };\n      _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$emit('field-saved', newData);\n    }\n  },\n  mounted: function mounted() {\n    _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$on('save-settings', this.saveDebounced);\n  },\n  destroyed: function destroyed() {\n    _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$off('save-settings', this.saveDebounced);\n  }\n});\n\n//# sourceURL=webpack:///./src/components/fields/FontField.vue?./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/QuickSettings.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields/QuickSettings.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _libs_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libs/bus */ \"./src/libs/bus.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {\n      variableToBeSaved: {},\n      saveDebounced: _.debounce(this.saveData, 500)\n    };\n  },\n  props: {\n    componentConfig: Object,\n    componentIndex: Number,\n    themeInstance: Object\n  },\n  computed: {\n    variables: function variables() {\n      var _this = this;\n\n      var variables = [];\n      this.componentConfig.variables.forEach(function (variable) {\n        var newObj = {\n          name: variable.name,\n          description: variable.description,\n          value: _this.themeInstance.settings && _this.themeInstance.settings.values && _this.themeInstance.settings.values[variable.name] ? _this.themeInstance.settings.values[variable.name] : variable.default\n        };\n        variables.push(newObj);\n      });\n      return variables;\n    }\n  },\n  methods: {\n    setNewValue: function setNewValue(variable) {\n      this.variableToBeSaved.name = variable.name;\n      this.variableToBeSaved.value = variable.value;\n      this.saveDebounced();\n    },\n    saveData: function saveData() {\n      var newData = {\n        name: this.variableToBeSaved.name,\n        value: this.variableToBeSaved.value\n      };\n      _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$emit('field-saved', newData);\n    }\n  },\n  mounted: function mounted() {\n    _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$on('save-settings', this.saveDebounced);\n  },\n  destroyed: function destroyed() {\n    _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$off('save-settings', this.saveDebounced);\n  }\n});\n\n//# sourceURL=webpack:///./src/components/fields/QuickSettings.vue?./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/TextField.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields/TextField.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _libs_bus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../libs/bus */ \"./src/libs/bus.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data: function data() {\n    return {\n      value: this.savedValue || this.data.fieldConfig.default,\n      saveDebounced: _.debounce(this.saveData, 500)\n    };\n  },\n  props: {\n    data: Object,\n    savedValue: String\n  },\n  watch: {\n    value: function value(newVal, oldVal) {\n      if (newVal !== oldVal) {\n        this.saveDebounced();\n      }\n    }\n  },\n  methods: {\n    saveData: function saveData() {\n      var newData = {\n        name: this.data.fieldConfig.name,\n        value: this.value\n      };\n      _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$emit('field-saved', newData);\n    }\n  },\n  mounted: function mounted() {\n    _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$on('save-settings', this.saveDebounced);\n  },\n  destroyed: function destroyed() {\n    _libs_bus__WEBPACK_IMPORTED_MODULE_0__[\"default\"].$off('save-settings', this.saveDebounced);\n  }\n});\n\n//# sourceURL=webpack:///./src/components/fields/TextField.vue?./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/Application.vue?vue&type=template&id=44b1e432&":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/Application.vue?vue&type=template&id=44b1e432& ***!
  \******************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"div\",\n    { attrs: { id: \"theme-application\" } },\n    [\n      _vm.isLoading\n        ? _c(\"div\", { staticClass: \"spinner-holder animated\" }, [\n            _c(\"div\", { staticClass: \"spinner-overlay\" }, [\n              _vm._v(\"Loading...\")\n            ]),\n            _vm._v(\" \"),\n            _c(\"p\", [_vm._v(\"Loading your settings...\")])\n          ])\n        : [\n            _c(\"WidgetHeader\"),\n            _vm._v(\" \"),\n            _c(\"ThemeSelection\", {\n              attrs: {\n                themes: _vm.themes,\n                \"active-theme\": _vm.activeTheme,\n                \"theme-instance\": _vm.themeInstance\n              }\n            }),\n            _vm._v(\" \"),\n            _vm._l(_vm.activeTheme.settings.configuration, function(\n              configuration,\n              index\n            ) {\n              return configuration.name === \"Quick settings\"\n                ? [\n                    _c(\"QuickSettings\", {\n                      attrs: {\n                        \"component-config\": configuration,\n                        \"component-index\": index,\n                        \"theme-instance\": _vm.themeInstance\n                      }\n                    })\n                  ]\n                : _vm._e()\n            }),\n            _vm._v(\" \"),\n            _c(\n              \"div\",\n              { staticClass: \"components-buttons-holder\" },\n              [\n                _vm._m(0),\n                _vm._v(\" \"),\n                _vm._l(_vm.activeTheme.settings.configuration, function(\n                  configuration,\n                  index\n                ) {\n                  return configuration.name !== \"Quick settings\"\n                    ? _c(\"SettingsButtons\", {\n                        key: index,\n                        attrs: {\n                          \"component-config\": configuration,\n                          \"component-index\": index,\n                          \"theme-instance\": _vm.themeInstance\n                        }\n                      })\n                    : _vm._e()\n                })\n              ],\n              2\n            ),\n            _vm._v(\" \"),\n            _c(\"ComponentSettings\", {\n              attrs: {\n                \"web-fonts\": _vm.webFonts,\n                \"custom-fonts\": _vm.customFonts\n              }\n            })\n          ]\n    ],\n    2\n  )\n}\nvar staticRenderFns = [\n  function() {\n    var _vm = this\n    var _h = _vm.$createElement\n    var _c = _vm._self._c || _h\n    return _c(\"div\", { staticClass: \"col-xs-12 control-label\" }, [\n      _c(\"label\", [_vm._v(\"Components\")])\n    ])\n  }\n]\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/Application.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/ComponentSettings.vue?vue&type=template&id=83dc4216&":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/ComponentSettings.vue?vue&type=template&id=83dc4216& ***!
  \**************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"transition\", { attrs: { name: \"slide-in\" } }, [\n    _vm.state.componentOverlay && _vm.state.componentOverlay.isOpen\n      ? _c(\"div\", { attrs: { id: \"component-settings-overlay\" } }, [\n          _c(\"header\", [\n            _c(\"p\", [_vm._v(_vm._s(_vm.state.componentOverlay.name))]),\n            _vm._v(\" \"),\n            _c(\n              \"span\",\n              {\n                staticClass: \"close-component-settings\",\n                on: {\n                  click: function($event) {\n                    $event.preventDefault()\n                    return _vm.closeComponentSettings($event)\n                  }\n                }\n              },\n              [_c(\"i\", { staticClass: \"fa fa-times-thin fa-lg fa-2x\" })]\n            )\n          ]),\n          _vm._v(\" \"),\n          _vm.state.componentOverlay.data &&\n          _vm.state.componentOverlay.data.component\n            ? _c(\n                \"div\",\n                { staticClass: \"settings-fields-holder\" },\n                _vm._l(\n                  _vm.state.componentOverlay.data.component.variables,\n                  function(field, index) {\n                    return _c(\n                      \"div\",\n                      { key: index },\n                      [\n                        _c(_vm.componentType(field.type), {\n                          tag: \"component\",\n                          attrs: {\n                            data: _vm.fieldData(field),\n                            \"saved-value\": _vm.savedValue(field)\n                          }\n                        })\n                      ],\n                      1\n                    )\n                  }\n                ),\n                0\n              )\n            : _vm._e()\n        ])\n      : _vm._e()\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/UI/ComponentSettings.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/SettingsButtons.vue?vue&type=template&id=322c90d3&":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/SettingsButtons.vue?vue&type=template&id=322c90d3& ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"div\",\n    {\n      staticClass: \"components-buttons\",\n      on: {\n        click: function($event) {\n          $event.preventDefault()\n          return _vm.componentSettings($event)\n        }\n      }\n    },\n    [\n      _vm._v(\"\\n  \" + _vm._s(_vm.componentConfig.name) + \" \"),\n      _c(\"i\", { staticClass: \"fa fa-angle-right\" })\n    ]\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/UI/SettingsButtons.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/ThemeSelection.vue?vue&type=template&id=173707de&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/ThemeSelection.vue?vue&type=template&id=173707de& ***!
  \***********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", { staticClass: \"form-holder\" }, [\n    _c(\"div\", { staticClass: \"form-group clearfix\" }, [\n      _vm._m(0),\n      _vm._v(\" \"),\n      _c(\"div\", { staticClass: \"col-xs-12\" }, [\n        _c(\n          \"select\",\n          {\n            directives: [\n              {\n                name: \"model\",\n                rawName: \"v-model\",\n                value: _vm.selectedTheme,\n                expression: \"selectedTheme\"\n              }\n            ],\n            staticClass: \"form-control\",\n            attrs: { name: \"select-theme\" },\n            on: {\n              change: function($event) {\n                var $$selectedVal = Array.prototype.filter\n                  .call($event.target.options, function(o) {\n                    return o.selected\n                  })\n                  .map(function(o) {\n                    var val = \"_value\" in o ? o._value : o.value\n                    return val\n                  })\n                _vm.selectedTheme = $event.target.multiple\n                  ? $$selectedVal\n                  : $$selectedVal[0]\n              }\n            }\n          },\n          [\n            _c(\"option\", { attrs: { value: \"none\" } }, [\n              _vm._v(\"-- Select a theme\")\n            ]),\n            _vm._v(\" \"),\n            _vm._l(_vm.themes, function(theme, index) {\n              return _c(\n                \"option\",\n                { key: index, domProps: { value: theme.id } },\n                [_vm._v(_vm._s(theme.name))]\n              )\n            })\n          ],\n          2\n        )\n      ])\n    ])\n  ])\n}\nvar staticRenderFns = [\n  function() {\n    var _vm = this\n    var _h = _vm.$createElement\n    var _c = _vm._self._c || _h\n    return _c(\"div\", { staticClass: \"col-xs-12 control-label\" }, [\n      _c(\"label\", { attrs: { for: \"select-theme\" } }, [\n        _vm._v(\"Selected theme\")\n      ])\n    ])\n  }\n]\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/UI/ThemeSelection.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/WidgetHeader.vue?vue&type=template&id=a782ccbe&":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/WidgetHeader.vue?vue&type=template&id=a782ccbe& ***!
  \******************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"header\", [\n    _c(\"p\", [\n      _c(\n        \"a\",\n        {\n          staticClass: \"closeSideView\",\n          attrs: { href: \"#\" },\n          on: {\n            click: function($event) {\n              $event.preventDefault()\n              return _vm.closeSideView($event)\n            }\n          }\n        },\n        [_c(\"i\", { staticClass: \"fa fa-times-thin fa-lg fa-2x\" })]\n      ),\n      _vm._v(\" Appearance\")\n    ])\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/WidgetHeader.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/ColorField.vue?vue&type=template&id=58d94a2d&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields/ColorField.vue?vue&type=template&id=58d94a2d& ***!
  \***********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", { staticClass: \"form-group clearfix\" }, [\n    _c(\"div\", { staticClass: \"col-xs-12 control-label\" }, [\n      _c(\"label\", { attrs: { for: \"select-theme\" } }, [\n        _vm._v(_vm._s(_vm.data.fieldConfig.description))\n      ])\n    ]),\n    _vm._v(\" \"),\n    _c(\"div\", { staticClass: \"col-xs-12\" }, [\n      _c(\"input\", {\n        directives: [\n          {\n            name: \"model\",\n            rawName: \"v-model\",\n            value: _vm.value,\n            expression: \"value\"\n          }\n        ],\n        staticClass: \"form-control\",\n        attrs: { type: \"text\" },\n        domProps: { value: _vm.value },\n        on: {\n          input: function($event) {\n            if ($event.target.composing) {\n              return\n            }\n            _vm.value = $event.target.value\n          }\n        }\n      })\n    ])\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/fields/ColorField.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/FontField.vue?vue&type=template&id=000adf85&":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields/FontField.vue?vue&type=template&id=000adf85& ***!
  \**********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", { staticClass: \"form-group clearfix\" }, [\n    _c(\"div\", { staticClass: \"col-xs-12 control-label\" }, [\n      _c(\"label\", { attrs: { for: \"select-theme\" } }, [\n        _vm._v(_vm._s(_vm.data.fieldConfig.description))\n      ])\n    ]),\n    _vm._v(\" \"),\n    _c(\"div\", { staticClass: \"col-xs-12\" }, [\n      _c(\n        \"select\",\n        {\n          directives: [\n            {\n              name: \"model\",\n              rawName: \"v-model\",\n              value: _vm.value,\n              expression: \"value\"\n            }\n          ],\n          staticClass: \"form-control\",\n          on: {\n            change: function($event) {\n              var $$selectedVal = Array.prototype.filter\n                .call($event.target.options, function(o) {\n                  return o.selected\n                })\n                .map(function(o) {\n                  var val = \"_value\" in o ? o._value : o.value\n                  return val\n                })\n              _vm.value = $event.target.multiple\n                ? $$selectedVal\n                : $$selectedVal[0]\n            }\n          }\n        },\n        [\n          _vm.customFonts && _vm.customFonts.length\n            ? [\n                _vm._l(_vm.customFonts, function(customFont, index) {\n                  return _c(\n                    \"option\",\n                    { key: index, domProps: { value: customFont.name } },\n                    [_vm._v(_vm._s(customFont.name))]\n                  )\n                }),\n                _vm._v(\" \"),\n                _c(\"optgroup\", { attrs: { label: \"---\" } })\n              ]\n            : _vm._e(),\n          _vm._v(\" \"),\n          _vm._l(_vm.webFonts, function(webFont, index) {\n            return _c(\n              \"option\",\n              { key: index, domProps: { value: webFont.name } },\n              [_vm._v(_vm._s(webFont.name))]\n            )\n          }),\n          _vm._v(\" \"),\n          _c(\"optgroup\", { attrs: { label: \"---\" } }),\n          _vm._v(\" \"),\n          _c(\"option\", { attrs: { value: \"custom\" } }, [_vm._v(\"Custom...\")])\n        ],\n        2\n      ),\n      _vm._v(\" \"),\n      _vm.showInputField\n        ? _c(\"input\", {\n            directives: [\n              {\n                name: \"model\",\n                rawName: \"v-model\",\n                value: _vm.customValue,\n                expression: \"customValue\"\n              }\n            ],\n            staticClass: \"form-control\",\n            attrs: { type: \"text\", placeholder: \"Helvetica, sans-serif\" },\n            domProps: { value: _vm.customValue },\n            on: {\n              input: function($event) {\n                if ($event.target.composing) {\n                  return\n                }\n                _vm.customValue = $event.target.value\n              }\n            }\n          })\n        : _vm._e()\n    ])\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/fields/FontField.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/QuickSettings.vue?vue&type=template&id=2173af4a&":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields/QuickSettings.vue?vue&type=template&id=2173af4a& ***!
  \**************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"div\",\n    { staticClass: \"quick-settings-holder clearfix\" },\n    [\n      _c(\n        \"div\",\n        { staticClass: \"col-xs-12 control-label quick-settings-title\" },\n        [_c(\"label\", [_vm._v(_vm._s(_vm.componentConfig.name))])]\n      ),\n      _vm._v(\" \"),\n      _vm._l(_vm.variables, function(variable, index) {\n        return [\n          _c(\"div\", { staticClass: \"col-xs-12 control-label\" }, [\n            _c(\"label\", [_vm._v(_vm._s(variable.description))])\n          ]),\n          _vm._v(\" \"),\n          _c(\"div\", { staticClass: \"col-xs-12\" }, [\n            _c(\"input\", {\n              directives: [\n                {\n                  name: \"model\",\n                  rawName: \"v-model\",\n                  value: variable.value,\n                  expression: \"variable.value\"\n                }\n              ],\n              staticClass: \"form-control\",\n              attrs: { type: \"text\" },\n              domProps: { value: variable.value },\n              on: {\n                keyup: function($event) {\n                  return _vm.setNewValue(variable)\n                },\n                input: function($event) {\n                  if ($event.target.composing) {\n                    return\n                  }\n                  _vm.$set(variable, \"value\", $event.target.value)\n                }\n              }\n            })\n          ])\n        ]\n      })\n    ],\n    2\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/fields/QuickSettings.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/TextField.vue?vue&type=template&id=e1987f32&":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields/TextField.vue?vue&type=template&id=e1987f32& ***!
  \**********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", { staticClass: \"form-group clearfix\" }, [\n    _c(\"div\", { staticClass: \"col-xs-12 control-label\" }, [\n      _c(\"label\", { attrs: { for: \"select-theme\" } }, [\n        _vm._v(_vm._s(_vm.data.fieldConfig.description))\n      ])\n    ]),\n    _vm._v(\" \"),\n    _c(\"div\", { staticClass: \"col-xs-12\" }, [\n      _c(\"input\", {\n        directives: [\n          {\n            name: \"model\",\n            rawName: \"v-model\",\n            value: _vm.value,\n            expression: \"value\"\n          }\n        ],\n        staticClass: \"form-control\",\n        attrs: { type: \"text\" },\n        domProps: { value: _vm.value },\n        on: {\n          input: function($event) {\n            if ($event.target.composing) {\n              return\n            }\n            _vm.value = $event.target.value\n          }\n        }\n      })\n    ])\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/fields/TextField.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return normalizeComponent; });\n/* globals __VUE_SSR_CONTEXT__ */\n\n// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).\n// This module is a runtime utility for cleaner component module output and will\n// be included in the final webpack user bundle.\n\nfunction normalizeComponent (\n  scriptExports,\n  render,\n  staticRenderFns,\n  functionalTemplate,\n  injectStyles,\n  scopeId,\n  moduleIdentifier, /* server only */\n  shadowMode /* vue-cli only */\n) {\n  // Vue.extend constructor export interop\n  var options = typeof scriptExports === 'function'\n    ? scriptExports.options\n    : scriptExports\n\n  // render functions\n  if (render) {\n    options.render = render\n    options.staticRenderFns = staticRenderFns\n    options._compiled = true\n  }\n\n  // functional template\n  if (functionalTemplate) {\n    options.functional = true\n  }\n\n  // scopedId\n  if (scopeId) {\n    options._scopeId = 'data-v-' + scopeId\n  }\n\n  var hook\n  if (moduleIdentifier) { // server build\n    hook = function (context) {\n      // 2.3 injection\n      context =\n        context || // cached call\n        (this.$vnode && this.$vnode.ssrContext) || // stateful\n        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional\n      // 2.2 with runInNewContext: true\n      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {\n        context = __VUE_SSR_CONTEXT__\n      }\n      // inject component styles\n      if (injectStyles) {\n        injectStyles.call(this, context)\n      }\n      // register component module identifier for async chunk inferrence\n      if (context && context._registeredComponents) {\n        context._registeredComponents.add(moduleIdentifier)\n      }\n    }\n    // used by ssr in case component is cached and beforeCreate\n    // never gets called\n    options._ssrRegister = hook\n  } else if (injectStyles) {\n    hook = shadowMode\n      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }\n      : injectStyles\n  }\n\n  if (hook) {\n    if (options.functional) {\n      // for template-only hot-reload because in that case the render fn doesn't\n      // go through the normalizer\n      options._injectStyles = hook\n      // register for functioal component in vue file\n      var originalRender = options.render\n      options.render = function renderWithStyleInjection (h, context) {\n        hook.call(context)\n        return originalRender(h, context)\n      }\n    } else {\n      // inject component registration as beforeCreate hook\n      var existing = options.beforeCreate\n      options.beforeCreate = existing\n        ? [].concat(existing, hook)\n        : [hook]\n    }\n  }\n\n  return {\n    exports: scriptExports,\n    options: options\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/vue-loader/lib/runtime/componentNormalizer.js?");

/***/ }),

/***/ "./src/Application.vue":
/*!*****************************!*\
  !*** ./src/Application.vue ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Application_vue_vue_type_template_id_44b1e432___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Application.vue?vue&type=template&id=44b1e432& */ \"./src/Application.vue?vue&type=template&id=44b1e432&\");\n/* harmony import */ var _Application_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Application.vue?vue&type=script&lang=js& */ \"./src/Application.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _Application_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _Application_vue_vue_type_template_id_44b1e432___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _Application_vue_vue_type_template_id_44b1e432___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/Application.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/Application.vue?");

/***/ }),

/***/ "./src/Application.vue?vue&type=script&lang=js&":
/*!******************************************************!*\
  !*** ./src/Application.vue?vue&type=script&lang=js& ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Application_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/babel-loader/lib??ref--2-0!../node_modules/vue-loader/lib??vue-loader-options!./Application.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/Application.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Application_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/Application.vue?");

/***/ }),

/***/ "./src/Application.vue?vue&type=template&id=44b1e432&":
/*!************************************************************!*\
  !*** ./src/Application.vue?vue&type=template&id=44b1e432& ***!
  \************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Application_vue_vue_type_template_id_44b1e432___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../node_modules/vue-loader/lib??vue-loader-options!./Application.vue?vue&type=template&id=44b1e432& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/Application.vue?vue&type=template&id=44b1e432&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Application_vue_vue_type_template_id_44b1e432___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Application_vue_vue_type_template_id_44b1e432___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/Application.vue?");

/***/ }),

/***/ "./src/components/UI/ComponentSettings.vue":
/*!*************************************************!*\
  !*** ./src/components/UI/ComponentSettings.vue ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ComponentSettings_vue_vue_type_template_id_83dc4216___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ComponentSettings.vue?vue&type=template&id=83dc4216& */ \"./src/components/UI/ComponentSettings.vue?vue&type=template&id=83dc4216&\");\n/* harmony import */ var _ComponentSettings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ComponentSettings.vue?vue&type=script&lang=js& */ \"./src/components/UI/ComponentSettings.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _ComponentSettings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _ComponentSettings_vue_vue_type_template_id_83dc4216___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _ComponentSettings_vue_vue_type_template_id_83dc4216___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/UI/ComponentSettings.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/UI/ComponentSettings.vue?");

/***/ }),

/***/ "./src/components/UI/ComponentSettings.vue?vue&type=script&lang=js&":
/*!**************************************************************************!*\
  !*** ./src/components/UI/ComponentSettings.vue?vue&type=script&lang=js& ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ComponentSettings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--2-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ComponentSettings.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/ComponentSettings.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ComponentSettings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/UI/ComponentSettings.vue?");

/***/ }),

/***/ "./src/components/UI/ComponentSettings.vue?vue&type=template&id=83dc4216&":
/*!********************************************************************************!*\
  !*** ./src/components/UI/ComponentSettings.vue?vue&type=template&id=83dc4216& ***!
  \********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ComponentSettings_vue_vue_type_template_id_83dc4216___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./ComponentSettings.vue?vue&type=template&id=83dc4216& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/ComponentSettings.vue?vue&type=template&id=83dc4216&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ComponentSettings_vue_vue_type_template_id_83dc4216___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ComponentSettings_vue_vue_type_template_id_83dc4216___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/UI/ComponentSettings.vue?");

/***/ }),

/***/ "./src/components/UI/SettingsButtons.vue":
/*!***********************************************!*\
  !*** ./src/components/UI/SettingsButtons.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _SettingsButtons_vue_vue_type_template_id_322c90d3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SettingsButtons.vue?vue&type=template&id=322c90d3& */ \"./src/components/UI/SettingsButtons.vue?vue&type=template&id=322c90d3&\");\n/* harmony import */ var _SettingsButtons_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SettingsButtons.vue?vue&type=script&lang=js& */ \"./src/components/UI/SettingsButtons.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _SettingsButtons_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _SettingsButtons_vue_vue_type_template_id_322c90d3___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _SettingsButtons_vue_vue_type_template_id_322c90d3___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/UI/SettingsButtons.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/UI/SettingsButtons.vue?");

/***/ }),

/***/ "./src/components/UI/SettingsButtons.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./src/components/UI/SettingsButtons.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SettingsButtons_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--2-0!../../../node_modules/vue-loader/lib??vue-loader-options!./SettingsButtons.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/SettingsButtons.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SettingsButtons_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/UI/SettingsButtons.vue?");

/***/ }),

/***/ "./src/components/UI/SettingsButtons.vue?vue&type=template&id=322c90d3&":
/*!******************************************************************************!*\
  !*** ./src/components/UI/SettingsButtons.vue?vue&type=template&id=322c90d3& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SettingsButtons_vue_vue_type_template_id_322c90d3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./SettingsButtons.vue?vue&type=template&id=322c90d3& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/SettingsButtons.vue?vue&type=template&id=322c90d3&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SettingsButtons_vue_vue_type_template_id_322c90d3___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SettingsButtons_vue_vue_type_template_id_322c90d3___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/UI/SettingsButtons.vue?");

/***/ }),

/***/ "./src/components/UI/ThemeSelection.vue":
/*!**********************************************!*\
  !*** ./src/components/UI/ThemeSelection.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ThemeSelection_vue_vue_type_template_id_173707de___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ThemeSelection.vue?vue&type=template&id=173707de& */ \"./src/components/UI/ThemeSelection.vue?vue&type=template&id=173707de&\");\n/* harmony import */ var _ThemeSelection_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ThemeSelection.vue?vue&type=script&lang=js& */ \"./src/components/UI/ThemeSelection.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _ThemeSelection_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _ThemeSelection_vue_vue_type_template_id_173707de___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _ThemeSelection_vue_vue_type_template_id_173707de___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/UI/ThemeSelection.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/UI/ThemeSelection.vue?");

/***/ }),

/***/ "./src/components/UI/ThemeSelection.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./src/components/UI/ThemeSelection.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ThemeSelection_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--2-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ThemeSelection.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/ThemeSelection.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ThemeSelection_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/UI/ThemeSelection.vue?");

/***/ }),

/***/ "./src/components/UI/ThemeSelection.vue?vue&type=template&id=173707de&":
/*!*****************************************************************************!*\
  !*** ./src/components/UI/ThemeSelection.vue?vue&type=template&id=173707de& ***!
  \*****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ThemeSelection_vue_vue_type_template_id_173707de___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./ThemeSelection.vue?vue&type=template&id=173707de& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/UI/ThemeSelection.vue?vue&type=template&id=173707de&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ThemeSelection_vue_vue_type_template_id_173707de___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ThemeSelection_vue_vue_type_template_id_173707de___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/UI/ThemeSelection.vue?");

/***/ }),

/***/ "./src/components/WidgetHeader.vue":
/*!*****************************************!*\
  !*** ./src/components/WidgetHeader.vue ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _WidgetHeader_vue_vue_type_template_id_a782ccbe___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WidgetHeader.vue?vue&type=template&id=a782ccbe& */ \"./src/components/WidgetHeader.vue?vue&type=template&id=a782ccbe&\");\n/* harmony import */ var _WidgetHeader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WidgetHeader.vue?vue&type=script&lang=js& */ \"./src/components/WidgetHeader.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _WidgetHeader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _WidgetHeader_vue_vue_type_template_id_a782ccbe___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _WidgetHeader_vue_vue_type_template_id_a782ccbe___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/WidgetHeader.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/WidgetHeader.vue?");

/***/ }),

/***/ "./src/components/WidgetHeader.vue?vue&type=script&lang=js&":
/*!******************************************************************!*\
  !*** ./src/components/WidgetHeader.vue?vue&type=script&lang=js& ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WidgetHeader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--2-0!../../node_modules/vue-loader/lib??vue-loader-options!./WidgetHeader.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/WidgetHeader.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WidgetHeader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/WidgetHeader.vue?");

/***/ }),

/***/ "./src/components/WidgetHeader.vue?vue&type=template&id=a782ccbe&":
/*!************************************************************************!*\
  !*** ./src/components/WidgetHeader.vue?vue&type=template&id=a782ccbe& ***!
  \************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_WidgetHeader_vue_vue_type_template_id_a782ccbe___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./WidgetHeader.vue?vue&type=template&id=a782ccbe& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/WidgetHeader.vue?vue&type=template&id=a782ccbe&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_WidgetHeader_vue_vue_type_template_id_a782ccbe___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_WidgetHeader_vue_vue_type_template_id_a782ccbe___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/WidgetHeader.vue?");

/***/ }),

/***/ "./src/components/fields/ColorField.vue":
/*!**********************************************!*\
  !*** ./src/components/fields/ColorField.vue ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ColorField_vue_vue_type_template_id_58d94a2d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorField.vue?vue&type=template&id=58d94a2d& */ \"./src/components/fields/ColorField.vue?vue&type=template&id=58d94a2d&\");\n/* harmony import */ var _ColorField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ColorField.vue?vue&type=script&lang=js& */ \"./src/components/fields/ColorField.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _ColorField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _ColorField_vue_vue_type_template_id_58d94a2d___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _ColorField_vue_vue_type_template_id_58d94a2d___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/fields/ColorField.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/fields/ColorField.vue?");

/***/ }),

/***/ "./src/components/fields/ColorField.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./src/components/fields/ColorField.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--2-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ColorField.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/ColorField.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/fields/ColorField.vue?");

/***/ }),

/***/ "./src/components/fields/ColorField.vue?vue&type=template&id=58d94a2d&":
/*!*****************************************************************************!*\
  !*** ./src/components/fields/ColorField.vue?vue&type=template&id=58d94a2d& ***!
  \*****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorField_vue_vue_type_template_id_58d94a2d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./ColorField.vue?vue&type=template&id=58d94a2d& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/ColorField.vue?vue&type=template&id=58d94a2d&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorField_vue_vue_type_template_id_58d94a2d___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ColorField_vue_vue_type_template_id_58d94a2d___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/fields/ColorField.vue?");

/***/ }),

/***/ "./src/components/fields/FontField.vue":
/*!*********************************************!*\
  !*** ./src/components/fields/FontField.vue ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _FontField_vue_vue_type_template_id_000adf85___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FontField.vue?vue&type=template&id=000adf85& */ \"./src/components/fields/FontField.vue?vue&type=template&id=000adf85&\");\n/* harmony import */ var _FontField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FontField.vue?vue&type=script&lang=js& */ \"./src/components/fields/FontField.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _FontField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _FontField_vue_vue_type_template_id_000adf85___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _FontField_vue_vue_type_template_id_000adf85___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/fields/FontField.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/fields/FontField.vue?");

/***/ }),

/***/ "./src/components/fields/FontField.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./src/components/fields/FontField.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FontField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--2-0!../../../node_modules/vue-loader/lib??vue-loader-options!./FontField.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/FontField.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FontField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/fields/FontField.vue?");

/***/ }),

/***/ "./src/components/fields/FontField.vue?vue&type=template&id=000adf85&":
/*!****************************************************************************!*\
  !*** ./src/components/fields/FontField.vue?vue&type=template&id=000adf85& ***!
  \****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FontField_vue_vue_type_template_id_000adf85___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./FontField.vue?vue&type=template&id=000adf85& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/FontField.vue?vue&type=template&id=000adf85&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FontField_vue_vue_type_template_id_000adf85___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FontField_vue_vue_type_template_id_000adf85___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/fields/FontField.vue?");

/***/ }),

/***/ "./src/components/fields/QuickSettings.vue":
/*!*************************************************!*\
  !*** ./src/components/fields/QuickSettings.vue ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _QuickSettings_vue_vue_type_template_id_2173af4a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./QuickSettings.vue?vue&type=template&id=2173af4a& */ \"./src/components/fields/QuickSettings.vue?vue&type=template&id=2173af4a&\");\n/* harmony import */ var _QuickSettings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./QuickSettings.vue?vue&type=script&lang=js& */ \"./src/components/fields/QuickSettings.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _QuickSettings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _QuickSettings_vue_vue_type_template_id_2173af4a___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _QuickSettings_vue_vue_type_template_id_2173af4a___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/fields/QuickSettings.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/fields/QuickSettings.vue?");

/***/ }),

/***/ "./src/components/fields/QuickSettings.vue?vue&type=script&lang=js&":
/*!**************************************************************************!*\
  !*** ./src/components/fields/QuickSettings.vue?vue&type=script&lang=js& ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_QuickSettings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--2-0!../../../node_modules/vue-loader/lib??vue-loader-options!./QuickSettings.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/QuickSettings.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_QuickSettings_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/fields/QuickSettings.vue?");

/***/ }),

/***/ "./src/components/fields/QuickSettings.vue?vue&type=template&id=2173af4a&":
/*!********************************************************************************!*\
  !*** ./src/components/fields/QuickSettings.vue?vue&type=template&id=2173af4a& ***!
  \********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_QuickSettings_vue_vue_type_template_id_2173af4a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./QuickSettings.vue?vue&type=template&id=2173af4a& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/QuickSettings.vue?vue&type=template&id=2173af4a&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_QuickSettings_vue_vue_type_template_id_2173af4a___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_QuickSettings_vue_vue_type_template_id_2173af4a___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/fields/QuickSettings.vue?");

/***/ }),

/***/ "./src/components/fields/TextField.vue":
/*!*********************************************!*\
  !*** ./src/components/fields/TextField.vue ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _TextField_vue_vue_type_template_id_e1987f32___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextField.vue?vue&type=template&id=e1987f32& */ \"./src/components/fields/TextField.vue?vue&type=template&id=e1987f32&\");\n/* harmony import */ var _TextField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextField.vue?vue&type=script&lang=js& */ \"./src/components/fields/TextField.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _TextField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _TextField_vue_vue_type_template_id_e1987f32___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _TextField_vue_vue_type_template_id_e1987f32___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/fields/TextField.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/fields/TextField.vue?");

/***/ }),

/***/ "./src/components/fields/TextField.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./src/components/fields/TextField.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--2-0!../../../node_modules/vue-loader/lib??vue-loader-options!./TextField.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/TextField.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_2_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/fields/TextField.vue?");

/***/ }),

/***/ "./src/components/fields/TextField.vue?vue&type=template&id=e1987f32&":
/*!****************************************************************************!*\
  !*** ./src/components/fields/TextField.vue?vue&type=template&id=e1987f32& ***!
  \****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_template_id_e1987f32___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./TextField.vue?vue&type=template&id=e1987f32& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/components/fields/TextField.vue?vue&type=template&id=e1987f32&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_template_id_e1987f32___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_template_id_e1987f32___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/fields/TextField.vue?");

/***/ }),

/***/ "./src/libs/bus.js":
/*!*************************!*\
  !*** ./src/libs/bus.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// This bus can be used like a VueComponent\n// and it simulates the Node EventEmitter\n// bus.$emit bus.$on bus.$off\n/* harmony default export */ __webpack_exports__[\"default\"] = (new Vue());\n\n//# sourceURL=webpack:///./src/libs/bus.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Application_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Application.vue */ \"./src/Application.vue\");\n\nvar mainApp = new Vue({\n  el: '#theme-widget-holder',\n  render: function render(createElement) {\n    return createElement(_Application_vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n  }\n});\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/store/index.js":
/*!****************************!*\
  !*** ./src/store/index.js ***!
  \****************************/
/*! exports provided: state, openComponentSettings, closeComponentSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"state\", function() { return state; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"openComponentSettings\", function() { return openComponentSettings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"closeComponentSettings\", function() { return closeComponentSettings; });\nvar state = {\n  componentOverlay: undefined\n};\nfunction openComponentSettings() {\n  var overlayName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';\n  var options = arguments.length > 1 ? arguments[1] : undefined;\n  options = options || {};\n\n  if (overlayName === '') {\n    return;\n  }\n\n  var overlay = {\n    name: overlayName,\n    isOpen: overlayName !== '',\n    data: options\n  };\n  state.componentOverlay = overlay;\n}\nfunction closeComponentSettings() {\n  state.componentOverlay = undefined;\n}\n\n//# sourceURL=webpack:///./src/store/index.js?");

/***/ })

/******/ });