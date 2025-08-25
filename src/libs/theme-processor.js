// Property mapping configuration
const PROPERTY_MAPPINGS = {
  highlightColors: new Set([
    'highlightColor',
    'headingFourColor',
    'headingSixColor',
    'headingFiveColor',
    'headingThreeColor',
    'headingTwoColor',
    'headingOneColor',
    'menuBottomBarBackgroundColor',
    'primaryButtonColor',
    'secondaryButtonTextColor',
    'secondaryButtonBorderColor',
    'secondaryButtonHoverTextColor',
    'secondaryButtonHoverBorderColor',
    'linkColor',
    'titleColor',
    'listSmallTitleColor',
    'listLargeTitleColor',
    'loginButtonColor',
    'onboardingPaginationChevronsColor',
    'onboardingPaginationBulletColorActive',
    'rssTitleColor',
    'lfdFontColor',
    'newsFeedTitleFontColor',
    'agendaTitleFontColor',
    'smallHCardTitleFontColor',
    'simpleListTitleFontColor',
    'smallCardDetailTitleFontColor',
    'newsFeedDetailTitleFontColor',
    'agendaDetailTitleFontColor',
    'smallHCardDetailTitleFontColor',
    'smallCardAddButtonBackground',
    'newsFeedAddButtonBackground',
    'agendaAddButtonBackground',
    'simpleListAddButtonBackground',
    'lfdAgendaTopTextActiveColor',
    'markerLabelBackground',
    'mapLabelBackground',
    'controlsBackground',
    'mapSearchOverlayText',
    'formInputBorderFocusColor',
    'formToggleActiveBackgroundColor',
    'formSelectArrowBackground',
    'formStarRating',
    'newsFeedFilterIconActiveColor',
    'newsFeedBookmarkIconActiveColor',
    'newsFeedLikeIconActiveColor',
    'agendaItemTimeFontColor',
    'agendaFilterIconActiveColor',
    'agendaBookmarkIconActiveColor',
    'smallCardFilterIconActiveColor',
    'smallCardBookmarkIConActiveColor'
  ]),
  secondaryColors: new Set([
    'secondaryColor',
    'menuBottomBarActiveFontColor',
    'listSeparatorColor',
    'listChevronColor',
    'listSmallIconColor',
    'listSmallChevronColor',
    'listSmallSeparatorColor',
    'listLargeSeparatorColor',
    'listLargeChevronColor',
    'listLargeIconColor',
    'rssSeparatorColor',
    'rssChevronColor',
    'smallCardListDetailOverlayLineUnderTitleColor',
    'newsFeedListDetailOverlayLineUnderTitleColor',
    'agendaListDetailOverlayLineUnderTitleColor',
    'smallHCardListDetailOverlayLineUnderTitleColor',
    'smallCardListDetailOverlayIconsColor',
    'agendaListDetailOverlayIconsColor',
    'smallHCardListDetailOverlayIconsColor',
    'simpleListDetailOverlayIconsColor',
    'smallCardFilterIconColor',
    'newsFeedFilterIconColor',
    'agendaFilterIconColor',
    'simpleListFilterIconColor',
    'smallCardSearchIconColor',
    'newsFeedSearchIconColor',
    'agendaSearchIconColor',
    'simpleListSearchIconColor',
    'smallCardSearchFieldBorderColor',
    'newsFeedSearchFieldBorderColor',
    'agendaSearchFieldBorderColor',
    'simpleListSearchFieldBorderColor',
    'smallCardBookmarkIconColor',
    'newsFeedBookmarkIconColor',
    'agendaBookmarkIconColor',
    'simpleListBookmarkIconColor',
    'smallCardSortIconColor',
    'newsFeedSortIconColor',
    'simpleListSortIconColor',
    'newsFeedLikeIconColor',
    'simpleListLikeIconColor',
    'formTypeaheadBackgroundColor'
  ]),
  paragraphTextColors: new Set([
    'quickTextColor',
    'newsFeedDetailTextFontColor',
    'descriptionColor',
    'newsFeedDescriptionFontColor',
    'listSmallDescriptionColor',
    'listLargeDescriptionColor',
    'onboardingTextColor',
    'rssDescriptionColor',
    'smallCardDescriptionFontColor',
    'newsFeedDescriptionFontColor',
    'agendaDescriptionFontColor',
    'simpleListDescriptionFontColor',
    'smallCardSecondDescriptionFontColor',
    'newsFeedSecondDescriptionFontColor',
    'simpleListSecondDescriptionFontColor',
    'smallCardDetailDescriptionFontColor',
    'newsFeedDetailDescriptionFontColor',
    'agendaDetailDescriptionFontColor',
    'smallHCardDetailDescriptionFontColor',
    'smallCardDetailSecondDescriptionFontColor',
    'agendaDetailSecondDescriptionFontColor',
    'smallHCardDetailSecondDescriptionFontColor',
    'lfdDetailFontColor',
    'newsFeedDetailSecondDescriptionFontColor',
    'agendaDetailTextFontColor',
    'smallHCardDetailTextFontColor',
    'simpleListDetailTextFontColor',
    'lfdOverlayFontColor',
    'newsFeedOverlayFontColor',
    'agendaOverlayFontColor',
    'simpleListOverlayFontColor',
    'lfdCommentsFontColor',
    'simpleListCommentsFontColor',
    'lfdAgendaTopTextColor',
    'lfdAgendaDatesFontColor',
    'formLabelColor',
    'formRequiredColor'
  ])
};

