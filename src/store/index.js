import bus from '../libs/bus'

export const state = {
  componentOverlay: undefined,
  dataToSave: undefined,
  debouncedSave: _.debounce(emitSavedData, 500)
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
}

export function closeComponentSettings() {
  state.componentOverlay = undefined
}

function emitSavedData() {
  bus.$emit('field-saved', state.dataToSave)
}

export function saveFieldData(data) {
  state.dataToSave = _.pick(data, ['name', 'value'])
  state.debouncedSave()
}