function addDropdownListener() {
  $(document).on('shown.bs.dropdown', '.dropdown', function () {
    // calculate the required sizes, spaces
    var $ul = $(this).children('.dropdown-menu');
    var $button = $(this).children('.dropdown-toggle');
    var ulOffset = $ul.offset();

    // How much space is between the left side of the screen and the dropdown opened
    var spaceLeft = ulOffset.left;

    // Width of the dropdown
    var dropdownWidth = $ul.width();

    // Total width of the screen plus dropdown opened
    var totalWidthWithDropdown = spaceLeft + dropdownWidth;

    // how much space would be left on the top if the dropdown opened that direction
    var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();

    // how much space is left at the bottom
    var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());

    // switch to dropup only if there is no space at the bottom AND there is space at the top, or there isn't either but it would be still better fit
    if (spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown)) {
      $(this).addClass('dropup');
    }

    if (totalWidthWithDropdown > $(window).width()) {
      $ul.removeClass('dropdown-menu-left').addClass('dropdown-menu-right');
    }

    // Editing field flag is turned on
    Fliplet.Studio.emit('editing-theme-field', {
      value: true
    });
  }).on('hidden.bs.dropdown', '.dropdown', function() {
    var $ul = $(this).children('.dropdown-menu');

    // always reset after close
    $(this).removeClass('dropup');

    $ul.removeClass('dropdown-menu-right').addClass('dropdown-menu-left');

    // Editing field flag is turned off
    Fliplet.Studio.emit('editing-theme-field', {
      value: false
    });
  });
}

exports.dropdown = addDropdownListener();