// Property mapping configuration
const PROPERTY_MAPPINGS = {
  highlightColors: new Set([
    'headingOneColor',
    'headingTwoColor',
    'headingThreeColor',
    'headingFourColor',
    'headingFiveColor',
    'headingSixColor',
    'textHeadingOneColor',
    'textHeadingTwoColor',
    'textHeadingThreeColor',
    'textHeadingFourColor',
    'textHeadingFiveColor',
    'textHeadingSixColor',
    'menuBottomBarActiveFontColor',
    'primaryButtonColor',
    'primaryButtonHoverColor',
    'linkColor',
    'linkHoverColor',
    'appListPreparingIconColor',
    'appListProgressBarColor',
    'appListLoader',
    'chatHeadingsColor',
    'chatIconsAndLinksColor',
    'chatButtonBackground',
    'chatContactCardBackgroundSelected',
    'chatOwnBubbleBackground',
    'chartColor1',
    'directoryActiveListColor',
    'directoryActiveListTitleColor',
    'directoryActiveListDescColor',
    'formInputBorderFocusColor',
    'formToggleActiveBackgroundColor',
    'formSelectArrowBackground',
    'formStarRating',
    'formStarRatingSelected',
    'formSliderHandle',
    'formTypeaheadBackgroundColor',
    'formRequiredColor',
    'listMyListToggleColor',
    'listSmallMyListToggleColor',
    'listLargeMyListToggleColor',
    'listSmallIconColor',
    'listLargeIconColor',
    'listSmallMyListSwipeRightColor',
    'listLargeMyListSwipeRightColor',
    'smallCardListDetailOverlayLineUnderTitleColor',
    'newsFeedListDetailOverlayLineUnderTitleColor',
    'agendaListDetailOverlayLineUnderTitleColor',
    'smallHCardListDetailOverlayLineUnderTitleColor',
    'smallCardFilterIconActiveColor',
    'newsFeedFilterIconActiveColor',
    'agendaFilterIconActiveColor',
    'simpleListFilterIconActiveColor',
    'smallCardSearchIconColor',
    'newsFeedSearchIconColor',
    'agendaSearchIconColor',
    'simpleListSearchIconColor',
    'smallCardSearchFieldBorderActiveColor',
    'newsFeedSearchFieldBorderActiveColor',
    'agendaSearchFieldBorderActiveColor',
    'simpleListSearchFieldBorderActiveColor',
    'smallCardBookmarkIconActiveColor',
    'newsFeedBookmarkIconActiveColor',
    'agendaBookmarkIconActiveColor',
    'simpleListBookmarkIconActiveColor',
    'smallCardAddButtonBackground',
    'newsFeedAddButtonBackground',
    'agendaAddButtonBackground',
    'simpleListAddButtonBackground',
    'lfdAgendaTopTextActiveColor',
    'onboardingPaginationBulletColorActive',
    'onboardingHeadingColor',
    'paginationBulletColorActive',
    'sliderHeadingColor',
    'chevronSeparator',
    'iconColor',
    'loginButtonColor',
    'loginButtonBorderColor',
    'loginButtonHoverColor',
    'loginButtonHoverBorderColor',
    'lockInputFocus',
    'pushAcceptButton',
    'rssHighlight'
  ]),
  secondaryColors: new Set([
    'secondaryButtonColor',
    'secondaryButtonHoverColor',
    'chartColor2',
    'formSliderFill',
    'menuBottomBarActiveFontColor',
    'listSeparatorColor',
    'listChevronColor',
    'listSmallSeparatorColor',
    'listSmallChevronColor',
    'listLargeSeparatorColor',
    'listLargeChevronColor',
    'rssSeparatorColor',
    'rssChevronColor',
    'smallCardListDetailOverlayIconsColor',
    'agendaListDetailOverlayIconsColor',
    'smallHCardListDetailOverlayIconsColor',
    'simpleListDetailOverlayIconsColor',
    'smallCardFilterIconColor',
    'newsFeedFilterIconColor',
    'agendaFilterIconColor',
    'simpleListFilterIconColor',
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
  quickTextColors: new Set([
    'paragraphTextColor',
    'menuTopNavFontColor',
    'menuBackButtonColor',
    'menuButtonColor',
    'menuFontColor',
    'menuCloseButtonColor',
    'menuFooterFontColor',
    'menuPushTopNavFontColor',
    'menuPushBackButtonColor',
    'menuPushButtonColor',
    'menuPushFontColor',
    'menuPushCloseButtonColor',
    'menuPushFooterFontColor',
    'menuSlideTopNavFontColor',
    'menuSlideBackButtonColor',
    'menuSlideButtonColor',
    'menuSlideFontColor',
    'menuSlideCloseButtonColor',
    'menuSlideFooterFontColor',
    'menuSwipeTopNavFontColor',
    'menuSwipeBackButtonColor',
    'menuSwipeButtonColor',
    'menuSwipeFontColor',
    'menuSwipeCloseButtonColor',
    'menuSwipeFooterFontColor',
    'menuExpFontColor',
    'menuExpButtonColor',
    'menuExpButtonIconColorOpen',
    'menuExpBackgroundOpen',
    'menuExpFooterFontColor',
    'menuBottomBarBackgroundColor',
    'menuBottomBarFontColor',
    'accordionHeadingText',
    'accordionHeadingTextActive',
    'accordionHeadingChevron',
    'accordionHeadingChevronActive',
    'appListHeadingsColor',
    'appListDownloadIconColor',
    'appListInitialIconColor',
    'appListTextColor',
    'appListLoginOverlayTextColor',
    'appListLoginOverlayNavBarTextColor',
    'appListCloseButtonTextColor',
    'chatTextColor',
    'chatButtonTextColor',
    'chatContactCardText',
    'chatContactCardTextSelected',
    'chatSeparatorTextColor',
    'chatOthersBubbleTextColor',
    'directoryTextColor',
    'directoryActiveListTitleColor',
    'directoryActiveListDescColor',
    'directoryOverlayContentTitleColor',
    'directoryOverlayContentValueColor',
    'formLabelColor',
    'formTextInputsFontColor',
    'formSelectTextColor',
    'formSignatureClearTextColor',
    'gridTitleColor',
    'gridDescriptionColor',
    'titleColor',
    'descriptionColor',
    'listSmallTitleColor',
    'listSmallDescriptionColor',
    'listLargeTitleColor',
    'listLargeDescriptionColor',
    'lfdFontColor',
    'smallCardDescriptionFontColor',
    'smallCardSecondDescriptionFontColor',
    'smallCardDetailTitleFontColor',
    'smallCardDetailDescriptionFontColor',
    'smallCardDetailSecondDescriptionFontColor',
    'lfdDetailFontColor',
    'smallCardDetailLabelsFontColor',
    'lfdOverlayFontColor',
    'newsFeedTitleFontColor',
    'newsFeedDescriptionFontColor',
    'newsFeedSecondDescriptionFontColor',
    'newsFeedDetailTitleFontColor',
    'newsFeedDetailDescriptionFontColor',
    'newsFeedDetailSecondDescriptionFontColor',
    'newsFeedDetailTextFontColor',
    'newsFeedOverlayFontColor',
    'newsFeedSearchFieldTextColor',
    'agendaTitleFontColor',
    'agendaDescriptionFontColor',
    'agendaItemTimeFontColor',
    'agendaDetailTitleFontColor',
    'agendaDetailDescriptionFontColor',
    'agendaDetailSecondDescriptionFontColor',
    'agendaDetailTextFontColor',
    'agendaOverlayFontColor',
    'agendaSearchFieldTextColor',
    'smallHCardTitleFontColor',
    'smallHCardDetailTitleFontColor',
    'smallHCardDetailDescriptionFontColor',
    'smallHCardDetailSecondDescriptionFontColor',
    'smallHCardDetailTextFontColor',
    'smallHCardDetailLabelsFontColor',
    'simpleListTitleFontColor',
    'simpleListDescriptionFontColor',
    'simpleListSecondDescriptionFontColor',
    'simpleListDetailTextFontColor',
    'simpleListDetailLabelsFontColor',
    'simpleListOverlayFontColor',
    'simpleListSearchFieldTextColor',
    'simpleListCommentsFontColor',
    'lfdAgendaTopTextColor',
    'lfdAgendaDatesFontColor',
    'lfdCommentsFontColor',
    'lfdChevronColor',
    'lockChevronColor',
    'chevronColor',
    'loginButtonTextColor',
    'loginButtonHoverTextColor',
    'onboardingSkipTextColor',
    'onboardingPaginationChevronsColor',
    'onboardingTextColor',
    'panelTitleColor',
    'panelDescriptionColor',
    'imageOverlayTextColor',
    'imageOverlayNavTextColor',
    'pushTextColor',
    'rssTitleColor',
    'rssDescriptionColor',
    'paginationChevronsColor',
    'sliderTextColor'
  ]),
  quickBackgrounds: new Set([
    'Color',
    'menuTopNavBackground',
    'menuBackgroundColor',
    'menuPushTopNavBackground',
    'menuPushBackgroundColor',
    'menuSlideTopNavBackground',
    'menuSlideBackgroundColor',
    'menuSwipeTopNavBackground',
    'menuSwipeBackgroundColor',
    'menuExpFontColor',
    'menuExpButtonIconColor',
    'menuExpButtonColorOpen',
    'menuBottomActiveBackground',
    'primaryButtonTextColor',
    'primaryButtonHoverTextColor',
    'secondaryButtonTextColor',
    'secondaryButtonHoverTextColor',
    'accordionContentBackgroundColor',
    'appListLoginOverlayColor',
    'appListLoginOverlayNavBar',
    'appListCloseButtonColor',
    'chatBackgroundColor',
    'chatContactCardBackground',
    'directoryBackgroundColor',
    'directoryOverlayNavColor',
    'formToggleColor',
    'formSelectArrow',
    'formSliderValue',
    'formTypeaheadTextColor',
    'gridTextBackgroundColor',
    'listBackgroundColor',
    'listSmallBackgroundColor',
    'listLargeBackgroundColor',
    'listSmallIconBackgroundColor',
    'listLargeIconBackgroundColor',
    'lfdBackgroundColor',
    'lfdDetailBackgroundColor',
    'smallCardSearchFieldBackgroundColor',
    'newsFeedSearchFieldBackgroundColor',
    'agendaSearchFieldBackgroundColor',
    'simpleListSearchFieldBackgroundColor',
    'smallCardAddButtonIcon',
    'newsFeedAddButtonIcon',
    'agendaAddButtonIcon',
    'simpleListAddButtonIcon',
    'lfdOverlayBackgroundColor',
    'newsFeedListItemBackground',
    'newsFeedListDetailOverlayBackground',
    'lfdCommentsBackgroundColor',
    'simpleListCommentsBackgroundColor',
    'lfdAgendaTopBackgroundColor',
    'lfdAgendaDatesBackgroundColor',
    'smallHCardListItemBackground',
    'smallHCardListDetailOverlayBackground',
    'simpleListItemBackground',
    'simpleListDetailOverlayBackground',
    'notificationPublishedBackgroundColor',
    'onboardingSlideBackgroundColor',
    'onboardingPaginationChevronsBgColor',
    'panelBackgroundColor',
    'imageOverlayBackgroundColor',
    'imageOverlayNavBackgroundColor',
    'pushBackgroundColor',
    'rssBackgroundColor',
    'containerBackgroundColor'
  ]),
  quickHeadingFontFamilies: new Set([
    'headingOneFontFamily',
    'headingTwoFontFamily',
    'headingThreeFontFamily',
    'headingFourFontFamily',
    'headingFiveFontFamily',
    'headingSixFontFamily',
    'textHeadingOneFontFamily',
    'textHeadingTwoFontFamily',
    'textHeadingThreeFontFamily',
    'textHeadingFourFontFamily',
    'textHeadingFiveFontFamily',
    'textHeadingSixFontFamily',
    'appListHeadingsFontFamily',
    'onboardingHeadingFont',
    'sliderHeadingFont'
  ]),
  quickTextFontFamilies: new Set([
    'paragraphFontFamily',
    'menuFont',
    'menuPushFont',
    'menuSlideFont',
    'menuSwipeFont',
    'menuExpFont',
    'menuBottomFont',
    'primaryButtonFontFamily',
    'secondaryButtonFontFamily',
    'linkFontFamily',
    'linkFontFamilyHover',
    'formLabelFontFam',
    'formTextInputsFontFamily',
    'formErrorTextFontFamily',
    'gridTitleFont',
    'gridDescriptionFont',
    'titleFont',
    'descriptionFont',
    'listSmallTitleFont',
    'listSmallDescriptionFont',
    'listLargeTitleFont',
    'listLargeDescriptionFont',
    'smallCardTitleFontFamily',
    'smallCardDescriptionFontFamily',
    'smallCardSecondDescriptionFontFamily',
    'smallCardDetailTitleFontFamily',
    'smallCardDetailDescriptionFontFamily',
    'smallCardDetailSecondDescriptionFontFamily',
    'smallCardDetailTextFontFamily',
    'smallCardDetailLabelsFontFamily',
    'newsFeedTitleFontFamily',
    'newsFeedDescriptionFontFamily',
    'newsFeedSecondDescriptionFontFamily',
    'newsFeedDetailTitleFontFamily',
    'newsFeedDetailDescriptionFontFamily',
    'newsFeedDetailSecondDescriptionFontFamily',
    'newsFeedDetailTextFontFamily',
    'agendaTitleFontFamily',
    'agendaDescriptionFontFamily',
    'agendaItemTimeFontFamily',
    'agendaDetailTitleFontFamily',
    'agendaDetailDescriptionFontFamily',
    'agendaDetailSecondDescriptionFontFamily',
    'agendaDetailTextFontFamily',
    'smallHCardTitleFontFamily',
    'smallHCardDetailTitleFontFamily',
    'smallHCardDetailDescriptionFontFamily',
    'smallHCardDetailSecondDescriptionFontFamily',
    'smallHCardDetailTextFontFamily',
    'smallHCardDetailLabelsFontFamily',
    'simpleListTitleFontFamily',
    'simpleListDescriptionFontFamily',
    'simpleListSecondDescriptionFontFamily',
    'simpleListDetailTextFontFamily',
    'simpleListDetailLabelsFontFamily',
    'directoryOverlayContentLabelFont',
    'directoryOverlayContentValueFont',
    'loginButtonTextFontFamily',
    'onboardingTextFont',
    'panelTitleFont',
    'panelDescriptionFont',
    'sliderTextFont',
    'rssTitleFont',
    'rssDescriptionFont'
  ])
};

// Default field mappings
const DEFAULT_FIELD_MAPPINGS = {
  highlightColor: '$highlightColor',
  secondaryColor: '$secondaryColor',
  quickTextColor: '$quickTextColor',
  quickBackground: 'quickBackground',
  quickHeadingFontFamily: '$quickHeadingFontFamily',
  quickTextFontFamily: '$quickTextFontFamily'
};

/**
 * Processes a theme configuration and sets default values for fields that map to quick-settings
 * (e.g. highlight colors, secondary colors). Each mapped field gets the quick-setting's value
 * as its default so the theme stays consistent. Runs for all mapped fields, not only those
 * with an empty default.
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
    } else if (PROPERTY_MAPPINGS.quickTextColors.has(fieldName)) {
      return DEFAULT_FIELD_MAPPINGS.quickTextColor;
    } else if (PROPERTY_MAPPINGS.quickBackgrounds.has(fieldName)) {
      return DEFAULT_FIELD_MAPPINGS.quickBackground;
    } else if (PROPERTY_MAPPINGS.quickHeadingFontFamilies.has(fieldName)) {
      return DEFAULT_FIELD_MAPPINGS.quickHeadingFontFamily;
    } else if (PROPERTY_MAPPINGS.quickTextFontFamilies.has(fieldName)) {
      return DEFAULT_FIELD_MAPPINGS.quickTextFontFamily;
    }

    return null;
  };

  // Create a cache for default values to avoid repeated lookups
  const defaultValueCache = new Map();

  // Helper function to get the actual default value from theme configuration
  const getActualDefaultValue = (theme, defaultFieldName) => {
    // Return cached value only when present and not null
    const cached = defaultValueCache.get(defaultFieldName);

    if (cached !== undefined && cached !== null) {
      return cached;
    }

    if (!theme?.settings?.configuration) {
      return null;
    }

    let result = null;

    // Use early return pattern for better performance
    for (const config of theme.settings.configuration) {
      if (!config.variables) continue;

      for (const variable of config.variables) {
        if (!variable.fields) continue;

        for (const field of variable.fields) {
          if (field.name === defaultFieldName && !isEmptyValue(field.default)) {
            result = field.default;
            break;
          }
        }

        if (result) break;
      }

      if (result) break;
    }

    // Cache only non-null results
    if (result !== null && result !== undefined) {
      defaultValueCache.set(defaultFieldName, result);
    }

    return result;
  };

  // Process theme configuration and set default values
  if (theme?.settings?.configuration) {
    for (const config of theme.settings.configuration) {
      if (!config.variables) continue;

      for (const variable of config.variables) {
        if (!variable.fields) continue;

        for (const field of variable.fields) {
          const defaultFieldName = getDefaultValueForField(field.name);

          if (defaultFieldName) {
            const actualDefaultValue = getActualDefaultValue(theme, defaultFieldName);

            if (actualDefaultValue) {
              // Apply quick-setting default so mapped fields (e.g. highlight colors) use the same value as their quick-setting
              field.default = actualDefaultValue;
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
