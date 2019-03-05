import bus from '../libs/bus'

const debouncedSave = _.debounce(emitSavedData, 500)
const debouncedSaveInheritance = _.debounce(emitSavedInheritance, 500)

export const state = {
  themeInstance: undefined,
  activeTheme: undefined,
  fonts: {
    web: [],
    custom: []
  },
  componentOverlay: {},
  dataToSave: undefined,
  inheritanceToSave: undefined,
  componentContext: 'Mobile'
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

function emitSavedInheritance() {
  bus.$emit('inheritance-saved', state.inheritanceToSave)
}

export function saveFieldData(data) {
  state.dataToSave = _.pick(data, ['name', 'value'])
  debouncedSave()
}

export function saveInheritanceData(data) {
  state.inheritanceToSave = _.pick(data, ['name', 'value'])
  debouncedSaveInheritance()
}