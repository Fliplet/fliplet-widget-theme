import bus from '../libs/bus'

export const state = {
  componentOverlay: undefined,
  dataToSave: undefined,
  inheritanceToSave: undefined,
  debouncedSave: _.debounce(emitSavedData, 500),
  debouncedSaveInheritance: _.debounce(emitSavedInheritance, 500)
}

export function openComponentSettings(overlayName = '', options) {
  options = options || {}

  if (overlayName === '') {
    return
  }

  const overlay = {
    name: overlayName,
    isOpen: overlayName !== '',
    data: options
  }

  state.componentOverlay = overlay
  bus.$emit('component-overlay-opened')
}

export function closeComponentSettings() {
  state.componentOverlay = undefined
}

function emitSavedData() {
  bus.$emit('field-saved', state.dataToSave)
}

function emitSavedInheritance() {
  bus.$emit('inheritance-saved', state.inheritanceToSave)
}

export function saveFieldData(data) {
  state.dataToSave = _.pick(data, ['name', 'value'])
  state.debouncedSave()
}

export function saveInheritanceData(data) {
  state.inheritanceToSave = _.pick(data, ['name', 'value'])
  state.debouncedSaveInheritance()
}