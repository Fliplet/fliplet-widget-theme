const keyMap = {}

export default {
  getValue(e, value, allowNegative) {
    keyMap[e.keyCode] = true

    // Resets up and down keys when pressing Command
    if (keyMap[91] && e.keyCode == 38 && e.metaKey) {
      keyMap[40] = false
    } else if (keyMap[91] && e.keyCode == 40 && e.metaKey) {
      keyMap[38] = false
    }

    // Combos
    if (keyMap[91] && keyMap[38]) {
      // Command + Arrow up key
      return new Number(value + 100).toFixed(1).replace('.0', '')
      e.preventDefault()
    } else if (keyMap[91] && keyMap[40]) {
      // Command + Arrow down key
      if (new Number(value - 100).toFixed(1).replace('.0', '') > 0 || (allowNegative && new Number(value - 100).toFixed(1).replace('.0', '') <= 0)) {
        // If value is 0 do nothing
        return new Number(value - 100).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else {
        return 0
        e.preventDefault()
      }
    } else if (keyMap[17] && keyMap[38]) {
      // Control + Arrow up key
      return new Number(value + 100).toFixed(1).replace('.0', '')
      e.preventDefault()
    } else if (keyMap[17] && keyMap[40]) {
      // Control + Arrow down key
      if (new Number(value - 100).toFixed(1).replace('.0', '') > 0 || (allowNegative && new Number(value - 100).toFixed(1).replace('.0', '') <= 0)) {
        // If value is 0 do nothing
        return new Number(value - 100).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else {
        return 0
        e.preventDefault()
      }
    } else if (keyMap[16] && keyMap[38]) {
      // Shift + Arrow up key
      return new Number(value + 10).toFixed(1).replace('.0', '')
      e.preventDefault()
    } else if (keyMap[16] && keyMap[40]) {
      // Shift + Arrow down key
      if (new Number(value - 10).toFixed(1).replace('.0', '') > 0 || (allowNegative && new Number(value - 10).toFixed(1).replace('.0', '') <= 0)) {
        // If value is 0 do nothing
        return new Number(value - 10).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else {
        return 0
        e.preventDefault()
      }
    } else if (keyMap[18] && keyMap[38]) {
      // Alt/Option + Arrow up key
      return new Number(value + 0.1).toFixed(1).replace('.0', '')
      e.preventDefault()
    } else if (keyMap[18] && keyMap[40]) {
      // Alt/Option + Arrow down key
      if (new Number(value - 0.1).toFixed(1).replace('.0', '') > 0 || (allowNegative && new Number(value - 0.1).toFixed(1).replace('.0', '') <= 0)) {
        // If value is 0 do nothing
        return new Number(value - 0.1).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else {
        return 0
        e.preventDefault()
      }
    } else if (keyMap[38]) {
      // Arrow up key
      return new Number(value + 1).toFixed(1).replace('.0', '')
      e.preventDefault()
    } else if (keyMap[40]) {
      // Arrow down key
      if (new Number(value - 1).toFixed(1).replace('.0', '') > 0 || (allowNegative && new Number(value - 1).toFixed(1).replace('.0', '') <= 0)) {
        // If value is 0 do nothing
        return new Number(value - 1).toFixed(1).replace('.0', '')
        e.preventDefault()
      } else {
        return 0
        e.preventDefault()
      }
    } else {
      return value
    }
  },
  resetKeyMap(e) {
    keyMap[e.keyCode] = false

    // If used Command key resets Up and Down keys 
    if (e.keyCode == 91) {
      keyMap[40] = false
      keyMap[38] = false
    }
  }
}