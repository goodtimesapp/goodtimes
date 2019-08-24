import color from "color";

import { Platform, Dimensions, PixelRatio } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = "material";
const isIphoneX =
  platform === "ios" && deviceHeight === 812 && deviceWidth === 375;

export default { 
  "platformStyle": "material", 
  "platform": "ios", 
  "androidRipple": true,
  "androidRippleColor": "rgba(256, 256, 256, 0.3)", 
  "androidRippleColorDark": "rgba(0, 0, 0, 0.15)",
  
  "btnUppercaseAndroidText": true, "badgeBg": "#ED1727", "badgeColor": "#fff", "badgePadding": 3, "btnFontFamily": "System", 
    "btnDisabledBg": "#b5b5b5", "buttonPadding": 6, "btnPrimaryBg": "rgba(74,74,74,1)", "btnPrimaryColor": "#fff", "btnInfoBg": "#3F57D3",
     "btnInfoColor": "#fff", "btnSuccessBg": "#5cb85c", "btnSuccessColor": "#fff", "btnDangerBg": "#d9534f", "btnDangerColor": "#fff",
      "btnWarningBg": "#f0ad4e", "btnWarningColor": "#fff", "btnTextSize": 16.5, "btnTextSizeLarge": 22.5, "btnTextSizeSmall": 12,
  
      "borderRadiusLarge": 57, "iconSizeLarge": 45, "iconBg": 'grey', "iconSizeSmall": 18, "cardDefaultBg": "#fff", "cardBorderColor": "#ccc", "CheckboxRadius": 0,
  
      "CheckboxBorderWidth": 2, "CheckboxPaddingLeft": 2, "CheckboxPaddingBottom": 0, "CheckboxIconSize": 18, "CheckboxFontSize": 21,
         "DefaultFontSize": 17, "checkboxBgColor": "#039BE5", "checkboxSize": 20, "checkboxTickColor": "#fff", "brandPrimary": "#388e3c",
  
         "brandInfo": "#3F57D3", "brandSuccess": "#5cb85c", "brandDanger": "#d9534f", "brandWarning": "#f0ad4e", "brandDark": "#000",
           "brandLight": "#f4f4f4", "fontFamily": "System", "fontSizeBase": 15, "fontSizeH1": 27, "fontSizeH2": 24, "fontSizeH3": 21,
  
           "footerHeight": 55, "tabBarRadius": 45, "footerDefaultBg": "white", "footerPaddingBottom": 0, "tabBarTextColor": "grey", "tabBarTextSize": 14,
             "activeTab": "white", "sTabBarActiveTextColor": "white", "tabBarActiveTextColor": "grey", "tabActiveBgColor": "white",

              "toolbarBtnColor": "#fff", "toolbarDefaultBg": "white", "toolbarHeight": 64, "toolbarSearchIconSize": 20,
               "toolbarInputColor": "grey", "searchBarHeight": 30, "searchBarInputHeight": 30, "toolbarBtnTextColor": "grey",
                "toolbarDefaultBorder": "transparent", "iosStatusbar": "dark-content", "androidStatusBar": "dark-content", "statusBarColor": "grey",
                 "darkenHeader": "white", 
                 
                 "iconFamily": "Ionicons", "iconFontSize": 30, "iconHeaderSize": 29, "inputFontSize": 17, 
                 
                 "inputBorderColor": "#D9D5DC", "inputSuccessBorderColor": "#2b8339", "inputErrorBorderColor": "#ed2f2f", "inputHeightBase": 50,
                  "inputColor": "#000", "inputColorPlaceholder": "#575757", "btnLineHeight": 19, "lineHeightH1": 32, "lineHeightH2": 27,
                   "lineHeightH3": 22, "lineHeight": 20, "listBg": "#FFF", "listBorderColor": "#c9c9c9", "listDividerBg": "#f4f4f4", 
                   "listBtnUnderlayColor": "#DDD", "listItemPadding": 10, "listNoteColor": "#808080", "listNoteSize": 13,
                    "defaultProgressColor": "#E4202D", "inverseProgressColor": "#1A191B", "radioBtnSize": 25, "radioSelectedColorAndroid": "#5067FF", 
                    "radioBtnLineHeight": 29, "segmentBackgroundColor": "#388e3c", "segmentActiveBackgroundColor": "#fff", "segmentTextColor": "#fff",
                     "segmentActiveTextColor": "#388e3c", "segmentBorderColor": "#fff", "segmentBorderColorMain": "#388e3c", 
                     "defaultSpinnerColor": "#45D56E", "inverseSpinnerColor": "#1A191B", 
                     
                     "tabDefaultBg": "#388e3c",
                     
                     "topTabBarTextColor": "#b3c7f9", "topTabBarActiveTextColor": "#fff", "topTabBarBorderColor": "#fff", 
                      "topTabBarActiveBorderColor": "#fff",
                      
                      "tabBgColor": "#F8F8F8", "tabFontSize": 15, "textColor": "#000",
                     
                      "inverseTextColor": "#fff", "noteFontSize": 14, "defaultTextColor": "#000", "titleFontfamily": "System", 
                       "titleFontSize": 19, "subTitleFontSize": 14, "subtitleColor": "#FFF", "titleFontColor": "#FFF", "borderRadiusBase": 2,
                        "borderWidth": 1, "contentPadding": 10, "dropdownLinkColor": "#414142", "inputLineHeight": 24, "deviceWidth": 1920, "deviceHeight": 937, 
                        "isIphoneX": false, "inputGroupRoundedBorderRadius": 30 
}