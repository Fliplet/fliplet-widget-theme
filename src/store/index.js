export const state = {
  componentOverlay: undefined
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