// Default field mappings
const DEFAULT_FIELD_MAPPINGS = {
  highlightColor: '$highlightColor',
  secondaryColor: '$secondaryColor',
  quickTextColor: '$quickTextColor'
};

/**
 * Processes a theme configuration and sets default values for fields that don't have them
 * @param {Object} theme - The theme object to process
 * @return {Object} The processed theme with updated default values
 */
export function processThemeConfiguration(theme) {
  // Early return if no theme provided
  if (!theme) {
    return theme;
  }

  // Helper function to check if a value is empty/null/undefined
  const isEmptyValue = (value) => value === null || value === undefined || value === '';

  // Helper function to get default value for a field
  const getDefaultValueForField = (fieldName) => {
    if (PROPERTY_MAPPINGS.highlightColors.has(fieldName)) {
      return DEFAULT_FIELD_MAPPINGS.highlightColor;
    } else if (PROPERTY_MAPPINGS.secondaryColors.has(fieldName)) {
      return DEFAULT_FIELD_MAPPINGS.secondaryColor;
    } else if (PROPERTY_MAPPINGS.paragraphTextColors.has(fieldName)) {
      return DEFAULT_FIELD_MAPPINGS.quickTextColor;
    }
    return null;
  };

  // Create a cache for default values to avoid repeated lookups
  const defaultValueCache = new Map();

  // Helper function to get the actual default value from theme configuration
  const getActualDefaultValue = (theme, defaultFieldName) => {
    // Check cache first
    if (defaultValueCache.has(defaultFieldName)) {
      return defaultValueCache.get(defaultFieldName);
    }

    if (!theme?.settings?.configuration) {
      defaultValueCache.set(defaultFieldName, null);
      return null;
    }

    let result = null;

    // Use early return pattern for better performance
    outerLoop: for (const config of theme.settings.configuration) {
      if (!config.variables) continue;
      
      for (const variable of config.variables) {
        if (!variable.fields) continue;
        
        for (const field of variable.fields) {
          if (field.name === defaultFieldName && !isEmptyValue(field.default)) {
            result = field.default;
            break outerLoop;
          }
        }
      }
    }

    // Cache the result
    defaultValueCache.set(defaultFieldName, result);
    return result;
  };

  // Process theme configuration and set default values
  if (theme?.settings?.configuration) {
    for (const config of theme.settings.configuration) {
      if (!config.variables) continue;
      
      for (const variable of config.variables) {
        if (!variable.fields) continue;
        
        for (const field of variable.fields) {
          // Check if field has no default value
          if (isEmptyValue(field.default)) {
            const defaultFieldName = getDefaultValueForField(field.name);
            
            if (defaultFieldName) {
              const actualDefaultValue = getActualDefaultValue(theme, defaultFieldName);
              
              if (actualDefaultValue) {
                field.default = actualDefaultValue;
              }
            }
          }
        }
      }
    }
  }

  return theme;
}

// Export constants for use in other modules if needed
export { PROPERTY_MAPPINGS, DEFAULT_FIELD_MAPPINGS }; 