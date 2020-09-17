'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var SbEditable = _interopDefault(require('storyblok-react'));
var clsx = _interopDefault(require('clsx'));
var styles = require('@material-ui/core/styles');
var InlineSVG = _interopDefault(require('react-inlinesvg'));
var reactIntersectionObserver = require('react-intersection-observer');
var Typography = _interopDefault(require('@material-ui/core/Typography'));
var useCountUp = require('use-count-up');
var Grid = _interopDefault(require('@material-ui/core/Grid'));
var Fade = _interopDefault(require('@material-ui/core/Fade'));
var Skeleton = _interopDefault(require('@material-ui/lab/Skeleton'));
var useMediaQuery = _interopDefault(require('@material-ui/core/useMediaQuery'));
var windowSize = require('@react-hook/window-size');
var reactHooksGlobalState = require('react-hooks-global-state');
var GridList = _interopDefault(require('@material-ui/core/GridList'));
var GridListTile = _interopDefault(require('@material-ui/core/GridListTile'));
var Dialog = _interopDefault(require('@material-ui/core/Dialog'));
var DialogTitle = _interopDefault(require('@material-ui/core/DialogTitle'));
var IconButton = _interopDefault(require('@material-ui/core/IconButton'));
var Close = _interopDefault(require('mdi-material-ui/Close'));
var SwipeableViews = _interopDefault(require('react-swipeable-views'));
var ChevronLeft = _interopDefault(require('mdi-material-ui/ChevronLeft'));
var ChevronRight = _interopDefault(require('mdi-material-ui/ChevronRight'));
var lumenCmsUtils = require('lumen-cms-utils');
var reactScrollParallax = require('react-scroll-parallax');
var Drawer = _interopDefault(require('@material-ui/core/Drawer'));
var useScrollTrigger = _interopDefault(require('@material-ui/core/useScrollTrigger'));
var AccordionSummary = _interopDefault(require('@material-ui/core/AccordionSummary'));
var AccordionDetails = _interopDefault(require('@material-ui/core/AccordionDetails'));
var Accordion = _interopDefault(require('@material-ui/core/Accordion'));
var ChevronDown = _interopDefault(require('mdi-material-ui/ChevronDown'));
var Plus = _interopDefault(require('mdi-material-ui/Plus'));
var useClientHydrated = _interopDefault(require('@charlietango/use-client-hydrated'));
var Container = _interopDefault(require('@material-ui/core/Container'));
var GridListTileBar = _interopDefault(require('@material-ui/core/GridListTileBar'));
var Button = _interopDefault(require('@material-ui/core/Button'));
var Fab = _interopDefault(require('@material-ui/core/Fab'));
var Avatar = _interopDefault(require('@material-ui/core/Avatar'));
var ExpansionPanel = _interopDefault(require('@material-ui/core/ExpansionPanel'));
var ExpansionPanelSummary = _interopDefault(require('@material-ui/core/ExpansionPanelSummary'));
var ExpansionPanelDetails = _interopDefault(require('@material-ui/core/ExpansionPanelDetails'));
var MuiLink = _interopDefault(require('@material-ui/core/Link'));
var Menu = _interopDefault(require('@material-ui/core/Menu'));
var MenuItem = _interopDefault(require('@material-ui/core/MenuItem'));
var ChevronUp = _interopDefault(require('mdi-material-ui/ChevronUp'));
var router = require('next/router');
var core = require('@material-ui/core');
var ReactPlayer = _interopDefault(require('react-player'));
var CardActionArea = _interopDefault(require('@material-ui/core/CardActionArea'));
var CardContent = _interopDefault(require('@material-ui/core/CardContent'));
var CardMedia = _interopDefault(require('@material-ui/core/CardMedia'));
var Card = _interopDefault(require('@material-ui/core/Card'));
var CardActions = _interopDefault(require('@material-ui/core/CardActions'));
var MuiTabs = _interopDefault(require('@material-ui/core/Tabs'));
var Tab = _interopDefault(require('@material-ui/core/Tab'));
var List = _interopDefault(require('@material-ui/core/List'));
var ListItemAvatar = _interopDefault(require('@material-ui/core/ListItemAvatar'));
var Link$1 = _interopDefault(require('next/link'));
var ListItem = _interopDefault(require('@material-ui/core/ListItem'));
var ListItemText = _interopDefault(require('@material-ui/core/ListItemText'));
var CircularProgress = _interopDefault(require('@material-ui/core/CircularProgress'));
var FormControlLabel = _interopDefault(require('@material-ui/core/FormControlLabel'));
var Checkbox = _interopDefault(require('@material-ui/core/Checkbox'));
var useDebounce = require('use-debounce');
var TextField = _interopDefault(require('@material-ui/core/TextField'));
var Magnify = _interopDefault(require('mdi-material-ui/Magnify'));
var Autocomplete = _interopDefault(require('@material-ui/lab/Autocomplete'));
var Paper = _interopDefault(require('@material-ui/core/Paper'));
var InputAdornment = _interopDefault(require('@material-ui/core/InputAdornment'));
var Timeline = _interopDefault(require('@material-ui/lab/Timeline'));
var Slide = _interopDefault(require('@material-ui/core/Slide'));
var Grow = _interopDefault(require('@material-ui/core/Grow'));
var Zoom = _interopDefault(require('@material-ui/core/Zoom'));
var Collapse = _interopDefault(require('@material-ui/core/Collapse'));
var nextSeo = require('next-seo');
var MenuUi = _interopDefault(require('mdi-material-ui/Menu'));
var AppsIcon = _interopDefault(require('mdi-material-ui/Apps'));
var DialogContent = _interopDefault(require('@material-ui/core/DialogContent'));
var useSWR = _interopDefault(require('swr'));
var Comment = _interopDefault(require('mdi-material-ui/Comment'));
var Heart = _interopDefault(require('mdi-material-ui/Heart'));
var TimelineOppositeContent = _interopDefault(require('@material-ui/lab/TimelineOppositeContent'));
var TimelineSeparator = _interopDefault(require('@material-ui/lab/TimelineSeparator'));
var TimelineDot = _interopDefault(require('@material-ui/lab/TimelineDot'));
var TimelineConnector = _interopDefault(require('@material-ui/lab/TimelineConnector'));
var TimelineContent = _interopDefault(require('@material-ui/lab/TimelineContent'));
var TimelineItem = _interopDefault(require('@material-ui/lab/TimelineItem'));
var CardHeader = _interopDefault(require('@material-ui/core/CardHeader'));
var Whatsapp = _interopDefault(require('mdi-material-ui/Whatsapp'));
var Tooltip = _interopDefault(require('@material-ui/core/Tooltip'));
var Snackbar = _interopDefault(require('@material-ui/core/Snackbar'));
var Cookies = _interopDefault(require('js-cookie'));
var SnackbarContent = _interopDefault(require('@material-ui/core/SnackbarContent'));
require('next/error');
require('@material-ui/core/CssBaseline');
require('nprogress');
require('@material-ui/core/AppBar');
require('@material-ui/core/Toolbar');
require('next/head');
require('@material-ui/core/ListItemIcon');
require('@material-ui/core/ListSubheader');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var defaultValue = {
  allCategories: [],
  allStaticContent: [],
  listWidgetData: {},
  insideStoryblok: false
};
var AppContext = /*#__PURE__*/React.createContext(defaultValue);
var useAppContext = function useAppContext() {
  return React.useContext(AppContext);
};

var CONFIG = {
  href: process.env.HREF || '/[...index]',
  previewToken: process.env.NEXT_PUBLIC_PREVIEW_TOKEN || '',
  publicToken: process.env.NEXT_PUBLIC_PUBLIC_TOKEN || '',
  languages: process.env.NEXT_PUBLIC_LANGUAGES ? /*#__PURE__*/process.env.NEXT_PUBLIC_LANGUAGES.split(',') : [],
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
  rootDirectory: process.env.NEXT_PUBLIC_ROOT_DIRECTORY,
  overwriteLocale: process.env.NEXT_PUBLIC_OVERWRITE_LOCALE,
  suppressSlugLocale: !!process.env.NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE,
  overwriteDisableIndex: !!process.env.NEXT_PUBLIC_OVERWRITE_DISABLE_INDEX,
  GA: process.env.NEXT_PUBLIC_GA,
  TAWKTO: process.env.NEXT_PUBLIC_TAWKTO,
  prefetch: !process.env.NEXT_PUBLIC_DISABLE_PREFETCH
};
var LmCoreComponents = {
  lm_app_providers: []
};

function LmComponentRender(props) {
  var appContext = useAppContext();
  var insideStoryblok = appContext === null || appContext === void 0 ? void 0 : appContext.insideStoryblok;

  var content = props.content,
      i = props.i,
      rest = _objectWithoutPropertiesLoose(props, ["content", "i"]);

  if (typeof LmCoreComponents[content.component] !== 'undefined') {
    var CurrentElement = React__default.createElement(LmCoreComponents[content.component], _extends({
      content: content,
      key: typeof i === 'number' ? content.component + "_" + (content._uid || i) : undefined
    }, rest));

    if (insideStoryblok) {
      return React__default.createElement(SbEditable, {
        content: content
      }, CurrentElement);
    }

    return CurrentElement;
  }

  return React__default.createElement("div", {
    style: {
      color: 'red'
    },
    key: (content === null || content === void 0 ? void 0 : content._uid) || "" + i
  }, "The component ", content.component || 'no name found', " has not been created yet.");
}

function LmAccordion(_ref) {
  var content = _ref.content;

  var _useState = React.useState(''),
      opened = _useState[0],
      setOpen = _useState[1];

  return React__default.createElement("div", {
    className: "lm-accordion"
  }, (content.body || []).map(function (blok, iteration) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      options: content,
      opened: opened,
      setOpen: setOpen,
      iteration: iteration,
      key: blok._uid
    });
  }));
}

var useStyles = /*#__PURE__*/styles.makeStyles(function (theme) {
  return styles.createStyles({
    tables: {
      tableLayout: 'fixed',
      borderSpacing: 0,
      borderCollapse: 'collapse',
      '&.lm-table__bordered, &.lm-table__bordered-bold': {
        '& td, & th': {
          border: "1px solid " + (theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black),
          padding: theme.spacing(3)
        }
      },
      '&.lm-table__bordered-bold': {
        '& td, & th': {
          border: "2px solid " + (theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black)
        },
        '& th': {
          textAlign: 'left'
        },
        '& tbody tr:last-child': {
          '& td': {
            fontWeight: 'bold'
          }
        }
      },
      '&.lm-table__boxed': {
        border: "1px solid " + (theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black),
        borderCollapse: 'separate',
        backgroundColor: theme.palette.background.paper,
        '& td': {
          border: "1px solid " + theme.palette.divider,
          padding: theme.spacing(3)
        }
      },
      '&.lm-table__price': {
        width: '100%',
        '& td': {
          padding: theme.spacing(4) + "px 0",
          borderBottom: "1px solid " + theme.palette.divider,
          '&:first-child': {
            width: '80%'
          },
          '&:not(:first-child)': {
            textAlign: 'right'
          },
          '&:last-child': {
            fontWeight: 'bold',
            fontSize: '1.2rem' // fontFamily: '' // todo

          }
        }
      },
      '&.lm-table__comparison': {
        '& thead': {
          '& th': {
            textAlign: 'center',
            '&:not(:first-of-type)': {
              borderRight: "1px solid " + theme.palette.divider,
              padding: theme.spacing(4),
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main // fontFamily: $table-comparison-header-font-family;

            },
            '&:nth-child(2)': {
              borderTopLeftRadius: '10px'
            },
            '&:last-child': {
              borderRight: 'none',
              borderTopRightRadius: '10px'
            }
          }
        },
        '& tbody': {
          '& td': {
            padding: theme.spacing(4) + "px 0",
            borderTop: "1px solid " + theme.palette.divider,
            '&:first-of-type': {
              color: theme.palette.text.primary,
              padding: '25px 35px 25px 0'
            },
            '&:not(:first-child)': {
              color: theme.palette.text.secondary,
              textAlign: 'center',
              boxShadow: '-1px 1px 3px 0 rgba(240, 240, 240, .7)',
              borderLeft: "1px solid " + theme.palette.divider,
              borderRight: "1px solid " + theme.palette.divider
            },
            '&:last-child': {
              boxShadow: '1px 0 3px 0 rgba(240, 240, 240, .75)' // theme.shadows[2]//

            }
          },
          '& tr:last-child > td': {
            borderBottom: "1px solid " + theme.palette.divider,
            '&:not(:first-child)': {
              borderBottom: "1px solid " + theme.palette.divider,
              boxShadow: '-1px 3px 7px 0 rgba(240, 240, 240, .7)'
            }
          }
        }
      }
    }
  });
});

function TableRow(_ref) {
  var content = _ref.content,
      index = _ref.index;
  return React__default.createElement("tr", null, content.map(function (column, iterator) {
    return React__default.createElement("td", {
      key: "column_" + index + "_" + iterator,
      dangerouslySetInnerHTML: {
        __html: column
      }
    });
  }));
}

function LmTable(_ref2) {
  var _clsx;

  var content = _ref2.content;
  var classes = useStyles();
  var className = clsx(classes.tables, 'lm-table', content.class_names && content.class_names.values, (_clsx = {}, _clsx["lm-table__" + content.variant] = !!content.variant, _clsx));
  var tableBody = content.body && content.body.tbody || [];
  var tableHead = content.body && content.body.thead || [];
  return React__default.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, React__default.createElement("table", {
    className: className
  }, !content.disable_table_head && React__default.createElement("thead", null, React__default.createElement("tr", null, tableHead.map(function (c, index) {
    return React__default.createElement("th", {
      key: "head_" + index
    }, c);
  }))), React__default.createElement("tbody", null, tableBody.map(function (row, index) {
    return React__default.createElement(TableRow, {
      key: "row_" + index,
      index: index,
      content: row
    });
  }))));
}

var intersectionDefaultOptions = {
  triggerOnce: true,
  rootMargin: '400px 0px 400px 0px'
};
var intersectionIframeOptions = /*#__PURE__*/_extends({}, intersectionDefaultOptions, {
  rootMargin: '150px 0px 150px 0px'
});

var underscoreToMinus = function underscoreToMinus(str) {
  return str.replace(/_/g, '-');
};

var useStyles$1 = /*#__PURE__*/styles.makeStyles({
  icon: {
    fill: 'currentColor',
    width: '1em',
    height: '1em',
    '&.size__lm-button-large': {
      width: 30,
      height: 30
    },
    '&.size__lm-button-xlarge': {
      width: 40,
      height: 40
    }
  }
});
var iconMap = {
  call: 'phone',
  people: 'account-multiple',
  access_time: 'clock-outline',
  compare_arrows: 'compare',
  keyboard_arrow_down: 'chevron-down'
};

function IconCore(_ref) {
  var _clsx;

  var className = _ref.className,
      style = _ref.style,
      iconName = _ref.iconName,
      buttonSize = _ref.buttonSize,
      iconUrl = _ref.iconUrl,
      _onClick = _ref.onClick;
  var classes = useStyles$1();

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  iconName = iconName ? iconMap[iconName] || iconName : undefined;
  var iconSrc = '';

  if (inView && (iconUrl || iconName)) {
    iconSrc = iconUrl || "https://cdn.jsdelivr.net/npm/@mdi/svg/svg/" + underscoreToMinus(iconName) + ".svg";
  }

  return iconName || iconUrl ? React__default.createElement(React__default.Fragment, null, iconSrc && React__default.createElement(InlineSVG, {
    onClick: function onClick() {
      _onClick && _onClick();
    },
    style: style,
    className: clsx(classes.icon, 'lm-svg-icon', className, (_clsx = {}, _clsx["size__" + buttonSize] = buttonSize, _clsx)),
    onError: function onError() {
      console.error("Icon not found: " + iconName); // console.error(e)
    },
    src: iconSrc
  }), React__default.createElement("span", {
    ref: refIntersectionObserver
  })) : React__default.createElement("span", null);
}

var useStyles$2 = /*#__PURE__*/styles.makeStyles({
  hSeparator: {
    clear: 'both',
    width: '100%',
    color: '#ccc',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '1px',
    '& > div, > div > div > div': {
      margin: '0 auto',
      overflow: 'hidden',
      position: 'relative',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderColor: 'transparent'
    },
    '& div > span:before': {
      right: '100%'
    },
    '& div > span:after': {
      left: '100%'
    },
    '& div > span:before, & div > span:after': {
      content: '""',
      display: 'inline-block',
      verticalAlign: 'top',
      position: 'absolute',
      top: '50%',
      height: 0,
      width: '2000px',
      borderTopWidth: 'inherit',
      borderTopStyle: 'solid',
      borderColor: 'currentColor'
    },
    '& div > span': {
      display: 'inline-block',
      verticalAlign: 'top',
      position: 'relative',
      height: 'inherit',
      borderColor: 'inherit',
      color: 'inherit',
      borderTopWidth: 'inherit',
      borderTopStyle: 'solid',
      '&> .material-icons': {
        color: 'inherit'
      }
    }
  },
  hSeparatorIcon: {
    height: '24px',
    textAlign: 'center',
    '&.large': {
      height: '32px'
    },
    '& div > div > i': {
      '&:before': {
        marginRight: '15px'
      },
      '&:after': {
        marginLeft: '15px'
      }
    }
  }
});

var DividerContainer = function DividerContainer(_ref) {
  var children = _ref.children,
      style = _ref.style,
      className = _ref.className,
      childStyle = _ref.childStyle;
  return React__default.createElement("div", {
    className: className,
    style: style
  }, React__default.createElement("div", {
    style: childStyle
  }, children));
};

DividerContainer.displayName = 'DividerContainer';
function LmDivider(_ref2) {
  var content = _ref2.content;
  var classes = useStyles$2();
  var style = {};
  var iconName = content.icon && content.icon.name;
  var iconSize = content.size;

  if (content.color && content.color.rgba) {
    style.color = content.color.rgba;
  }

  if (iconSize) {
    style.height = iconSize + "px";
  }

  var className = clsx(classes.hSeparator, iconName && classes.hSeparatorIcon, content.class_names && content.class_names.values);
  var childStyle = {
    borderTopWidth: (content.thickness || 1) + "px"
  };

  if (content.width) {
    childStyle.width = content.width + "%";
  }

  if (iconName) {
    return React__default.createElement(DividerContainer, {
      style: style,
      childStyle: childStyle,
      className: className
    }, React__default.createElement("div", null, React__default.createElement("div", {
      style: {
        borderTopWidth: (content.thickness || 1) + "px"
      }
    }, React__default.createElement("span", null, React__default.createElement(IconCore, {
      iconName: iconName,
      style: {
        fontSize: iconSize + "px",
        marginTop: (content.thickness || 1) + "px"
      }
    })))));
  }

  return React__default.createElement(DividerContainer, {
    style: style,
    childStyle: childStyle,
    className: className
  }, React__default.createElement("span", null));
}

function LmButtonList(_ref) {
  var content = _ref.content;
  var body = content.body || [];
  var properties = content.property || [];
  var classNames = clsx('d-flex', content.class_names && content.class_names.values, {
    'lm-button-list__margin-left': properties.includes('margin_left')
  });
  return React__default.createElement("div", {
    className: classNames
  }, body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }));
}

var mapTypographyVariant = {
  headline1: 'h1',
  headline2: 'h2',
  headline3: 'h3',
  headline4: 'h4',
  headline5: 'h5',
  headline6: 'h6',
  subtitle2: 'subtitle2',
  subtitle1: 'subtitle1',
  body1: 'body1',
  body2: 'body2',
  button: 'button',
  overline: 'overline',
  caption: 'caption'
};

var LmHeadlineCore = function LmHeadlineCore(_ref) {
  var _clsx;

  var content = _ref.content,
      _onClick = _ref.onClick,
      children = _ref.children;
  return React__default.createElement(Typography, {
    onClick: function onClick() {
      _onClick && _onClick();
    },
    className: clsx(content.style, content.style_props, content.class_names && content.class_names.values, (_clsx = {}, _clsx["lm-font-" + content.font] = content.font, _clsx)),
    component: content.tag ? content.tag : undefined,
    align: content.align ? content.align : undefined,
    color: content.color ? content.color : undefined,
    style: {
      cursor: _onClick ? 'pointer' : undefined,
      color: content.custom_color && content.custom_color.rgba ? content.custom_color.rgba : undefined,
      lineHeight: content.line_height ? content.line_height : undefined,
      fontSize: content.font_size ? content.font_size : undefined,
      letterSpacing: content.letter_spacing ? content.letter_spacing : undefined
    },
    variant: mapTypographyVariant[content.typography ? content.typography : 'headline4']
  }, children);
};
LmHeadlineCore.displayName = 'LmHeadlineCore';

function HeadlineCountUp(_ref) {
  var content = _ref.content,
      onClick = _ref.onClick;

  var _useInView = reactIntersectionObserver.useInView({
    triggerOnce: true
  }),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1]; // const { value } = useCountUp({
  //   isCounting: true,
  //   start: content.count_start || 0,
  //   end: content.count_end || 1000,
  //   duration: content.count_duration || 2.5,
  //   suffix: content.suffix || undefined,
  //   prefix: content.prefix || undefined,
  //   easing: content.animation || undefined
  // })


  return React__default.createElement(LmHeadlineCore, {
    content: content,
    onClick: onClick
  }, React__default.createElement("span", {
    ref: refIntersectionObserver
  }, React__default.createElement(useCountUp.CountUp, {
    isCounting: inView,
    duration: content.count_duration ? Number(content.count_duration) : 2.5,
    end: content.count_end ? Number(content.count_end) : 1000,
    start: content.count_start ? Number(content.count_start) : 0,
    suffix: content.suffix || undefined,
    prefix: content.prefix || undefined
  })));
}

var LmHeadline = function LmHeadline(_ref) {
  var content = _ref.content,
      onClick = _ref.onClick,
      children = _ref.children;

  if (content.count_end || content.count_start) {
    return React__default.createElement(HeadlineCountUp, {
      content: content,
      onClick: onClick
    });
  }

  return React__default.createElement(LmHeadlineCore, {
    content: content,
    onClick: onClick
  }, children || (!!content.text_xs ? React__default.createElement(React__default.Fragment, null, React__default.createElement("span", {
    className: "d-none d-sm-block"
  }, content.text), React__default.createElement("span", {
    className: "d-block d-sm-none"
  }, content.text_xs)) : content.text));
};
LmHeadline.displayName = 'LmHeadline';

var initialState = {
  leftNavigationDrawer: false,
  rightNavigationDrawer: false,
  searchParams: {
    searchText: undefined,
    categories: undefined
  },
  locale: CONFIG.defaultLocale,
  hasWebpSupport: undefined
};

var _createGlobalState = /*#__PURE__*/reactHooksGlobalState.createGlobalState(initialState),
    setGlobalState = _createGlobalState.setGlobalState,
    useGlobalState = _createGlobalState.useGlobalState,
    getGlobalState = _createGlobalState.getGlobalState;

var boundCoordinate = function boundCoordinate(value, upperBound) {
  var v = Math.min(value, upperBound);
  return Math.ceil(v);
};

function getOriginalImageDimensions(src) {
  var splitted = src.split('/');

  var _splitted$split = splitted[splitted.length - 3].split('x'),
      originalWidth = _splitted$split[0],
      originalHeight = _splitted$split[1];

  return {
    width: parseInt(originalWidth),
    height: parseInt(originalHeight)
  };
}
var getFocalPoint = function getFocalPoint(src, focalPoint) {
  var _getOriginalImageDime = getOriginalImageDimensions(src),
      width = _getOriginalImageDime.width,
      height = _getOriginalImageDime.height;

  var FOCAL_SQUARE_LENGTH = 100;

  var _focalPoint$split = focalPoint.split('x'),
      focalPointXVal = _focalPoint$split[0],
      focalPointYVal = _focalPoint$split[1];

  var focalPointX = parseInt(focalPointXVal);
  var focalPointY = parseInt(focalPointYVal);
  var top = boundCoordinate(focalPointY / 100 * height - FOCAL_SQUARE_LENGTH / 2, height);
  var left = boundCoordinate(focalPointX / 100 * width - FOCAL_SQUARE_LENGTH / 2, width);
  var bottom = boundCoordinate(top + FOCAL_SQUARE_LENGTH, height);
  var right = boundCoordinate(left + FOCAL_SQUARE_LENGTH, width);
  return ":focal(" + left + "x" + top + ":" + right + "x" + bottom + ")";
};
function imageService(image, option, filter) {
  if (option === void 0) {
    option = '';
  }

  if (filter === void 0) {
    filter = '';
  }

  var opt = option;

  if (image.endsWith('.svg')) {
    return image;
  }

  opt && (opt += '/');

  if (getGlobalState('hasWebpSupport')) {
    opt += "filters:format(webp)" + filter;
  } else if (filter) {
    opt += "filters" + filter;
  }

  return "https://img2.storyblok.com/" + opt + image.split('storyblok.com')[1];
}
function getImageAttrs(_ref2) {
  var originalSource = _ref2.originalSource,
      _ref2$width = _ref2.width,
      width = _ref2$width === void 0 ? 0 : _ref2$width,
      _ref2$height = _ref2.height,
      height = _ref2$height === void 0 ? 0 : _ref2$height,
      _ref2$filter = _ref2.filter,
      filter = _ref2$filter === void 0 ? '' : _ref2$filter,
      fitInColor = _ref2.fitInColor,
      smart = _ref2.smart,
      focalPoint = _ref2.focalPoint;
  var originalDimensions = getOriginalImageDimensions(originalSource);
  var dimW = width;
  var dimH = height;
  var filterVar = filter;

  var getPath = function getPath(w, h) {
    var path = (w || 0) + "x" + (h || 0);

    if (fitInColor) {
      path = "fit-in/" + path;
    } else if (smart && !focalPoint) {
      path += '/smart';
    }

    return path;
  };

  if (originalDimensions.width < dimW) {
    dimW = originalDimensions.width;
  }

  if (dimH && originalDimensions.height < dimH) {
    dimH = originalDimensions.height;
  }

  if (fitInColor) {
    filterVar += ":fill(" + fitInColor + ")";
  }

  var path = getPath(dimW, dimH);

  if (focalPoint) {
    filterVar += getFocalPoint(originalSource, focalPoint);
  }

  var src = imageService(originalSource, path, filter);
  var imgObj = {
    src: src,
    srcSet: src
  }; // enable retina sourceset

  if (dimW <= originalDimensions.width / 2 && dimH <= originalDimensions.height / 2) {
    imgObj.srcSet = imgObj.src + " 1x, " + imageService(originalSource, getPath(dimW * 2, dimH * 2), filterVar) + " 2x";
  }

  return imgObj;
}

var ImageShadow = function ImageShadow(_ref) {
  var afterLoad = _ref.afterLoad,
      rest = _objectWithoutPropertiesLoose(_ref, ["afterLoad"]);

  var ref = React.createRef();

  if (!rest.src) {
    return null; // don't render any component
  }

  var hasLoaded = function hasLoaded() {
    var _ref$current, _ref$current2;

    var src = ((_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.currentSrc) || ((_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.src) || '';
    src && typeof afterLoad === 'function' && afterLoad(src);
  };

  return React__default.createElement("img", Object.assign({
    ref: ref,
    style: {
      display: 'none'
    },
    alt: "img shadow"
  }, rest, {
    onLoad: hasLoaded
  }));
};

var useStyles$3 = /*#__PURE__*/styles.makeStyles(function (theme) {
  var _lmFixedBg;

  return styles.createStyles({
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      // zIndex: 0
      '&.lm-fixed-bg': (_lmFixedBg = {
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        // backgroundSize: 'initial', // not sure why this was set before
        '&.lm-fixed-bg__top': {
          backgroundPosition: 'top'
        }
      }, _lmFixedBg[theme.breakpoints.down('sm') + "and (orientation: portrait)"] = {
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      }, _lmFixedBg[theme.breakpoints.down('sm') + "and (orientation: landscape)"] = {
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      }, _lmFixedBg)
    }
  });
});

function BackgroundImage(_ref) {
  var content = _ref.content,
      backgroundStyle = _ref.backgroundStyle;
  var classes = useStyles$3();

  var _useWindowSize = windowSize.useWindowSize(),
      width = _useWindowSize[0],
      height = _useWindowSize[1];

  var _useState = React.useState(),
      imgSrc = _useState[0],
      setImgSrc = _useState[1];

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      viewRef = _useInView[0],
      inView = _useInView[1],
      anchorRef = _useInView[2];

  var theme = styles.useTheme();
  var matches = useMediaQuery(theme.breakpoints.down(content.hide_image_on_breakpoint || 'xs'));

  if (!content.image) {
    return null;
  }

  var isDesktop = width >= 1280;
  var image = content.image;
  var disableSmartCrop = content.disable_smart_crop;
  var imageFocalPoint = content.image_focal_point;
  var imageAttrs = {
    src: '',
    srcSet: ''
  };
  var current = anchorRef && anchorRef.target;

  if (content.hide_image_on_breakpoint && matches) {
    return null; // don't render if image hidden
  }

  if (current && inView && image) {
    var currentWidth = current.clientWidth;
    var currentHeight = current.clientHeight;

    if (isDesktop) {
      if (backgroundStyle === 'fixed_cover') {
        currentWidth = width;
        currentHeight = height;
      } else if (backgroundStyle === 'fixed_image') {
        currentHeight += 200;
        currentWidth += 200;
      }
    }

    var isAlternativeSource = content.alternative_image && height > width;
    imageAttrs = getImageAttrs({
      originalSource: isAlternativeSource ? content.alternative_image : image,
      width: currentWidth,
      height: currentHeight,
      smart: !disableSmartCrop,
      focalPoint: !isAlternativeSource ? imageFocalPoint : undefined
    });
  } // const imgSrc = useGetSrcHook(imageAttrs)


  return React__default.createElement(React__default.Fragment, null, !imgSrc && React__default.createElement(React__default.Fragment, null, React__default.createElement(Skeleton, {
    width: "100%",
    height: "100%",
    style: {
      position: 'absolute'
    },
    variant: "rect"
  }), React__default.createElement(ImageShadow, {
    src: imageAttrs.src,
    srcSet: imageAttrs.srcSet,
    afterLoad: setImgSrc
  })), React__default.createElement(Fade, {
    "in": !!imgSrc,
    timeout: 1000
  }, React__default.createElement("div", {
    className: clsx(classes.root, {
      'lm-fixed-bg': backgroundStyle === 'fixed_image' || backgroundStyle === 'fixed_cover',
      'lm-fixed-bg__top': backgroundStyle === 'fixed_image',
      'lm-fixed-bg__center': backgroundStyle === 'fixed_cover'
    }),
    style: {
      backgroundImage: imgSrc && "url('" + imgSrc + "')",
      backgroundSize: content.background_size ? content.background_size : undefined,
      backgroundPosition: content.background_position ? content.background_position : undefined
    },
    ref: viewRef
  })));
}

function BackgroundElements(_ref) {
  var _ref$elements = _ref.elements,
      elements = _ref$elements === void 0 ? [] : _ref$elements;

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      viewRef = _useInView[0],
      inView = _useInView[1];

  var styleElement = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  };

  if (inView) {
    styleElement.background = elements.map(function (item) {
      var elementType = item.component;

      switch (elementType) {
        case 'background_element_item':
          {
            var url = imageService(item.url || '', '');
            return "url('" + url + "') " + (item.horizontal || 'left') + " " + (item.vertical || 'top') + "/" + (item.size || 'auto') + " " + (item.repeat || 'no-repeat');
          }

        case 'background_element_color':
          {
            return item.color && item.color.rgba;
          }

        case 'background_element_gradient':
          {
            return item.value;
          }

        default:
          return '';
      }
    }).filter(function (i) {
      return i;
    }).join(',');
  }

  return React__default.createElement("div", {
    ref: viewRef,
    style: styleElement
  });
}

var useShadowStyles = /*#__PURE__*/styles.makeStyles({
  faded: {
    boxShadow: '0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)'
  },
  "float": {
    boxShadow: '0 16px 40px -12.125px rgba(0,0,0,0.3)'
  },
  hover: {
    boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(2px)',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
    }
  },
  lightTop: {
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    transition: '0.3s',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)'
    }
  },
  bouncy: {
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:hover': {
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
      transform: 'scale(1.04)'
    }
  },
  soft: {
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.12)',
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
    }
  }
});

function useBackgroundBox(props) {
  var _background$className, _clsx;

  var background = props.background;
  var variant = props.variant;
  var theme = styles.useTheme();
  var styles$1 = useShadowStyles();

  if (!background && !variant) {
    return {};
  }

  var mapBgColor = {
    dark: '#303030',
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    light: '#fafafa'
  };
  var mapColor = {
    light: 'rgba(0, 0, 0, 0.87)',
    dark_text: 'rgba(0, 0, 0, 0.87)',
    dark: theme.palette.common.white,
    light_text: theme.palette.common.white,
    primary: theme.palette.common.white,
    secondary: theme.palette.common.white
  };
  background = background || {};
  var border;

  if (background.border_color && background.border_color.rgba) {
    border = (background.border_size || 1) + "px " + (background.border_style || 'solid') + " " + (background.border_color && background.border_color.rgba);
  } else if (background.border_radius) {
    border = '1px solid transparent';
  }

  var style = {
    backgroundColor: background.background_color && background.background_color.rgba || mapBgColor[variant],
    border: border,
    borderRadius: background.border_radius,
    color: mapColor[variant],
    boxShadow: background.elevation ? theme.shadows[background.elevation] : undefined,
    minHeight: background.height ? background.height : undefined
  };
  Object.keys(style).forEach(function (key) {
    return !style[key] && delete style[key];
  });
  var className = clsx((_background$className = background.classNames) === null || _background$className === void 0 ? void 0 : _background$className.values, (_clsx = {}, _clsx[styles$1[background.shadow_effect || '']] = !!background.shadow_effect, _clsx));
  return {
    className: className,
    style: style
  };
}

var useStyles$4 = /*#__PURE__*/styles.makeStyles(function (theme) {
  var _xsColumnReverse, _smColumnReverse;

  return styles.createStyles({
    gridRow: {
      height: '100%',
      minHeight: 'inherit',
      '& .MuiGrid-item': {
        '& > .MuiGrid-direction-xs-column': {
          '& > *': {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            boxSizing: 'border-box',
            '&:first-child': {
              marginTop: 0
            },
            '&:last-child': {
              marginBottom: 0
            }
          }
        },
        '& > *': {
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
          boxSizing: 'border-box',
          '&:first-child': {
            marginTop: 0
          },
          '&:last-child': {
            marginBottom: 0
          }
        }
      }
    },
    xsColumnReverse: (_xsColumnReverse = {}, _xsColumnReverse[theme.breakpoints.only('xs')] = {
      flexDirection: 'column-reverse'
    }, _xsColumnReverse),
    smColumnReverse: (_smColumnReverse = {}, _smColumnReverse[theme.breakpoints.only('sm')] = {
      flexDirection: 'column-reverse'
    }, _smColumnReverse)
  });
});
function LmGridRow(_ref) {
  var _clsx;

  var content = _ref.content;
  // const theme = useTheme()
  var classes = useStyles$4();
  var spacing = content.spacing ? Number(content.spacing) : 3;
  var background = Array.isArray(content.background) && content.background[0];
  var direction = content.direction;

  var _useBackgroundBox = useBackgroundBox({
    background: background
  }),
      style = _useBackgroundBox.style,
      className = _useBackgroundBox.className;

  return React__default.createElement(Grid, {
    container: true,
    style: _extends({}, style, {
      padding: spacing ? "-" + spacing * 8 + "px" : undefined
    }),
    spacing: spacing,
    alignItems: content.align_items ? content.align_items : undefined,
    direction: direction || undefined,
    className: clsx(className, classes.gridRow, (_clsx = {}, _clsx[classes.xsColumnReverse] = content.reverse_on_mobile, _clsx[classes.smColumnReverse] = content.reverse_on_tablet, _clsx)),
    justify: content.justify ? content.justify : undefined,
    alignContent: content.align_content ? content.align_content : undefined
  }, (background === null || background === void 0 ? void 0 : background.image) && React__default.createElement(BackgroundImage, {
    content: background,
    backgroundStyle: content.background_style
  }), (background === null || background === void 0 ? void 0 : background.background_elements) && background.background_elements.length > 0 && React__default.createElement(BackgroundElements, {
    elements: background.background_elements
  }), content.body && content.body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }));
}

var xsSpanMap = {
  1: 3,
  2: 6,
  3: 9,
  4: 12,
  "false": false,
  auto: 'auto',
  "true": true
};
var smSpanMap = {
  1: 1,
  2: 2,
  3: 4,
  4: 6,
  5: 7,
  6: 9,
  7: 11,
  8: 12,
  "false": false,
  auto: 'auto',
  "true": true
};
var mdSpanMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  "false": false,
  auto: 'auto',
  "true": true
};
function LmGridColumn(_ref) {
  var content = _ref.content;
  // const classes = useStyles(content)
  var background = Array.isArray(content.background) && content.background[0] || undefined;

  var _useBackgroundBox = useBackgroundBox({
    background: background
  }),
      className = _useBackgroundBox.className,
      style = _useBackgroundBox.style;

  var mdWidth = mdSpanMap[content.width_general];
  var smWidth = smSpanMap[content.width_tablet];

  if (!smWidth && mdWidth) {
    smWidth = mdWidth;

    if (typeof mdWidth === 'number' && mdWidth > 8) {
      smWidth = 12;
    }
  }

  return React__default.createElement(Grid, {
    item: true,
    xs: content.width_phone ? xsSpanMap[content.width_phone] : 12,
    sm: smWidth,
    md: mdWidth,
    className: className,
    style: style
  }, (background === null || background === void 0 ? void 0 : background.image) && React__default.createElement(BackgroundImage, {
    content: background
  }), (background === null || background === void 0 ? void 0 : background.background_elements) && background.background_elements.length > 0 && React__default.createElement(BackgroundElements, {
    elements: background.background_elements
  }), content.justify || content.align_content || content.align_items ? React__default.createElement(Grid, {
    container: true,
    direction: "column",
    className: "mh-100",
    justify: content.justify ? content.justify : undefined,
    alignItems: content.align_items ? content.align_items : undefined,
    alignContent: content.align_content ? content.align_content : undefined
  }, content.body && content.body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  })) : content.body && content.body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }));
}

var useStyles$5 = /*#__PURE__*/styles.makeStyles(function (theme) {
  return {
    root: {
      display: 'inline-block',
      margin: '0 0 -6px 0 !important',
      overflow: 'auto',
      padding: 0,
      position: 'relative'
    },
    rootNoMargin: {
      margin: '0 !important'
    },
    image: {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      '&.img-thumbnail': {
        padding: '.25rem',
        backgroundColor: theme.palette.background["default"],
        border: "1px solid " + theme.palette.divider,
        borderRadius: theme.shape.borderRadius
      },
      '&.square, &.rounded-0': {
        borderRadius: 0
      },
      '&.rounded': {
        borderRadius: theme.shape.borderRadius
      },
      '&.rounded-circle': {
        borderRadius: '50%'
      }
    }
  };
});
function LmImage(_ref) {
  var _clsx, _content$class_names;

  var content = _ref.content,
      _onClick = _ref.onClick;
  var classes = useStyles$5();
  var width = windowSize.useWindowWidth();
  var isMobile = width < 600;

  var _useState = React.useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1];

  var imageCrop = content.image_crop || [];
  var property = content.property || [];
  var fitInColor = content.color && content.color.rgba || content.fit_in_color;

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1],
      intersectionElement = _useInView[2];

  var imgProperties = {
    src: '',
    srcSet: ''
  };
  var definedHeight = content.height_xs && isMobile ? content.height_xs : content.height;

  if (inView && content.source && intersectionElement) {
    var _intersectionElement$;

    var parentElement = intersectionElement.target.parentElement;
    var grandparentElement = (_intersectionElement$ = intersectionElement.target.parentElement) === null || _intersectionElement$ === void 0 ? void 0 : _intersectionElement$.parentElement; // console.log('parent element', hasDefinedSize, isInGrid, parentElement?.clientWidth, parentElement?.clientHeight, grandparentElement?.clientWidth, grandparentElement?.clientHeight)

    var parentDim = {
      width: (parentElement === null || parentElement === void 0 ? void 0 : parentElement.clientWidth) || 0,
      height: (parentElement === null || parentElement === void 0 ? void 0 : parentElement.clientHeight) || 0
    };
    var grandParentDim = {
      width: (grandparentElement === null || grandparentElement === void 0 ? void 0 : grandparentElement.clientWidth) || 0,
      height: (grandparentElement === null || grandparentElement === void 0 ? void 0 : grandparentElement.clientHeight) || 0
    };
    var square = property.includes('rounded-circle') || property.includes('square');
    var definedWidth = content.width;
    var w = Math.ceil(parentDim.width || width);

    if (!definedWidth && !definedHeight || imageCrop.length || fitInColor) {
      // default: set available width to the current width either in crop mode
      definedWidth = definedWidth || parentDim.height / parentDim.width * 100 > 300 ? grandParentDim.width : w;
    }

    if (square) {
      // overwrite if square
      var iconSize = definedHeight || definedWidth || 64;
      definedWidth = iconSize;
      definedHeight = iconSize;
    }

    if (content.height_fill) {
      // with a tolerance of 200 height should fit grandparents height
      if (grandParentDim.height === parentDim.height) {
        definedHeight = Math.ceil(grandParentDim.height);
      }
    }

    if (content.focal_point && parentElement && !definedHeight) {
      if (parentDim) {
        definedHeight = Math.ceil(parentDim.height);
      }
    }

    var imgRatio = {
      width: Number(definedWidth || 0),
      height: definedHeight
    };
    imgProperties = getImageAttrs(_extends({
      originalSource: content.source
    }, imgRatio, {
      fitInColor: fitInColor,
      focalPoint: content.focal_point,
      smart: imageCrop.includes('smart_crop')
    }));
  }

  function onImageLoaded() {
    setLoaded(true);
  }

  return React__default.createElement("figure", {
    onClick: function onClick() {
      _onClick && _onClick();
    },
    ref: refIntersectionObserver,
    className: clsx(classes.root, (_clsx = {}, _clsx[classes.rootNoMargin] = content.disable_ratio_correction, _clsx)),
    style: {
      height: content.height ? content.height + "px" : content.height_fill ? '100%' : undefined,
      width: content.width ? content.width + "px" : content.height_fill ? '100%' : undefined
    }
  }, !loaded && React__default.createElement(Skeleton, {
    style: {
      position: 'absolute'
    },
    width: "100%",
    height: "100%",
    variant: property.includes('rounded-circle') ? 'circle' : 'rect'
  }), React__default.createElement(Fade, {
    "in": loaded
  }, !imgProperties.src ? React__default.createElement("span", null) : React__default.createElement("img", Object.assign({}, imgProperties, {
    alt: content.alt || 'website image',
    width: content.width ? content.width : undefined,
    height: definedHeight || undefined,
    style: {
      cursor: _onClick ? 'pointer' : undefined,
      width: content.width ? content.width + "px" : 'auto',
      maxHeight: 'inherit',
      height: definedHeight ? definedHeight + "px" : 'auto'
    },
    className: clsx(classes.image, content.property, (_content$class_names = content.class_names) === null || _content$class_names === void 0 ? void 0 : _content$class_names.values),
    onLoad: onImageLoaded
  }))));
}

var useStyles$6 = /*#__PURE__*/styles.makeStyles({
  root: {
    display: 'inline-block'
  },
  svg: {
    display: 'inline-block',
    width: 120,
    height: 120,
    '&.has-color': {
      '& path': {
        fill: 'currentColor'
      }
    }
  }
});
function ImageSvg(_ref) {
  var content = _ref.content,
      _onClick = _ref.onClick;
  var classes = useStyles$6();

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var src = inView ? content.source : '';

  var _useState = React.useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1];

  var afterSvgLoaded = function afterSvgLoaded() {
    setLoaded(true);
  };

  var onErrorHandler = function onErrorHandler(error) {
    console.error(error);
  };

  var fitInColor = content.color && content.color.rgba || content.fit_in_color; // legacy fit_in_color

  return React__default.createElement(Fade, {
    "in": loaded
  }, React__default.createElement("div", {
    className: classes.root,
    ref: refIntersectionObserver
  }, !!src && React__default.createElement(InlineSVG, {
    src: src,
    style: {
      cursor: _onClick ? 'pointer' : undefined,
      color: fitInColor,
      width: content.width && content.width + "px",
      height: content.height && content.height + "px"
    },
    onClick: function onClick() {
      _onClick && _onClick();
    },
    onLoad: afterSvgLoaded,
    onError: onErrorHandler,
    className: clsx(classes.svg, {
      'has-color': !!fitInColor
    })
  })));
}

function LmImage$1(_ref) {
  var content = _ref.content,
      _onClick = _ref.onClick;
  var isSvgImage = content.source && content.source.endsWith('.svg');

  if (isSvgImage) {
    return React__default.createElement(ImageSvg, {
      content: content,
      onClick: function onClick() {
        _onClick && _onClick();
      }
    });
  }

  return React__default.createElement(LmImage, {
    content: content,
    onClick: function onClick() {
      _onClick && _onClick();
    }
  });
}

function LmHtml(_ref) {
  var content = _ref.content;

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var htmlContent = React.useMemo(function () {
    if (content.lazy_load) {
      if (inView) {
        return content.body || '';
      }

      return '';
    }

    return content.body || '';
  }, [content.lazy_load, content.body, inView]);
  return React__default.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: htmlContent
    },
    ref: refIntersectionObserver,
    style: {
      height: '100%'
    }
  });
}

var useStyles$7 = /*#__PURE__*/styles.makeStyles(function (_ref) {
  var palette = _ref.palette,
      breakpoints = _ref.breakpoints;
  var SIZES = {
    xs: 8,
    sm: 10,
    lg: 12
  };
  return {
    root: function root(_ref2) {
      var _IndicatorRoot, _after, _ref3;

      var active = _ref2.active,
          color = _ref2.color;
      var activeColor = color === 'dark' ? palette.text.primary : palette.common.white;
      var inActiveColor = color === 'dark' ? palette.text.disabled : 'rgba(255,255,255,0.38)';
      return _ref3 = {
        display: 'inline-block',
        padding: SIZES.xs,
        lineHeight: 0,
        cursor: 'pointer'
      }, _ref3[breakpoints.up('sm')] = {
        padding: SIZES.sm
      }, _ref3[breakpoints.up('lg')] = {
        padding: SIZES.lg
      }, _ref3['& + .Indicator-root'] = (_IndicatorRoot = {
        marginLeft: SIZES.xs
      }, _IndicatorRoot[breakpoints.up('sm')] = {
        marginLeft: SIZES.sm
      }, _IndicatorRoot[breakpoints.up('sm')] = {
        marginLeft: SIZES.lg
      }, _IndicatorRoot), _ref3['&:hover'] = {
        '&:after': {
          transform: 'scale(1.2)'
        }
      }, _ref3['&:after'] = (_after = {
        content: '""',
        display: 'inline-block',
        width: SIZES.xs,
        height: SIZES.xs,
        borderRadius: '50%',
        backgroundColor: active ? activeColor : inActiveColor
      }, _after[breakpoints.up('sm')] = {
        width: SIZES.sm,
        height: SIZES.sm
      }, _after[breakpoints.up('lg')] = {
        width: SIZES.lg,
        height: SIZES.lg
      }, _after), _ref3;
    }
  };
});

function InvertedIndicator(_ref4) {
  var className = _ref4.className,
      active = _ref4.active,
      color = _ref4.color,
      props = _objectWithoutPropertiesLoose(_ref4, ["className", "active", "color"]);

  var classes = useStyles$7(_extends({
    active: active,
    color: color || 'dark'
  }, props));
  return React__default.createElement("div", Object.assign({
    className: clsx(className, 'Indicator-root', 'InvertedIndicator-root', active && '-active', classes.root)
  }, props));
}

function Swipe(props) {
  var width = props.width,
      height = props.height;
  var currentIndex = props.elements.findIndex(function (i) {
    return i._uid === props.lightbox;
  });

  function getImageSource(source) {
    var dimensionHeight = height - 68 - 16;
    var dimensionWidth = width - 48;
    var originalDimension = getOriginalImageDimensions(source);
    var imgWidth = originalDimension.width;
    var imgHeight = originalDimension.height;
    dimensionWidth = imgWidth <= dimensionWidth ? imgWidth : dimensionWidth;
    dimensionHeight = imgHeight <= dimensionHeight ? imgHeight : dimensionHeight;
    var landscape = dimensionWidth > dimensionHeight;
    return getImageAttrs({
      originalSource: source,
      width: landscape ? 0 : dimensionWidth,
      height: landscape ? dimensionHeight : 0
    });
  }

  function handleChangeIndex(index) {
    props.onImageClick(props.elements[index]);
  }

  return React__default.createElement("div", {
    className: "carousel slide"
  }, React__default.createElement(SwipeableViews, {
    index: currentIndex,
    className: "carousel-inner",
    onChangeIndex: handleChangeIndex
  }, props.elements.map(function (item) {
    return React__default.createElement("div", {
      key: item._uid,
      className: "carousel-item"
    }, React__default.createElement("figure", {
      className: "d-block"
    }, React__default.createElement("img", Object.assign({}, getImageSource(item.source), {
      className: "img-fluid"
    }))));
  })), React__default.createElement("a", {
    className: "carousel-control-prev",
    role: "button",
    tabIndex: currentIndex,
    onClick: function onClick() {
      return props.onImageClick(currentIndex === 0 ? props.elements[props.elements.length - 1] : props.elements[currentIndex - 1]);
    }
  }, React__default.createElement(ChevronLeft, null)), React__default.createElement("a", {
    className: "carousel-control-next",
    tabIndex: currentIndex,
    role: "button",
    onClick: function onClick() {
      return props.onImageClick(currentIndex === props.elements.length - 1 ? props.elements[0] : props.elements[currentIndex + 1]);
    }
  }, React__default.createElement(ChevronRight, null)), React__default.createElement("ol", {
    className: "carousel-indicators"
  }, props.elements.map(function (item) {
    return React__default.createElement(InvertedIndicator, {
      key: item._uid,
      active: props.lightbox === item._uid,
      color: "light",
      onClick: function onClick() {
        return props.onImageClick(item);
      }
    });
  })));
}

function ImageListLightbox(props) {
  return React__default.createElement(Dialog, {
    fullScreen: true,
    className: props.className,
    onEscapeKeyDown: function onEscapeKeyDown() {
      return props.setLightbox();
    },
    open: !!props.lightbox
  }, React__default.createElement(DialogTitle, null, React__default.createElement(IconButton, {
    className: "text-white",
    onClick: function onClick() {
      return props.setLightbox();
    }
  }, React__default.createElement(Close, null))), Swipe(props));
}

var useGridListStyles = /*#__PURE__*/styles.makeStyles(function (theme) {
  return styles.createStyles({
    gridList: function gridList(props) {
      var _opts2;

      if (!props.isMasonry) {
        var _MuiGridListTileR;

        var _opts = {
          '& .MuiGridListTile-root': (_MuiGridListTileR = {
            width: 100 / Number(props.columnCount || 4) * 1 + "% !important"
          }, _MuiGridListTileR[theme.breakpoints.only('xs')] = {
            width: 100 / Number(props.columnCountPhone || 1) * 1 + "% !important"
          }, _MuiGridListTileR)
        };

        if (props.columnCountTablet) {
          _opts[theme.breakpoints.between('sm', 'md')] = {
            '& .MuiGridListTile-root': {
              width: 100 / Number(props.columnCountTablet) * 1 + "% !important"
            }
          };
        }

        return _opts;
      }

      var opts = (_opts2 = {
        columnCount: Number(props.columnCount || 4)
      }, _opts2[theme.breakpoints.only('xs')] = {
        columnCount: Number(props.columnCountPhone || 2)
      }, _opts2);

      if (props.columnCountTablet) {
        opts[theme.breakpoints.between('sm', 'md')] = {
          columnCount: Number(props.columnCountTablet)
        };
      }

      return opts;
    },
    masonry: {
      '& img': {
        display: 'block',
        width: '100%',
        height: 'auto'
      },
      '& .MuiGridList-root': {
        display: 'block'
      },
      '& .MuiGridListTile-root': {
        width: 'auto !important',
        breakInside: 'avoid-column',
        position: 'relative'
      }
    }
  });
});

var useImageListStyles = /*#__PURE__*/styles.makeStyles({
  lightbox: {
    '& .MuiPaper-root': {
      backgroundColor: 'rgba(0,0,0,0.9)'
    },
    '& .MuiDialogTitle-root': {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 2
    },
    '& .carousel': {
      height: '100%'
    },
    '& .carousel-inner': {
      height: '100%'
    },
    '& .react-swipeable-view-container': {
      height: '100%',
      '& .carousel-item': {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    },
    '& .MuiSvgIcon-root': {
      color: 'white'
    },
    '& .carousel-indicators': {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      textAlign: 'center'
    },
    '& .carousel-control-next, & .carousel-control-prev': {
      position: 'absolute',
      height: '100%',
      top: 0,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: '4rem',
        color: 'rgba(255,255,255,0.8)'
      }
    },
    '& .carousel-control-next': {
      right: 0
    }
  },
  root: {
    overflowX: 'hidden'
  },
  aspectRatio: {
    '& .MuiGridListTile-tile': {
      // paddingBottom: '56.25%',
      '& img': {
        position: 'absolute',
        // top: 0,
        // left: 0,
        // width: '100%',
        // height: '100%'
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }
    },
    '&.ratio-* .MuiGridListTile-tile': {
      '& img': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%' // top: '50%',
        // left: '50%',
        // transform: 'translate(-50%, -50%)',

      }
    },
    '&.ratio-1x1 .MuiGridListTile-tile': {
      paddingBottom: '100%'
    },
    '&.ratio-4x3 .MuiGridListTile-tile': {
      paddingBottom: '75%'
    },
    '&.ratio-3x2 .MuiGridListTile-tile': {
      paddingBottom: '66.66%'
    },
    '&.ratio-16x9 .MuiGridListTile-tile': {
      paddingBottom: '56.25%'
    },
    '&.ratio-3x4 .MuiGridListTile-tile': {
      paddingBottom: '133.33%'
    },
    '&.ratio-2x3 .MuiGridListTile-tile': {
      paddingBottom: '150%'
    }
  }
});

var homepageLinkHandler = function homepageLinkHandler() {
  if (CONFIG.rootDirectory) {
    return '/home';
  }

  var appLocale = getGlobalState('locale');
  return appLocale && appLocale !== CONFIG.defaultLocale ? "/" + appLocale + "/home" : '/home';
};
var linkHandler = function linkHandler(link, options) {
  var props = {
    href: '/'
  };
  var cachedUrl = link.cached_url;

  if (!cachedUrl) {
    if (link.email) {
      props.href = "mailto:" + link.email.replace('mailto:', '');
      props.external = true;
      return props;
    }

    return {};
  }

  if (link.linktype === 'story') {
    props.href = lumenCmsUtils.internalLinkHandler(cachedUrl) + (link.anchor ? "#" + link.anchor : '');
  } else if (link.linktype === 'asset') {
    props.href = cachedUrl;
    props.download = cachedUrl;
    props.external = true;
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  } else {
    var href = cachedUrl || '';

    if (/\S+@\S+\.\S+/.test(href)) {
      href = "mailto:" + href.replace('mailto:', '');
    } else if (href.includes('+')) {
      href = "tel:" + href.replace('+', '');
    }

    if (options.openExternal) {
      props.target = '_blank';
      props.rel = 'noopener noreferrer';
    }

    props.external = true;
    props.href = href;
  }

  return props;
};
var getLinkAttrs = function getLinkAttrs(link, options) {
  if (link === void 0) {
    link = {};
  }

  if (options === void 0) {
    options = {};
  }

  return linkHandler(link, options);
};

var toggleLeftNavigation = function toggleLeftNavigation() {
  setGlobalState('leftNavigationDrawer', function (value) {
    return !value;
  });
};
var toggleRightNavigation = function toggleRightNavigation() {
  setGlobalState('rightNavigationDrawer', function (value) {
    return !value;
  });
};
var closeNavigationDrawers = function closeNavigationDrawers() {
  setGlobalState('leftNavigationDrawer', false);
  setGlobalState('rightNavigationDrawer', false);
}; // export const setAppSetup = (options: State['appSetup']) => {
//   setGlobalState('appSetup', options)
// }

var addSearchParamsToUrl = function addSearchParamsToUrl(_ref) {
  var categories = _ref.categories,
      searchText = _ref.searchText;
  var currentUrl = new URL(window.location.href);

  if (categories) {
    currentUrl.searchParams["delete"]('search__categories');
    categories.forEach(function (category) {
      currentUrl.searchParams.append('search__categories', category);
    });
  }

  if (searchText !== undefined) {
    if (!searchText) {
      currentUrl.searchParams["delete"]('search__text');
    } else {
      currentUrl.searchParams.set('search__text', searchText);
    }
  }

  window.history.pushState({
    path: currentUrl.href
  }, '', currentUrl.href);
  window.scrollTo(0, 0);
};

var onSearchTextChange = function onSearchTextChange(searchText) {
  setGlobalState('searchParams', function (v) {
    return _extends({}, v, {
      searchText: searchText
    });
  });
  addSearchParamsToUrl({
    searchText: searchText
  });
};
var setSearchCategory = function setSearchCategory(categories) {
  setGlobalState('searchParams', function (v) {
    return _extends({}, v, {
      categories: categories
    });
  });
  addSearchParamsToUrl({
    categories: categories
  });
};

var defaultValue$1 = {
  hasDrawer: false,
  hasFeatureImage: false,
  hasRightDrawer: false,
  drawerVariant: 'temporary',
  drawerBelowToolbar: false,
  hasScrollCollapse: false
};
var AppSetupContext = /*#__PURE__*/React.createContext(defaultValue$1);
var useAppSetup = function useAppSetup() {
  return React.useContext(AppSetupContext);
};

function useScrollTop() {
  var scrolledWithoutHysteresis = useScrollTrigger({
    disableHysteresis: true,
    threshold: 60
  }); // const [value] = useDebounce(scrolledWithoutHysteresis, 700)

  return scrolledWithoutHysteresis;
}

var useStyles$8 = /*#__PURE__*/styles.makeStyles(function (theme) {
  var _lmScrolled, _contentSpace;

  return styles.createStyles({
    contentSpace: (_contentSpace = {
      height: theme.toolbar.height.custom ? Number(theme.toolbar.height.custom) : theme.toolbar.height.mobile,
      transitionDuration: '500ms'
    }, _contentSpace[theme.breakpoints.up('xs') + " and (orientation: landscape)"] = {
      height: theme.toolbar.height.custom ? Math.round(theme.toolbar.height.custom * 0.86) + theme.toolbar.height.systemBar : theme.toolbar.height.landscape + theme.toolbar.height.systemBar
    }, _contentSpace[theme.breakpoints.up('sm')] = {
      height: theme.toolbar.height.custom ? Math.round(theme.toolbar.height.custom * 1.15) + theme.toolbar.height.systemBar : theme.toolbar.height.desktop + theme.toolbar.height.systemBar
    }, _contentSpace['&.lm-scrolled'] = (_lmScrolled = {
      height: theme.toolbar.height.mobile
    }, _lmScrolled[theme.breakpoints.up('xs') + " and (orientation: landscape)"] = {
      height: theme.toolbar.height.landscape // + theme.toolbar.height.systemBar

    }, _lmScrolled[theme.breakpoints.up('sm')] = {
      height: theme.toolbar.height.desktop // + theme.toolbar.height.systemBar

    }, _lmScrolled), _contentSpace)
  });
});

function ContentSpace() {
  var classes = useStyles$8();
  var appSetup = useAppSetup();
  var scrolledWithoutHysteresis = useScrollTop();
  return React__default.createElement("div", {
    className: clsx('lm-content-space', classes.contentSpace, {
      'lm-scrolled': scrolledWithoutHysteresis && (appSetup.toolbarMainHeight || appSetup.hasFeatureImage)
    })
  });
}

var usePageStyles = /*#__PURE__*/styles.makeStyles(function (theme) {
  var _rightMobileSm, _rightMobileMd, _rightMobileLg, _leftMobileSm, _leftMobileMd, _leftMobileLg;

  return styles.createStyles({
    rightDocked: {
      width: theme.drawer.right,
      zIndex: theme.zIndex.appBar - 1
    },
    rightModal: {
      '& .lm-content-space': {
        display: 'none'
      }
    },
    rightDrawerPaper: {
      width: theme.drawer.right,
      padding: theme.spacing(2)
    },
    rightContent: {
      overflowY: 'auto'
    },
    content: {
      transition: theme.transitions.create(['margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    contentWithRight: {
      marginRight: theme.drawer.right
    },
    'right-mobile-sm': (_rightMobileSm = {}, _rightMobileSm[theme.breakpoints.only('xs')] = {
      marginRight: '0 !important'
    }, _rightMobileSm),
    'right-mobile-md': (_rightMobileMd = {}, _rightMobileMd[theme.breakpoints.down('sm')] = {
      marginRight: 0
    }, _rightMobileMd),
    'right-mobile-lg': (_rightMobileLg = {}, _rightMobileLg[theme.breakpoints.down('md')] = {
      marginRight: 0
    }, _rightMobileLg),
    leftShift: {
      marginLeft: theme.drawer.left,
      transition: theme.transitions.create(['margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    'left-mobile-sm': (_leftMobileSm = {}, _leftMobileSm[theme.breakpoints.only('xs')] = {
      marginLeft: 0
    }, _leftMobileSm),
    'left-mobile-md': (_leftMobileMd = {}, _leftMobileMd[theme.breakpoints.down('sm')] = {
      marginLeft: 0
    }, _leftMobileMd),
    'left-mobile-lg': (_leftMobileLg = {}, _leftMobileLg[theme.breakpoints.down('md')] = {
      marginLeft: 0
    }, _leftMobileLg)
  });
});

var RightDrawerContainer = function RightDrawerContainer(_ref) {
  var children = _ref.children;
  var classes = usePageStyles();
  var theme = styles.useTheme();
  var appSetup = useAppSetup();
  var matches = useMediaQuery(theme.breakpoints.up(appSetup.rightDrawerMediaBreakpoint || 'sm')); // const { isMobile } = useDeviceDimensions()

  var _useGlobalState = useGlobalState('rightNavigationDrawer'),
      rightIsOpen = _useGlobalState[0];

  return React__default.createElement(Drawer, {
    variant: !matches ? 'temporary' : 'permanent',
    anchor: "right",
    classes: {
      paper: classes.rightDrawerPaper,
      modal: classes.rightModal,
      paperAnchorDockedRight: classes.rightDocked
    },
    open: !matches ? rightIsOpen : true,
    onClose: function onClose() {
      return closeNavigationDrawers();
    }
  }, children);
};

RightDrawerContainer.displayName = 'RightDrawerContainer';

function RightDrawer(_ref2) {
  var rightBody = _ref2.rightBody;
  var classes = usePageStyles();
  return React__default.createElement(RightDrawerContainer, null, React__default.createElement(ContentSpace, null), React__default.createElement("div", {
    className: classes.rightContent
  }, rightBody.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  })));
}

var MainContentContainer = function MainContentContainer(_ref) {
  var _clsx;

  var children = _ref.children;
  var classes = usePageStyles();
  var appSetup = useAppSetup();

  var _useGlobalState = useGlobalState('leftNavigationDrawer'),
      isOpen = _useGlobalState[0];

  return React__default.createElement("main", {
    className: clsx(classes.content, (_clsx = {}, _clsx[classes.contentWithRight] = appSetup.hasRightDrawer, _clsx[classes["right-mobile-" + (appSetup.rightDrawerMediaBreakpoint || 'sm')]] = true, _clsx[classes.leftShift] = appSetup.drawerVariant !== 'temporary' && isOpen, _clsx[classes["left-mobile-" + (appSetup.leftDrawerMediaBreakpoint || 'sm')]] = appSetup.drawerVariant !== 'temporary' && isOpen, _clsx))
  }, children);
};

MainContentContainer.displayName = 'MainContentContainer';
function MainContent(_ref2) {
  var body = _ref2.body;
  return React__default.createElement(MainContentContainer, null, body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }));
}

function LmPage(_ref) {
  var content = _ref.content;
  var body = content.body || [];
  var rightBody = content.right_body || [];

  if (!body.length) {
    return React__default.createElement("div", null, "There is no content yet...");
  }

  if (!body.some(function (i) {
    return i.component === 'section_parallax';
  })) {
    return React__default.createElement(React__default.Fragment, null, rightBody.length > 0 && React__default.createElement(RightDrawer, {
      rightBody: rightBody
    }), React__default.createElement(MainContent, {
      body: body
    }));
  }

  return React__default.createElement(reactScrollParallax.ParallaxProvider, null, rightBody.length > 0 && React__default.createElement(RightDrawer, {
    rightBody: rightBody
  }), React__default.createElement(MainContent, {
    body: body
  }));
}

function LmAccordionItem(_ref) {
  var content = _ref.content,
      options = _ref.options,
      setOpen = _ref.setOpen,
      opened = _ref.opened,
      iteration = _ref.iteration;

  var _useState = React.useState(''),
      isOpen = _useState[0],
      setIsOpen = _useState[1];

  var handleChange = function handleChange(panel) {
    return function (_, isExpanded) {
      options.restrict_one ? setOpen(isExpanded ? panel : '') : setIsOpen(isExpanded ? panel : '');
    };
  };

  var panelKey = "panel-" + iteration;
  var expanded = options.restrict_one ? opened === panelKey : isOpen === panelKey;
  return React__default.createElement(Accordion, {
    square: !!options.square,
    expanded: expanded,
    onChange: handleChange(panelKey)
  }, React__default.createElement(AccordionSummary, {
    expandIcon: content.use_plus_icon || options.use_plus ? React__default.createElement(Plus, null) : React__default.createElement(ChevronDown, null)
  }, React__default.createElement(Typography, null, content.title)), React__default.createElement(AccordionDetails, null, React__default.createElement("div", null, (content.body || []).map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }))));
}

function LmStaticSection(_ref) {
  var content = _ref.content;

  var _useAppContext = useAppContext(),
      allStaticContent = _useAppContext.allStaticContent;

  if (!content.container) {
    return null;
  }

  var containerContent = allStaticContent.find(function (item) {
    return item.uuid === content.container;
  });
  var body = containerContent && containerContent.content && containerContent.content.body || [];
  return React__default.createElement("div", {
    className: clsx(content.class_names && content.class_names.values)
  }, body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }));
}

function LmStaticContainer(_ref) {
  var content = _ref.content;
  return React__default.createElement("div", {
    className: "lm-static-container"
  }, (content.body || []).map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }));
}

var ScriptStatus;

(function (ScriptStatus) {
  ScriptStatus["IDLE"] = "idle";
  ScriptStatus["LOADING"] = "loading";
  ScriptStatus["READY"] = "ready";
  ScriptStatus["ERROR"] = "error";
})(ScriptStatus || (ScriptStatus = {}));
/**
 * Hook to load an external script. Returns true once the script has finished loading.
 *
 * @param url {string} url The external script to load
 * @param attributes {} attributes Script tag attributes
 * */


function useScript(url, attributes) {
  var clientHydrated = useClientHydrated();

  var _useState = React.useState(function () {
    if (clientHydrated) {
      var script = document.querySelector("script[src=\"" + url + "\"]");

      if (script === null || script === void 0 ? void 0 : script.hasAttribute('data-status')) {
        return script.getAttribute('data-status');
      }
    }

    return url ? ScriptStatus.LOADING : ScriptStatus.IDLE;
  }),
      status = _useState[0],
      setStatus = _useState[1];

  React.useEffect(function () {
    if (!url) {
      setStatus(ScriptStatus.IDLE);
      return undefined;
    }

    var script = document.querySelector("script[src=\"" + url + "\"]");

    if (!script) {
      script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.setAttribute('data-status', ScriptStatus.LOADING);
      document.head.appendChild(script);

      if (attributes) {
        Object.keys(attributes).forEach(function (key) {
          var _script;

          (_script = script) === null || _script === void 0 ? void 0 : _script.setAttribute(key, attributes[key]);
        });
      } // Ensure the status is loading


      setStatus(ScriptStatus.LOADING);

      script.onerror = function () {
        var _script2;

        return (_script2 = script) === null || _script2 === void 0 ? void 0 : _script2.setAttribute('data-status', ScriptStatus.ERROR);
      };

      script.onload = function () {
        var _script3;

        return (_script3 = script) === null || _script3 === void 0 ? void 0 : _script3.setAttribute('data-status', ScriptStatus.READY);
      };
    } else if (script.hasAttribute('data-status')) {
      setStatus(script.getAttribute('data-status'));
    }

    var eventHandler = function eventHandler(e) {
      setStatus(e.type === 'load' ? ScriptStatus.READY : ScriptStatus.ERROR);
    }; // Add load event listener


    script.addEventListener('load', eventHandler);
    script.addEventListener('error', eventHandler);
    return function () {
      if (script) {
        script.removeEventListener('load', eventHandler);
        script.removeEventListener('error', eventHandler);
      }
    };
  }, [url, attributes]);
  return [status === ScriptStatus.READY, status];
}

function LmHubspotMeeting(_ref) {
  var content = _ref.content,
      disableEmbed = _ref.disableEmbed;
  var dataSrc = "https://app.hubspot.com/meetings/" + content.meeting_name + "?embed-true=" + (disableEmbed ? 'false' : 'true');

  var _useScript = useScript(content.meeting_name ? "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js?id=" + new Date().getTime() : ''),
      status = _useScript[1];

  if (status === ScriptStatus.ERROR) {
    console.error('script of hubspot not loaded');
  }

  return React__default.createElement("div", {
    className: "lm-hubspot-meeting"
  }, content.meeting_name, React__default.createElement("div", {
    className: "meetings-iframe-container",
    "data-src": dataSrc
  }));
}

var useStyles$9 = /*#__PURE__*/styles.makeStyles({
  fullHeight: {
    width: '100%',
    height: '100%',
    minHeight: '100vh'
  },
  background: {
    position: 'relative',
    overflow: 'hidden',
    '& .MuiGrid-root': {
      position: 'relative'
    }
  },
  dark: {
    '& .MuiButton-root.lm-default-color, & .MuiIconButton-root.lm-default-color': {
      color: 'inherit',
      '&.MuiButton-outlined,&.lm-outlined': {
        borderColor: 'currentColor'
      }
    }
  }
});
function LmSection(_ref) {
  var _clsx, _clsx2;

  var content = _ref.content;
  var classes = useStyles$9();
  var theme = styles.useTheme();
  var background = Array.isArray(content.background) && content.background[0];

  var _useBackgroundBox = useBackgroundBox({
    variant: content.variant,
    background: background
  }),
      style = _useBackgroundBox.style,
      className = _useBackgroundBox.className;

  var body = content.body || [];
  var containerStyles = {};
  var isFullHeight = !!(content.property && content.property.includes('is_full_height'));

  if (!isFullHeight) {
    var _content$padding;

    var splittedPadding = ((_content$padding = content.padding) === null || _content$padding === void 0 ? void 0 : _content$padding.split(' ')) || [];

    if (splittedPadding.length > 2) {
      containerStyles.padding = content.padding;
    }

    containerStyles.paddingTop = splittedPadding[0] || '2.5rem';
    containerStyles.paddingBottom = splittedPadding[0] || '2.5rem';
  }

  var maxWidth = content.max_width ? content.max_width === 'none' ? false : content.max_width : theme.defaultContainerWidth; // todo className doubled used

  return React__default.createElement("div", {
    className: clsx(classes.background, (_clsx = {}, _clsx[classes.dark] = !!content.variant, _clsx), className),
    style: style,
    id: content.section_identifier || content._uid
  }, ((background === null || background === void 0 ? void 0 : background.image) || (background === null || background === void 0 ? void 0 : background.background_elements)) && React__default.createElement(BackgroundImage, {
    content: background,
    backgroundStyle: content.background_style
  }), (background === null || background === void 0 ? void 0 : background.background_elements) && background.background_elements.length > 0 && React__default.createElement(BackgroundElements, {
    elements: background.background_elements
  }), React__default.createElement(Container, {
    style: containerStyles,
    maxWidth: maxWidth,
    className: clsx(className, (_clsx2 = {}, _clsx2[classes.fullHeight] = isFullHeight, _clsx2))
  }, body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  })));
}

function LmImageListItem(props) {
  var content = props.content,
      listProps = props.listProps;

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      inViewRef = _useInView[0],
      inView = _useInView[1],
      currentRef = _useInView[2];

  var _useState = React.useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1]; // const width = listProps.width


  var imageProps = {};

  if (inView && content.source && (currentRef === null || currentRef === void 0 ? void 0 : currentRef.target)) {
    // if (listProps.image_crop && !listProps.masonry /*|| (!listProps.masonry && !listProps.fit_in_color)*/) {
    //   height = listProps.height
    // }
    var tile = currentRef.target.closest('.MuiGridListTile-root');

    if (tile) {
      var width = tile === null || tile === void 0 ? void 0 : tile.clientWidth;
      var height = tile === null || tile === void 0 ? void 0 : tile.clientHeight;
      width = Math.ceil(width);
      var respectImgRatio = listProps.masonry || !listProps.aspect_ratio || !listProps.image_crop;
      height = respectImgRatio ? 0 : height && Math.ceil(height);
      var imgSrc = getImageAttrs({
        originalSource: content.source,
        width: width,
        height: height,
        smart: listProps.image_crop === 'smart',
        fitInColor: listProps.fit_in_color
      });
      imageProps = _extends({}, imgSrc, {
        width: width || undefined,
        height: height || undefined
      });
    }
  }

  function onLoad() {
    setLoaded(true);
  }

  return React__default.createElement(React__default.Fragment, null, !loaded && React__default.createElement(Skeleton, {
    width: "100%",
    height: "100%",
    style: {
      position: 'absolute'
    },
    variant: "rect"
  }), React__default.createElement(Fade, {
    "in": loaded
  }, React__default.createElement("img", Object.assign({}, imageProps, {
    ref: inViewRef,
    alt: content.alt || content.label || 'image list item',
    onLoad: onLoad
  }))), (content.label || content.sub_title) && React__default.createElement(GridListTileBar, {
    title: content.label,
    subtitle: content.sub_title,
    titlePosition: listProps.label_position || 'bottom'
  }));
}

var useStyles$a = /*#__PURE__*/styles.makeStyles({
  avatar: {
    '&.small': {
      width: 24,
      height: 24
    },
    '&.large': {
      width: 52,
      height: 52
    },
    '&.xlarge': {
      width: 64,
      height: 64
    }
  }
});
function LmMuiAvatar(_ref) {
  var _clsx;

  var src = _ref.src,
      size = _ref.size;
  var classes = useStyles$a();

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      reference = _useInView[0],
      inView = _useInView[1];

  var _useState = React.useState({
    src: '',
    srcSet: ''
  }),
      imageAttrs = _useState[0],
      setImageSrc = _useState[1];

  React.useEffect(function () {
    if (!inView) {
      return;
    }

    var imgAttrs = getImageAttrs({
      originalSource: src,
      width: 128
    });
    setImageSrc(imgAttrs);
  }, [inView, src]);
  return React__default.createElement(Avatar, {
    ref: reference,
    src: imageAttrs.src,
    srcSet: imageAttrs.srcSet,
    className: clsx(classes.avatar, (_clsx = {}, _clsx[size] = !!size, _clsx))
  });
}

var mapSize = {
  dense: 'small',
  'lm-button-large': 'large'
};
var mapIconButtonSize = {
  dense: 'small'
};
var mapAvatarSize = {
  dense: 'small',
  'lm-button-large': 'large',
  'lm-button-xlarge': 'xlarge'
};
var mapVariant = {
  raised: 'contained',
  outlined: 'outlined',
  unelevated: 'contained'
};
var mapColor = {
  dark: 'primary',
  light: 'default',
  primary: 'primary',
  secondary: 'secondary',
  primary_text: 'inherit',
  secondary_text: 'inherit',
  inherit: 'inherit'
};
var useStyles$b = /*#__PURE__*/styles.makeStyles(function (theme) {
  return {
    button: {
      '&.lm-button-shaped': {
        borderRadius: '2em'
      },
      '&.lm-button-square': {
        borderRadius: '0'
      },
      '&.lm-button-xlarge': {
        fontSize: '20px',
        '& .MuiIcon-root': {
          fontSize: '1.8rem'
        },
        '&.MuiFab-root': {
          height: '64px',
          minHeight: '64px',
          '&:not(.MuiFab-extended)': {
            width: '64px'
          }
        },
        '&.MuiFab-extended': {
          paddingLeft: '1.8rem',
          paddingRight: '1.8rem',
          borderRadius: '31px'
        }
      },
      '&.lm-outlined': {
        '&.MuiIconButton-root': {
          border: "1px solid rgba(0,0,0,0.23)"
        },
        '&.MuiIconButton-colorSecondary': {
          border: "1px solid " + theme.palette.secondary.main
        },
        '&.MuiIconButton-colorPrimary': {
          border: "1px solid " + theme.palette.primary.main
        }
      },
      '&.lm-unelevated': {
        boxShadow: 'none'
      }
    }
  };
});
var LmButton = function LmButton(_ref) {
  var _content$class_names, _clsx, _content$properties2, _content$custom_color4, _content$custom_color5, _content$custom_color6, _content$icon3, _content$trailing_ico;

  var children = _ref.children,
      content = _ref.content,
      onClick = _ref.onClick;
  var classes = useStyles$b();
  var properties = content.properties || [];
  var disableRipple = !!properties.find(function (i) {
    return i === 'disable-ripple';
  });
  var isUnelevated = properties.find(function (i) {
    return i === 'disable-shadow';
  }) || content.variant === 'unelevated';
  var color = content.color ? mapColor[content.color] : undefined;
  var className = clsx(classes.button, (_content$class_names = content.class_names) === null || _content$class_names === void 0 ? void 0 : _content$class_names.values, (_clsx = {
    'lm-default-color': !content.color
  }, _clsx[content.corners] = !!content.corners, _clsx['lm-unelevated'] = isUnelevated, _clsx['lm-outlined'] = content.variant === 'outlined', _clsx[content.size] = !!content.size, _clsx["lm-font-" + content.font] = content.font, _clsx['w-100'] = properties.find(function (p) {
    return p === 'fullWidth';
  }), _clsx));
  var btnProps = content.link ? _extends({}, getLinkAttrs(content.link, {
    openExternal: !!content.open_external
  }), {
    naked: true,
    component: LmCoreComponents.lm_link_render
  }) : {};

  if (onClick) {
    btnProps.onClick = onClick;
  }

  if (content.variant === 'fab') {
    var _content$properties, _content$custom_color, _content$icon;

    return React__default.createElement(Fab, Object.assign({
      variant: content.label ? 'extended' : undefined
    }, btnProps, {
      className: className,
      style: {
        whiteSpace: ((_content$properties = content.properties) === null || _content$properties === void 0 ? void 0 : _content$properties.includes('no-linebreak')) ? 'nowrap' : undefined,
        backgroundColor: ((_content$custom_color = content.custom_color) === null || _content$custom_color === void 0 ? void 0 : _content$custom_color.rgba) ? content.custom_color.rgba : undefined
      },
      size: mapSize[content.size] || 'medium',
      color: color,
      disableRipple: disableRipple
    }), React__default.createElement(IconCore, {
      iconName: (_content$icon = content.icon) === null || _content$icon === void 0 ? void 0 : _content$icon.name,
      buttonSize: content.size
    }), content.image && React__default.createElement(LmMuiAvatar, {
      src: content.image,
      size: mapAvatarSize[content.size]
    }), children || content.label, React__default.createElement(IconCore, {
      iconName: content.trailing_icon && content.trailing_icon.name,
      buttonSize: content.size
    }));
  }

  if (!content.label) {
    var _content$custom_color2, _content$custom_color3, _content$icon2;

    return React__default.createElement(IconButton, Object.assign({
      color: color
    }, btnProps, {
      size: mapIconButtonSize[content.size] || 'medium',
      disableRipple: disableRipple,
      style: {
        color: ((_content$custom_color2 = content.custom_color) === null || _content$custom_color2 === void 0 ? void 0 : _content$custom_color2.rgba) ? content.custom_color.rgba : undefined,
        borderColor: content.variant === 'outlined' && ((_content$custom_color3 = content.custom_color) === null || _content$custom_color3 === void 0 ? void 0 : _content$custom_color3.rgba) ? content.custom_color.rgba : undefined
      },
      className: className
    }), React__default.createElement(IconCore, {
      iconName: (_content$icon2 = content.icon) === null || _content$icon2 === void 0 ? void 0 : _content$icon2.name,
      buttonSize: content.size
    }), content.image && React__default.createElement(LmMuiAvatar, {
      src: content.image,
      size: mapAvatarSize[content.size]
    }));
  }

  return React__default.createElement(Button, Object.assign({
    size: mapSize[content.size]
  }, btnProps, {
    className: className,
    variant: mapVariant[content.variant],
    disabled: disableRipple,
    color: color,
    style: {
      justifyContent: content.align ? content.align : undefined,
      whiteSpace: ((_content$properties2 = content.properties) === null || _content$properties2 === void 0 ? void 0 : _content$properties2.includes('no-linebreak')) ? 'nowrap' : undefined,
      color: !['raised', 'unelevated'].includes(content.variant || '') && ((_content$custom_color4 = content.custom_color) === null || _content$custom_color4 === void 0 ? void 0 : _content$custom_color4.rgba) ? content.custom_color.rgba : undefined,
      backgroundColor: ['raised', 'unelevated'].includes(content.variant || '') && ((_content$custom_color5 = content.custom_color) === null || _content$custom_color5 === void 0 ? void 0 : _content$custom_color5.rgba) ? content.custom_color.rgba : undefined,
      borderColor: content.variant === 'outlined' && ((_content$custom_color6 = content.custom_color) === null || _content$custom_color6 === void 0 ? void 0 : _content$custom_color6.rgba) ? content.custom_color.rgba : undefined
    },
    startIcon: ((_content$icon3 = content.icon) === null || _content$icon3 === void 0 ? void 0 : _content$icon3.name) ? React__default.createElement(IconCore, {
      iconName: content.icon.name,
      buttonSize: content.size
    }) : undefined,
    endIcon: ((_content$trailing_ico = content.trailing_icon) === null || _content$trailing_ico === void 0 ? void 0 : _content$trailing_ico.name) ? React__default.createElement(IconCore, {
      iconName: content.trailing_icon.name,
      buttonSize: content.size
    }) : undefined
  }), content.image && React__default.createElement(LmMuiAvatar, {
    src: content.image,
    size: mapAvatarSize[content.size]
  }), children || content.label);
};
LmButton.displayName = 'LmButton';

function useDeviceDimensions() {
  var theme = styles.useTheme();
  var isMobile = useMediaQuery(theme.breakpoints.only('xs'));
  return {
    isMobile: isMobile
  };
}

function LmNavListItem(props) {
  var _content$link;

  var content = _extends({}, props);

  var btnProps = ((_content$link = content.link) === null || _content$link === void 0 ? void 0 : _content$link.cached_url) ? _extends({}, getLinkAttrs(content.link, {
    openExternal: !!content.open_external
  }), {
    naked: true,
    component: LmCoreComponents.lm_link_render
  }) : {};
  return React__default.createElement(MuiLink, Object.assign({}, btnProps), content.name);
}

var useStyles$c = /*#__PURE__*/styles.makeStyles({
  root: {
    '& .MuiTypography-root': {
      display: 'inline-block',
      paddingRight: '12px',
      '&:last-child': {
        paddingRight: '0px'
      }
    },
    '&.lm-nav-list__column .MuiTypography-root': {
      display: 'block'
    }
  }
});
function LmNavList(_ref) {
  var content = _ref.content;
  var classes = useStyles$c();

  var _useDeviceDimensions = useDeviceDimensions(),
      isMobile = _useDeviceDimensions.isMobile;

  var body = content && content.body || [];
  var properties = content.properties || [];
  var header = content.header;

  if (isMobile && content.collapse_on_mobile || content.forceCollapse) {
    return React__default.createElement(ExpansionPanel, null, React__default.createElement(ExpansionPanelSummary, {
      expandIcon: content.collapse_icon && content.collapse_icon.name ? React__default.createElement(IconCore, {
        iconName: content.collapse_icon.name
      }) : React__default.createElement(ChevronDown, null)
    }, React__default.createElement(Typography, null, content.header)), React__default.createElement(ExpansionPanelDetails, null, React__default.createElement("div", {
      className: clsx('lm-nav-list', content.class_names && content.class_names.values, {
        'lm-nav-list__column': properties.find(function (i) {
          return i === 'flex-column';
        })
      }, classes.root)
    }, body.map(function (blok) {
      return React__default.createElement(LmNavListItem, Object.assign({}, blok, {
        key: blok._uid
      }));
    }))));
  }

  var navClassNames = clsx(content.style);
  return React__default.createElement("div", {
    className: clsx('lm-nav-list', content.class_names && content.class_names.values, {
      'lm-nav-list__column': properties.find(function (i) {
        return i === 'flex-column';
      })
    }, classes.root)
  }, header && React__default.createElement("h4", null, header), React__default.createElement("nav", {
    className: navClassNames
  }, body.map(function (blok) {
    return React__default.createElement(LmNavListItem, Object.assign({}, blok, {
      key: blok._uid
    }));
  })));
}

var useStyles$d = /*#__PURE__*/styles.makeStyles({
  paper: function paper(props) {
    return {
      borderRadius: props.border_radius
    };
  }
});
function LmMenu(_ref) {
  var _content$start_icon;

  var content = _ref.content;
  var classes = useStyles$d(content);

  var _React$useState = React__default.useState(null),
      anchorEl = _React$useState[0],
      setAnchorEl = _React$useState[1];

  var menuItems = content.body || [];
  var isCustom = menuItems.length && menuItems[0].component !== 'nav_menu_item';
  var router$1 = router.useRouter();
  var asPath = router$1 === null || router$1 === void 0 ? void 0 : router$1.asPath;

  var handleClose = function handleClose() {
    setAnchorEl(null);
  };

  React.useEffect(function () {
    handleClose();
  }, [asPath]);

  var handleClick = function handleClick(event) {
    setAnchorEl(event.currentTarget);
  };

  var addons = {};

  if (content.alignment === 'bottomStart') {
    addons = {
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left'
      }
    };
  } else if (content.alignment === 'bottomEnd') {
    addons = {
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    };
  } else if (content.alignment === 'bottomCenter') {
    addons = {
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'center'
      }
    };
  }

  var ExpandIcon = content.icon && content.icon.name ? React__default.createElement(IconCore, {
    iconName: content.icon.name
  }) : React__default.createElement(ChevronDown, null);
  var CloseIcon = content.icon_collapse && content.icon_collapse.name ? React__default.createElement(IconCore, {
    iconName: content.icon_collapse.name
  }) : React__default.createElement(ChevronUp, null); // const StartIcon = content.start_icon?.name ? <LmIcon iconName={content.start_icon.name} /> : null

  return React__default.createElement(React__default.Fragment, null, React__default.createElement(Button, {
    endIcon: anchorEl ? CloseIcon : ExpandIcon,
    startIcon: ((_content$start_icon = content.start_icon) === null || _content$start_icon === void 0 ? void 0 : _content$start_icon.name) && React__default.createElement(IconCore, {
      iconName: content.start_icon.name
    }),
    "aria-controls": "simple-menu",
    "aria-haspopup": "true",
    className: "lm-default-color",
    onClick: handleClick
  }, content.title), isCustom ? React__default.createElement(core.Popover, Object.assign({
    open: Boolean(anchorEl),
    onClose: handleClose,
    anchorEl: anchorEl,
    classes: {
      paper: classes.paper
    }
  }, addons), React__default.createElement("div", {
    style: {
      padding: 16
    }
  }, menuItems.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }))) : React__default.createElement(Menu, Object.assign({
    open: Boolean(anchorEl),
    onClose: handleClose,
    anchorEl: anchorEl,
    classes: {
      paper: classes.paper
    }
  }, addons), menuItems.map(function (nestedProps) {
    var _nestedProps$link;

    var btnProps = ((_nestedProps$link = nestedProps.link) === null || _nestedProps$link === void 0 ? void 0 : _nestedProps$link.cached_url) ? _extends({}, getLinkAttrs(nestedProps.link, {
      openExternal: !!nestedProps.open_external
    }), {
      // naked: true,
      component: LmCoreComponents.lm_link_render
    }) : {};
    return React__default.createElement(MenuItem, Object.assign({}, btnProps, {
      key: nestedProps._uid
    }), nestedProps.label);
  })));
}

var useStyles$e = /*#__PURE__*/styles.makeStyles({
  icon: {
    '&.xmall': {
      fontSize: '1rem'
    },
    '&.small': {
      fontSize: '1.25rem'
    },
    '&.medium': {
      fontSize: '1.5rem'
    },
    '&.large': {
      fontSize: '2.25rem'
    },
    '&.xlarge': {
      fontSize: '2.5rem'
    },
    '&.xxlarge': {
      fontSize: '3rem'
    },
    '&.xxxlarge': {
      fontSize: '4rem'
    }
  }
});
function LmIcon(_ref) {
  var _clsx;

  var content = _ref.content,
      _onClick = _ref.onClick;
  var classes = useStyles$e();
  return React__default.createElement("div", {
    className: clsx(content.class_names && content.class_names.values)
  }, React__default.createElement(IconCore, {
    onClick: function onClick() {
      _onClick && _onClick();
    },
    className: clsx(classes.icon, (_clsx = {}, _clsx[content.size] = !!content.size, _clsx)),
    iconUrl: content.icon_url,
    style: {
      color: content.color && content.color.rgba ? content.color.rgba : undefined
    },
    iconName: content.name && content.name.name
  }));
}

function LmIframe(_ref) {
  var _clsx;

  var content = _ref.content;

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var _useState = React.useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1];

  var urlSrc = React.useMemo(function () {
    if (inView) {
      return content.url;
    }

    return '';
  }, [content.url, inView]);
  var properties = content.property || [];
  var allowed = content.allow || [];
  return React__default.createElement("div", {
    ref: refIntersectionObserver,
    className: clsx((_clsx = {
      'embed-responsive': !!content.responsive_ratio
    }, _clsx["embed-responsive-" + content.responsive_ratio] = !!content.responsive_ratio, _clsx)),
    style: {
      height: content.full_height ? '100%' : undefined
    }
  }, !loaded && React__default.createElement(Skeleton, {
    style: {
      position: 'absolute'
    },
    width: "100%",
    height: "100%",
    variant: "rect"
  }), React__default.createElement("iframe", {
    title: "iframe_" + content.url,
    allow: allowed.join(' '),
    src: urlSrc,
    "aria-hidden": true,
    frameBorder: 0,
    onLoad: function onLoad() {
      return setLoaded(true);
    },
    className: clsx({
      'embed-responsive-item': !!content.responsive_ratio
    }),
    allowFullScreen: properties.includes('allow_fullscreen') || false,
    height: content.height || '100%',
    name: content.name || '',
    width: content.width || '100%',
    style: {
      position: content.position,
      display: content.display,
      height: content.height || '100%',
      width: content.width || '100%'
    }
  }));
}

function LmSliderChild(_ref) {
  var body = _ref.body,
      sectionVariant = _ref.sectionVariant;
  return React__default.createElement("div", {
    className: "d-flex h-100 lm-slider__container flex-row justify-content-center"
  }, body.map(function (item) {
    if (item.component === 'section') {
      var newOpts = _extends({}, item, {
        presetVariant: sectionVariant || 'transparent'
      });

      return React__default.createElement(LmComponentRender, {
        content: newOpts,
        key: newOpts._uid
      });
    }

    return React__default.createElement("div", {
      key: "child_" + item._uid,
      className: "flex-grow-1"
    }, React__default.createElement(LmComponentRender, {
      content: item,
      key: item._uid
    }));
  }));
}

var chunkArray = function chunkArray(myArray, chunkSize) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize));
  }

  return results;
};

var useStyles$f = /*#__PURE__*/styles.makeStyles({
  carousel: {
    position: 'relative',
    '& [data-swipeable="true"]': {
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      '& > div': {
        overflow: 'hidden',
        height: '100%',
        width: '100%'
      }
    },
    '& .react-swipeable-view-container .MuiContainer-root': {
      padding: '0px !important',
      margin: '0px !important',
      maxWidth: 'inherit !important'
    },
    '&.carousel__arrows_dark': {
      '& .MuiSvgIcon-root': {
        color: 'rgba(0,0,0,0.8)'
      }
    },
    '& .carousel-indicators': {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      textAlign: 'center'
    },
    '& .carousel-control-next, & .carousel-control-prev': {
      position: 'absolute',
      height: '100%',
      top: 0,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: '4rem',
        color: 'rgba(255,255,255,0.8)'
      }
    },
    '& .carousel-control-next': {
      right: 0
    }
  }
});
function LmSlider(_ref) {
  var content = _ref.content;

  var _useState = React.useState(0),
      slide = _useState[0],
      setSlide = _useState[1];

  var _useDeviceDimensions = useDeviceDimensions(),
      isMobile = _useDeviceDimensions.isMobile;

  var classes = useStyles$f();
  var wrapInColumns = content.slides_per_view && !isMobile;
  var contentBody = content.body || [];
  var body = wrapInColumns ? chunkArray(contentBody.slice(0), content.slides_per_view) : contentBody;
  var properties = content.property || [];
  var styles = {};
  var paginationClasses = clsx('carousel-indicators', {
    'd-none': properties.includes('hide_pagination')
  });
  var carouselPrevClasses = clsx('carousel-control-prev', {
    'd-none': properties.includes('hide_arrows')
  });
  var carouselNextClasses = clsx('carousel-control-next', {
    'd-none': properties.includes('hide_arrows')
  });
  var carouselClasses = clsx(classes.carousel, 'carousel slide', properties.map(function (i) {
    return "carousel__" + i;
  }));

  function handleChangeIndex(item) {
    setSlide(body.findIndex(function (i) {
      return i._uid === item._uid;
    }));
  }

  if (content.background_color) {
    styles.backgroundColor = content.background_color && content.background_color.rgba;
  }

  return React__default.createElement("div", {
    className: carouselClasses,
    style: styles
  }, React__default.createElement(SwipeableViews, {
    index: slide,
    animateTransitions: !content.disable_transition,
    onChangeIndex: function onChangeIndex(i) {
      return setSlide(i);
    }
  }, wrapInColumns ? body.map(function (child, index) {
    return React__default.createElement(LmSliderChild, {
      key: "swipeable_" + index,
      body: child,
      sectionVariant: content.section_variant
    });
  }) : body.map(function (item) {
    if (item.component === 'section') {
      var newOpts = _extends({}, item, {
        presetVariant: content.section_variant || 'transparent'
      });

      return React__default.createElement(LmComponentRender, {
        content: newOpts,
        key: newOpts._uid
      });
    }

    return React__default.createElement(LmComponentRender, {
      content: item,
      key: item._uid
    });
  })), React__default.createElement("a", {
    className: carouselPrevClasses,
    role: "button",
    onClick: function onClick() {
      return setSlide(slide === 0 ? body.length - 1 : slide - 1);
    }
  }, React__default.createElement(ChevronLeft, null), React__default.createElement(Typography, {
    variant: "srOnly"
  }, "Previous")), React__default.createElement("a", {
    className: carouselNextClasses,
    role: "button",
    onClick: function onClick() {
      return setSlide(slide === body.length - 1 ? 0 : slide + 1);
    }
  }, React__default.createElement(ChevronRight, null), React__default.createElement(Typography, {
    variant: "srOnly"
  }, "Next")), React__default.createElement("div", {
    className: paginationClasses
  }, body.map(function (item, i) {
    return React__default.createElement(InvertedIndicator, {
      key: item._uid || "pagination_" + i,
      active: slide === i,
      color: properties.includes('pagination_dark') ? 'dark' : 'light',
      onClick: function onClick() {
        return handleChangeIndex(item);
      }
    });
  })));
}

function FullscreenVideoBg(content) {
  var _content$url_internal;

  var properties = content.property || [];
  var videoAspect = content.ratioHeight / content.ratioWidth; // let fixedToRatio = content.fixedToRatio

  var _useState = React.useState(false),
      error = _useState[0],
      setError = _useState[1];

  var className = clsx('react-player');
  var videoUrl = ((_content$url_internal = content.url_internal) === null || _content$url_internal === void 0 ? void 0 : _content$url_internal.filename) || content.url;

  if (!videoUrl) {
    return React__default.createElement("div", null, "please insert a video URL");
  }

  var muted = properties.includes('muted');
  var playerProps = {
    loop: properties.includes('loop'),
    playing: properties.includes('autoplay'),
    muted: muted,
    controls: properties.includes('controls'),
    playsinline: properties.includes('playsinline'),
    light: content.fallback_image || properties.includes('light'),
    onError: function onError() {
      return setError(true);
    },
    volume: muted ? 0 : undefined
  }; // calculate video container to fit into available space

  var windowWidth = content.containerDimensions.width;
  var windowHeight = content.containerDimensions.height;
  var windowAspect = windowHeight / windowWidth;
  var vidBgWidth = '100%';

  if (windowAspect > videoAspect) {
    vidBgWidth = (windowAspect / videoAspect * 100).toFixed(2) + "%";
  } // cover the available space


  var url = videoUrl && videoUrl.indexOf(',') !== -1 ? videoUrl.split(',').map(function (i) {
    return i.trim();
  }) : videoUrl;
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
    className: "videobg-width" + (properties.includes('suppress_mouse_events') ? ' video-no-mouse' : ''),
    style: {
      width: vidBgWidth
    }
  }, React__default.createElement("div", {
    className: "videobg-aspect",
    style: {
      paddingBottom: (videoAspect * 100).toFixed(2) + "%"
    }
  }, React__default.createElement("div", {
    className: "videobg-make-height"
  }, React__default.createElement(ReactPlayer, Object.assign({
    url: url,
    className: className,
    width: "100%",
    height: "100%"
  }, playerProps))))), error && content.fallback_image && React__default.createElement(BackgroundImage, {
    content: {
      image: content.fallback_image,
      _uid: "bg_fallback_" + content._uid,
      component: 'background'
    }
  }));
}

var useStyles$g = /*#__PURE__*/styles.makeStyles({
  videoSection: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    height: '100%',
    alignItems: 'end',
    justifyItems: 'center',
    '& > div:last-of-type': {
      zIndex: 0,
      height: '100%',
      width: '100%',
      position: 'absolute'
    },
    '& .videobg': {
      position: 'relative',
      width: '100%'
      /* Set video container element width here */
      ,
      height: '100%'
      /* Set video container element height here */
      ,
      overflow: 'hidden',
      background: '#111'
      /* bg color, if video is not high enough */

    },

    /* horizontally center the video */
    '& .videobg-width': {
      position: 'absolute',
      width: '100%'
      /* Change width value to cover more area */
      ,
      height: '100%',
      left: '-9999px',
      right: '-9999px',
      margin: 'auto'
    },

    /* set video aspect ratio and vertically center */
    '& .videobg-aspect': {
      position: 'absolute',
      width: '100%',
      height: 0,
      top: '-9999px',
      bottom: '-9999px',
      margin: 'auto',
      // padding-bottom: 56.25%; /* 16:9 ratio this is calculated inside the component */
      overflow: 'hidden'
    },
    '& .videobg-make-height': {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  } // > .mdc-layout-grid {
  //     position: relative;
  //     z-index: 0;
  //   }
  // }

});
function LmSectionVideo(_ref) {
  var _content$url_internal;

  var content = _ref.content;
  var classes = useStyles$g();
  var theme = styles.useTheme();

  var _useWindowSize = windowSize.useWindowSize(),
      width = _useWindowSize[0],
      height = _useWindowSize[1];

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      intersectionRef = _useInView[0],
      inView = _useInView[1],
      intersectionElement = _useInView[2];

  var _useState = React.useState({
    width: 0,
    height: 0
  }),
      containerDimensions = _useState[0],
      setContainerDimensions = _useState[1];

  var videoUrl = ((_content$url_internal = content.url_internal) === null || _content$url_internal === void 0 ? void 0 : _content$url_internal.filename) || content.url;
  var hasSrc = !!videoUrl;
  var body = content.body || [];
  var hasBody = !!body.length;
  var fixedToRatio = !content.height; // enable fixed ratio if height is not set (!hasBody)

  var ratioHeight = 9;
  var ratioWidth = 16;

  if (content.video_ratio) {
    var ratio = content.video_ratio.split('x');
    ratioWidth = parseInt(ratio[0]);
    ratioHeight = parseInt(ratio[1]);
  }

  var containerStyle = {};

  if (content.height) {
    containerStyle.height = content.height + "vh"; // has errors.. on small devices
  } else {
    containerStyle.paddingBottom = (ratioHeight / ratioWidth * 100).toFixed(2) + "%";
  }

  React.useEffect(function () {
    if (inView) {
      if (!fixedToRatio && intersectionElement) {
        var current = intersectionElement.target;
        setContainerDimensions({
          width: current.clientWidth,
          height: current.clientHeight
        });
      }
    }
  }, [inView, width, height, videoUrl, fixedToRatio, intersectionElement]);
  var maxWidth = content.max_width ? content.max_width === 'none' ? false : content.max_width : theme.defaultContainerWidth;
  return React__default.createElement("div", {
    className: classes.videoSection,
    style: containerStyle,
    ref: intersectionRef,
    id: content.section_identifier || content._uid
  }, hasSrc && inView && React__default.createElement(FullscreenVideoBg, Object.assign({}, content, {
    containerDimensions: containerDimensions,
    fixedToRatio: fixedToRatio,
    ratioHeight: ratioHeight,
    ratioWidth: ratioWidth
  })), hasBody && React__default.createElement("div", null, React__default.createElement(Container, {
    style: {
      height: '100%'
    },
    maxWidth: maxWidth
  }, body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }))));
}

var useStyles$h = /*#__PURE__*/styles.makeStyles({
  cardBase: {
    overflow: 'visible',
    flexGrow: 1,
    '& .MuiGridListTile-tile': {
      overflow: 'visible'
    },
    '&.card__text_align_center .MuiCardMedia-root .MuiCardContent-root': {
      textAlign: 'center'
    },
    '&.card__text_align_right .MuiCardMedia-root .MuiCardContent-root': {
      textAlign: 'right'
    },
    '&.card__text_center .MuiCardMedia-root .MuiCardContent-root': {
      justifyContent: 'center'
    },
    '&.card__text_top_bottom .MuiCardMedia-root .MuiCardContent-root': {
      justifyContent: 'space-between'
    },
    '&.card__text_bottom .MuiCardMedia-root .MuiCardContent-root': {
      justifyContent: 'flex-end'
    },
    '& .MuiCardMedia-root': {
      paddingBottom: '56.25%' // add ratio variants

    },
    '&.ratio-1x1 .MuiCardMedia-root': {
      paddingBottom: '100%' // add ratio variants

    },
    '&.ratio-4x3 .MuiCardMedia-root': {
      paddingBottom: '75%' // add ratio variants

    },
    '&.ratio-3x2 .MuiCardMedia-root': {
      paddingBottom: '66.66%' // add ratio variants

    },
    '&.card__over_media .MuiCardMedia-root': {
      position: 'relative',
      '& .MuiCardContent-root': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }
  }
});
var chunkSize = 30;
function LmCardList(_ref) {
  var _clsx;

  var content = _ref.content;

  var _content$body = content.body,
      body = _content$body === void 0 ? [] : _content$body,
      rest = _objectWithoutPropertiesLoose(content, ["body"]);

  var classes = useStyles$h(content);
  var gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet
  });
  var gutterSize = content.column_gap ? Number(content.column_gap) : 24;
  var enableInView = body.length > chunkSize;

  var _useInView = reactIntersectionObserver.useInView(),
      intersectionRef = _useInView[0],
      inView = _useInView[1]; // const [data, setData] = useState<CardListItemStoryblok[]>(
  //   body.slice(0, chunkSize) || []
  // )


  var _useState = React.useState(1),
      page = _useState[0],
      setPage = _useState[1];

  var data = body.slice(0, page * chunkSize) || [];
  React.useEffect(function () {
    if (inView) {
      setPage(function (v) {
        return v + 1;
      });
    }
  }, [inView, setPage]); // useEffect(() => {
  //   if (page > 0) {
  //     setData((v) => [
  //       ...v,
  //       ...body.slice(page * chunkSize, (page + 1) * chunkSize)
  //     ])
  //   }
  // }, [page, setData, body])

  var variant = content.variant || [];
  return React__default.createElement("div", {
    style: {
      padding: gutterSize / 2 + "px"
    },
    className: clsx(classes.cardBase, variant.map(function (i) {
      return "card__" + i;
    }), (_clsx = {}, _clsx["ratio-" + content.image_ratio] = content.image_ratio, _clsx))
  }, React__default.createElement(GridList, {
    spacing: gutterSize,
    cellHeight: "auto",
    style: {
      overflow: 'visible'
    },
    className: gridClasses.gridList
  }, data.map(function (item) {
    return React__default.createElement(GridListTile, {
      key: item.component + "_" + item._uid
    }, React__default.createElement(LmComponentRender, {
      content: item,
      options: rest
    }));
  })), React__default.createElement("div", {
    ref: enableInView && data.length < body.length ? intersectionRef : undefined
  }));
}

var CardMediaElement = function CardMediaElement(_ref) {
  var children = _ref.children,
      content = _ref.content,
      options = _ref.options;

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      reference = _useInView[0],
      inView = _useInView[1],
      intersecRef = _useInView[2];

  var _useState = React.useState(''),
      imgSource = _useState[0],
      setImgSource = _useState[1];

  var contentImage = content.image;
  var img = {
    src: '',
    srcSet: ''
  };
  var imageSize = options.image_size;

  if (inView && contentImage && intersecRef && intersecRef.target) {
    var mediaEl = intersecRef === null || intersecRef === void 0 ? void 0 : intersecRef.target;
    var currentWidth = (mediaEl === null || mediaEl === void 0 ? void 0 : mediaEl.clientWidth) || 0;
    var currentHeight = mediaEl === null || mediaEl === void 0 ? void 0 : mediaEl.clientHeight;
    img = getImageAttrs({
      originalSource: contentImage,
      width: currentWidth,
      height: ['contain', 'initial', 'auto'].includes(imageSize) ? 0 : currentHeight,
      smart: true
    });
  }

  return React__default.createElement(React__default.Fragment, null, !imgSource && React__default.createElement(React__default.Fragment, null, React__default.createElement(Skeleton, {
    style: {
      position: 'absolute'
    },
    width: "100%",
    height: "100%",
    variant: "rect"
  }), React__default.createElement(ImageShadow, {
    src: img.src,
    srcSet: img.srcSet,
    afterLoad: setImgSource
  })), React__default.createElement(Fade, {
    "in": !!imgSource
  }, React__default.createElement(CardMedia, {
    style: {
      color: options.variant && options.variant.includes('font_white') ? 'white' : 'inherit',
      backgroundSize: imageSize || 'cover'
    },
    image: imgSource,
    ref: reference
  }, !imgSource && React__default.createElement("div", null), children)));
};

CardMediaElement.displayName = 'CardMediaElement';

var useStyles$i = /*#__PURE__*/styles.makeStyles(function (theme) {
  return {
    drawerContent: {
      padding: theme.spacing(3),
      minWidth: '30%'
    }
  };
});

var CardWrapWithAction = function CardWrapWithAction(_ref) {
  var content = _ref.content,
      className = _ref.className,
      style = _ref.style,
      children = _ref.children,
      options = _ref.options;
  var classes = useStyles$i();

  var _React$useState = React__default.useState(false),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  var body = content.body || [];
  var variants = options.variant || [];
  return React__default.createElement(React__default.Fragment, null, React__default.createElement(Card, {
    className: className,
    raised: variants.includes('raised'),
    elevation: options.elevation ? Number(options.elevation) : undefined,
    style: style
  }, React__default.createElement("a", {
    onClick: function onClick() {
      return setOpen(!open);
    }
  }, children)), React__default.createElement(Drawer, {
    open: open,
    anchor: "right",
    onClose: function onClose() {
      return setOpen(false);
    }
  }, React__default.createElement("div", {
    className: classes.drawerContent
  }, body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }))));
};

CardWrapWithAction.displayName = 'CardWrapWithAction';

var CardWrap = function CardWrap(_ref) {
  var _clsx;

  var children = _ref.children,
      content = _ref.content,
      options = _ref.options;
  var className = 'lm-card';
  var styles = useShadowStyles();
  var variants = options.variant || [];
  var style = {
    borderRadius: options.border_radius ? options.border_radius : undefined
  };

  if (content.body && content.body.length) {
    return React__default.createElement(CardWrapWithAction, {
      className: className,
      content: content,
      style: style,
      options: options
    }, children);
  }

  return React__default.createElement(Card, {
    className: clsx(className, (_clsx = {}, _clsx[styles[options.shadow_effect]] = !!options.shadow_effect, _clsx)),
    raised: variants.includes('raised'),
    elevation: options.elevation ? Number(options.elevation) : undefined,
    style: style
  }, children);
};

CardWrap.displayName = 'CardWrap';

function CardListActionTitles(_ref) {
  var content = _ref.content,
      options = _ref.options;
  return React__default.createElement(React__default.Fragment, null, content.title && React__default.createElement(Typography, {
    component: options.title_tag || 'h3',
    className: clsx(options.title_class_name && options.title_class_name.values),
    variant: mapTypographyVariant[options.title_typography ? options.title_typography : 'headline6']
  }, content.title), content.subtitle && React__default.createElement(Typography, {
    component: options.subtitle_tag || 'h4',
    className: clsx(options.subtitle_class_name && options.subtitle_class_name.values),
    variant: mapTypographyVariant[options.subtitle_typography ? options.subtitle_typography : 'subtitle2']
  }, content.subtitle));
}

function CardDescriptionText(_ref) {
  var content = _ref.content,
      options = _ref.options;
  var description = content.description;
  var descriptionMaxCharacter = options.description_max_character;

  if (!description || descriptionMaxCharacter === 0) {
    return null;
  }

  if (descriptionMaxCharacter && description.length > descriptionMaxCharacter) {
    description = description.substr(0, descriptionMaxCharacter) + "..";
  }

  return React__default.createElement(Typography, {
    component: "p",
    variant: mapTypographyVariant[options.description_typography || 'body1'],
    className: clsx(options.description_class_name && options.description_class_name.values)
  }, description);
}

function CardListItemActions(_ref) {
  var options = _ref.options,
      content = _ref.content;
  var cardActionsBody = content.card_actions_body || [];

  if (!cardActionsBody.length) {
    return null;
  }

  return React__default.createElement(CardActions, {
    disableSpacing: !!options.card_actions_disable_spacing
  }, cardActionsBody.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }));
}

function LmCardListItem(props) {
  var _content$link;

  var content = props.content,
      options = props.options;
  var variants = options.variant || [];
  var btnProps = ((_content$link = content.link) === null || _content$link === void 0 ? void 0 : _content$link.cached_url) ? _extends({}, getLinkAttrs(content.link, {
    openExternal: !!content.open_external
  }), {
    naked: true,
    component: LmCoreComponents.lm_link_render
  }) : {}; // without media / text only

  if (!content.image || options.hide_image) {
    return React__default.createElement(CardWrap, Object.assign({}, props), React__default.createElement(CardActionArea, Object.assign({}, btnProps), React__default.createElement(CardContent, null, React__default.createElement(CardListActionTitles, Object.assign({}, props)), React__default.createElement(CardDescriptionText, Object.assign({}, props)))), React__default.createElement(CardListItemActions, Object.assign({}, props)));
  } // header on top


  if (variants.includes('header_top')) {
    return React__default.createElement(CardWrap, Object.assign({}, props), React__default.createElement(CardContent, null, React__default.createElement(CardListActionTitles, Object.assign({}, props))), React__default.createElement(CardActionArea, Object.assign({}, btnProps), React__default.createElement(CardMediaElement, Object.assign({}, props)), content.description && React__default.createElement(CardContent, null, React__default.createElement(CardDescriptionText, Object.assign({}, props)))), React__default.createElement(CardListItemActions, Object.assign({}, props)));
  } // header over media


  if (variants.includes('over_media')) {
    return React__default.createElement(CardWrap, Object.assign({}, props), React__default.createElement(CardActionArea, Object.assign({}, btnProps), React__default.createElement(CardMediaElement, Object.assign({}, props), React__default.createElement(CardContent, {
      style: {
        padding: variants.includes('overlay_content_no_space') ? 0 : undefined
      }
    }, React__default.createElement(CardListActionTitles, Object.assign({}, props)))), content.description && React__default.createElement(CardContent, null, React__default.createElement(CardDescriptionText, Object.assign({}, props)))), React__default.createElement(CardListItemActions, Object.assign({}, props)));
  } // content title and description bottom


  return React__default.createElement(CardWrap, Object.assign({}, props), React__default.createElement(CardActionArea, Object.assign({}, btnProps), React__default.createElement(CardMediaElement, Object.assign({}, props)), (content.description || content.title || content.subtitle) && React__default.createElement(CardContent, null, React__default.createElement(CardListActionTitles, Object.assign({}, props)), React__default.createElement(CardDescriptionText, Object.assign({}, props)))), React__default.createElement(CardListItemActions, Object.assign({}, props)));
}

function getImage(_ref) {
  var _ref$src = _ref.src,
      src = _ref$src === void 0 ? '' : _ref$src,
      _ref$srcSet = _ref.srcSet,
      srcSet = _ref$srcSet === void 0 ? '' : _ref$srcSet,
      onReady = _ref.onReady,
      onError = _ref.onError;
  var img = new Image();
  img.src = src;
  img.srcset = srcSet || src; // img.crossOrigin = 'anonymous'

  img.onload = function () {
    var _img, _img2;

    onReady && onReady(((_img = img) === null || _img === void 0 ? void 0 : _img.currentSrc) || ((_img2 = img) === null || _img2 === void 0 ? void 0 : _img2.src)); // return current selected source

    img = null; // dispose image element
  };

  img.onerror = function (e) {
    onError && onError(e);
    img = null;
  };
}

function getImagePromise(_ref2) {
  var src = _ref2.src,
      srcSet = _ref2.srcSet;
  return new Promise(function (resolve, reject) {
    getImage({
      src: src,
      srcSet: srcSet,
      onReady: function onReady(s) {
        resolve(s);
      },
      onError: function onError(e) {
        reject(e);
      }
    });
  });
}

var useStyles$j = /*#__PURE__*/styles.makeStyles({
  parallax: {
    '& .parallax-inner': {
      zIndex: 0
    },
    '& .parallax__content': {
      zIndex: 1,
      position: 'relative',
      height: '100%'
    }
  }
});
function LmSectionParallax(_ref) {
  var content = _ref.content;
  var classes = useStyles$j();

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1],
      refElement = _useInView[2];

  var _useWindowSize = windowSize.useWindowSize(),
      width = _useWindowSize[0],
      height = _useWindowSize[1];

  var elements = content.elements || [];
  var contentHeight = content.height;

  var _useState = React.useState(),
      layers = _useState[0],
      setLayers = _useState[1];

  var disableLazyLoad = content.disable_lazy_load;
  var styles = {
    height: contentHeight ? contentHeight + "vh" : '50vh'
  }; // let [styles, setStyles] = useState(styles)

  React.useEffect(function () {
    var processLayers = function processLayers() {
      var items = elements.map(function (item) {
        try {
          var containerHeight = height * Number(contentHeight / 100);
          var offset = containerHeight * item.amount * 2;
          var imgHeight = containerHeight + offset;
          var img = getImageAttrs({
            originalSource: item.image,
            width: width,
            // eslint-disable-next-line no-bitwise
            height: ~~imgHeight,
            smart: true,
            focalPoint: item.image_focal_point
          });
          return Promise.resolve(getImagePromise({
            src: img.src,
            srcSet: img.srcSet
          })).then(function (imgSource) {
            return {
              image: "\"" + imgSource + "\"",
              amount: Number(item.amount),
              children: item.children && item.children.length && React__default.createElement(LmComponentRender, {
                content: item.children[0],
                key: item.children[0]._uid
              })
            };
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      Promise.all(items).then(function (lyrs) {
        setLayers(lyrs);
      });
    };

    if (disableLazyLoad) {
      processLayers();
    } else if (inView) {
      refElement && processLayers();
    }
  }, [inView, width, height, elements, contentHeight, disableLazyLoad, refElement]);
  var body = content.body || [];
  return React__default.createElement("div", {
    className: classes.parallax,
    style: styles,
    ref: refIntersectionObserver
  }, React__default.createElement(reactScrollParallax.ParallaxBanner, {
    disabled: false,
    style: styles,
    layers: layers || []
  }, !layers && React__default.createElement(Skeleton, {
    style: {
      position: 'absolute'
    },
    width: "100%",
    height: "100%",
    variant: "rect"
  }), React__default.createElement("div", {
    className: clsx('parallax__content', content.class_names && content.class_names.values)
  }, body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }))));
}

var useStyles$k = /*#__PURE__*/styles.makeStyles(function (theme) {
  return {
    tabContainer: {
      '& .react-swipeable-view-container > div > div': {
        padding: theme.spacing(3)
      }
    },
    vertical: {
      '& .MuiTabs-flexContainerVertical': {
        borderRight: "1px solid " + theme.palette.divider
      },
      '& .react-swipeable-view-container > div > div': {
        paddingTop: 0,
        paddingBottom: 0
      }
    }
  };
});
var widthMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  "false": false,
  auto: 'auto',
  "true": true
};
function LmTabs(_ref) {
  var _clsx;

  var content = _ref.content;
  var theme = styles.useTheme();
  var isMobile = useMediaQuery(theme.breakpoints.down(content.mobile_breakpoint || 'xs'));
  var classes = useStyles$k();

  var _useState = React.useState(0),
      activeTab = _useState[0],
      setActiveTab = _useState[1];

  var body = content.body || [];
  var orientation = content.vertical_tabs && !isMobile ? 'vertical' : 'horizontal';
  var isVertical = orientation === 'vertical';
  return React__default.createElement(Grid, {
    container: true,
    direction: "row",
    className: clsx(classes.tabContainer, (_clsx = {}, _clsx[classes.vertical] = isVertical, _clsx))
  }, React__default.createElement(Grid, {
    item: true,
    xs: 12,
    sm: isVertical ? content.tabs_width ? widthMap[content.tabs_width] : 'auto' : 12
  }, React__default.createElement("div", null, React__default.createElement(MuiTabs, {
    "aria-label": "tabs",
    indicatorColor: content.indicator_color ? content.indicator_color : undefined,
    textColor: content.text_color ? content.text_color : undefined,
    value: activeTab,
    scrollButtons: "on",
    centered: !!content.centered && !isMobile,
    variant: isMobile ? 'scrollable' : content.variant || 'fullWidth',
    orientation: orientation,
    onChange: function onChange(_, value) {
      setActiveTab(value);
    }
  }, body.map(function (tab, iteration) {
    return React__default.createElement(Tab, {
      label: tab.title,
      wrapped: !!content.wrapped,
      icon: tab.icon && tab.icon.name && React__default.createElement(IconCore, {
        style: {
          fontSize: 24
        },
        className: "MuiIcon-root",
        iconName: tab.icon.name
      }),
      "aria-controls": "tabpanel-" + iteration,
      key: tab._uid
    });
  })))), React__default.createElement(Grid, {
    item: true,
    xs: 12,
    sm: isVertical ? content.content_width ? widthMap[content.content_width] : 'auto' : 12
  }, React__default.createElement("div", null, React__default.createElement(SwipeableViews, {
    index: activeTab,
    onChangeIndex: function onChangeIndex(i) {
      return setActiveTab(i);
    },
    className: "lm-slide-content",
    animateHeight: content.dynamic_height || false,
    axis: "x"
  }, body.map(function (tab) {
    return React__default.createElement("div", {
      key: "content_" + tab._uid
    }, tab.body && tab.body.map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: blok,
        key: blok._uid
      });
    }));
  })))));
}

function useListSearch(items, isEnabled) {
  var router$1 = router.useRouter();

  var _useGlobalState = useGlobalState('searchParams'),
      searchParams = _useGlobalState[0];

  if (!isEnabled) {
    return items;
  }

  var query = router$1 === null || router$1 === void 0 ? void 0 : router$1.query;
  var searchParamsCategories = searchParams.categories || [];

  if (!searchParams.categories && (query === null || query === void 0 ? void 0 : query.search__categories)) {
    searchParamsCategories = Array.isArray(query.search__categories) ? query.search__categories : [query.search__categories];
  }

  var searchText = searchParams.searchText;

  if (!searchParams.searchText && (query === null || query === void 0 ? void 0 : query.search__text)) {
    searchText = query.search__text;
  }

  if (searchParamsCategories.length || searchText) {
    items = items.filter(function (item) {
      var itemCategories = item.tag_list || [];
      var inCategory = searchParamsCategories.length ? searchParamsCategories.some(function (element) {
        return itemCategories.includes(element);
      }) : false;

      if (inCategory) {
        return true;
      }

      var pageContent = item.content;
      var inSearchText = searchText ? [item.full_slug, pageContent.preview_title].some( // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      function (term) {
        return term && term.search(new RegExp(searchText, 'i')) !== -1;
      }) : undefined;

      if (inSearchText === undefined) {
        return false;
      }

      return inSearchText;
    });
  }

  return items;
}

function ListWidgetLists(_ref) {
  var items = _ref.items,
      options = _ref.options;
  var imageSize = options.image_size || 'large';
  var hideImage = options.hide_image;
  return React__default.createElement(List, null, items.map(function (item) {
    return React__default.createElement(Link$1, {
      href: CONFIG.href,
      as: lumenCmsUtils.internalLinkHandler(item.full_slug),
      key: item.uuid,
      passHref: true,
      prefetch: false
    }, React__default.createElement(ListItem, {
      component: "a"
    }, !hideImage && item.content.preview_image && React__default.createElement(ListItemAvatar, null, React__default.createElement(LmMuiAvatar, {
      src: item.content.preview_image,
      size: imageSize
    })), React__default.createElement(ListItemText, {
      primary: item.content.preview_title || item.name,
      secondary: !options.hide_subtitle && item.content.preview_subtitle
    })));
  }));
}

function ListWidgetCards(_ref) {
  var items = _ref.items,
      content = _ref.content,
      options = _ref.options;
  return React__default.createElement(LmComponentRender, {
    content: _extends({}, options, {
      _uid: content._uid,
      component: 'card_list',
      body: items.map(function (item) {
        var itemContent = item.content;

        if (content.sort === 'publish' && !itemContent.preview_publish_date) {
          console.info('missing preview publish date:', item.full_slug);
        }

        return {
          _uid: item.uuid,
          component: 'card_list_item',
          title: itemContent.preview_title || itemContent.meta_title || item.name,
          subtitle: itemContent.preview_subtitle,
          description: itemContent.preview_teaser,
          image: itemContent.preview_image,
          link: {
            cached_url: item.full_slug,
            linktype: 'story'
          }
        };
      })
    })
  });
}

function ListWidgetLinks(_ref) {
  var items = _ref.items,
      options = _ref.options,
      content = _ref.content;

  var listProps = _extends({}, options, {
    _uid: content._uid,
    body: items.map(function (item) {
      var opts = {
        _uid: content._uid + item.uuid,
        component: 'nav_item',
        name: item.content && (item.content.preview_title || item.name) || '',
        link: {
          cached_url: item.full_slug,
          linktype: 'story'
        }
      };
      return opts;
    })
  });

  return React__default.createElement(LmComponentRender, {
    content: listProps
  });
}

function ListWidgetContainer(props) {
  var options = props.options,
      rest = _objectWithoutPropertiesLoose(props, ["options"]);

  if (options.component === 'lists') {
    return React__default.createElement(ListWidgetLists, Object.assign({
      options: options
    }, rest));
  }

  if (options.component === 'nav_list') {
    return React__default.createElement(ListWidgetLinks, Object.assign({
      options: options
    }, rest));
  }

  return React__default.createElement(ListWidgetCards, Object.assign({
    options: options
  }, rest));
}

function LmListWidget(_ref) {
  var content = _ref.content;

  var _useAppContext = useAppContext(),
      listWidgetData = _useAppContext.listWidgetData;

  var items = useListSearch(listWidgetData && listWidgetData[content._uid] || [], !!content.enable_for_search);
  var listOption = content.list_options && content.list_options[0] || {};
  return React__default.createElement(ListWidgetContainer, {
    options: listOption,
    content: content,
    items: items
  });
}

function LmFlexRow(_ref) {
  var content = _ref.content;
  var body = content.body || [];
  return React__default.createElement(Grid, {
    container: true,
    direction: content.column ? 'column' : 'row',
    justify: content.justify ? content.justify : undefined,
    alignItems: content.align_items ? content.align_items : undefined,
    alignContent: content.align_content ? content.align_content : undefined,
    className: clsx(content.class_names && content.class_names.values, {
      'mh-100': content.full_height
    })
  }, body.map(function (item) {
    return React__default.createElement(LmComponentRender, {
      content: item,
      key: item._uid
    });
  }));
}

function LmIframeAdvanced(_ref) {
  var content = _ref.content;

  var _useInView = reactIntersectionObserver.useInView(intersectionIframeOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1],
      containerRef = _useInView[2];

  var iframeRef = React.createRef(); // const [src, setSrc] = useState<string>('')

  var contentId = "iframe_" + content._uid;
  var properties = content.property || [];
  var allowed = content.allow || [];

  var _useState = React.useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1];

  var contentUrl = content.url;
  var src = React.useMemo(function () {
    if (inView) {
      return contentUrl;
    }

    return '';
  }, [inView, contentUrl]);
  React.useEffect(function () {
    var messageFunc = function messageFunc(message) {
      var clientHeight = message && message.data && message.data[content.incoming_message_key || 'stClientHeight'];
      var el = containerRef && containerRef.target && containerRef.target.firstChild;

      if (clientHeight && el) {
        var iframe = el;
        iframe.style.minHeight = clientHeight + "px";
      }
    };

    var clickFunc = function clickFunc() {
      var el = containerRef && containerRef.target && containerRef.target.firstChild;

      if (el) {
        var iframe = el;
        var contentWindow = iframe.contentWindow;
        contentWindow && contentWindow.postMessage(content.post_message_key || '_clickOutside', '*');
      }
    };

    window.addEventListener('message', messageFunc);
    window.addEventListener('click', clickFunc);
    return function () {
      window.removeEventListener('message', messageFunc);
      window.removeEventListener('click', clickFunc);
    };
  }, [containerRef, content.incoming_message_key, content.post_message_key]);
  return React__default.createElement("div", {
    ref: refIntersectionObserver
  }, !loaded && inView && React__default.createElement("div", {
    className: "p-5"
  }, React__default.createElement(CircularProgress, null)), React__default.createElement("iframe", {
    title: "iframe_" + contentUrl,
    ref: iframeRef,
    id: contentId,
    allow: allowed.join(' '),
    frameBorder: 0,
    scrolling: "no",
    onLoad: function onLoad() {
      return setLoaded(true);
    },
    allowFullScreen: properties.includes('allow_fullscreen') || false,
    src: src,
    className: "border-0",
    style: {
      overflowY: 'hidden',
      display: content.display,
      height: '100%',
      minHeight: content.height ? content.height + "px" : undefined,
      width: content.width || '100%'
    }
  }));
}

function LmCategoryBox(_ref) {
  var content = _ref.content;
  var router$1 = router.useRouter();
  var query = router$1 === null || router$1 === void 0 ? void 0 : router$1.query;
  var initialValues = [];

  if (query === null || query === void 0 ? void 0 : query.search__categories) {
    initialValues = Array.isArray(query.search__categories) ? query.search__categories : [query.search__categories];
  }

  var _useState = React.useState(initialValues),
      selected = _useState[0],
      setSelected = _useState[1];

  var _useAppContext = useAppContext(),
      allCategories = _useAppContext.allCategories;

  var categories = allCategories;
  var filterByTags = content.filter_by_tags && content.filter_by_tags.values || [];
  var filterByCategories = content.filter_categories || [];

  if (filterByTags || filterByCategories.length) {
    categories = categories.filter(function (category) {
      var categoryContent = category.content;
      if (!(categoryContent.tag_reference && categoryContent.tag_reference.values)) return false; // remove all categories without tag_reference

      var exists = true;

      if (filterByTags.length) {
        var tagList = category.tag_list || [];
        exists = tagList.length && content.match_all_tags ? filterByTags.every(function (element) {
          return tagList.includes(element);
        }) : filterByTags.some(function (element) {
          return tagList.includes(element);
        });
        if (exists) return true;
      }

      if (filterByCategories.length) {
        return filterByCategories.includes(category.uuid);
      }

      return exists;
    });
  }

  function onChange(event) {
    var isChecked = event.currentTarget.checked;
    var value = event.currentTarget.value;

    if (isChecked) {
      var currentCategories = [].concat(selected, [value]);
      setSelected(currentCategories);
      setSearchCategory(currentCategories);
    } else {
      var _currentCategories = selected.filter(function (i) {
        return i !== value;
      });

      setSelected(_currentCategories);
      setSearchCategory(_currentCategories);
    }
  }

  var style = {}; // const style = { maxHeight: '500px', overflowY: 'auto' }

  return React__default.createElement("div", {
    style: style,
    className: clsx(content.class_names && content.class_names.values)
  }, categories.map(function (category) {
    var value = category.content && category.content.tag_reference && category.content.tag_reference.values;
    return React__default.createElement("div", {
      key: category.uuid
    }, React__default.createElement(FormControlLabel, {
      control: React__default.createElement(Checkbox, {
        id: category.uuid,
        name: category.uuid,
        checked: selected.includes(value),
        value: value,
        onChange: onChange
      }),
      label: category.content && category.content.name
    }));
  }));
}

function LmListSearchField(_ref) {
  var content = _ref.content;
  var router$1 = router.useRouter();
  var query = router$1 === null || router$1 === void 0 ? void 0 : router$1.query;

  var _useState = React.useState(query.search__text || ''),
      searchText = _useState[0],
      setSearchText = _useState[1];

  var _useDebouncedCallback = useDebounce.useDebouncedCallback( // function
  function (value) {
    onSearchTextChange(value);
  }, // delay in ms
  300),
      debouncedCallback = _useDebouncedCallback[0];

  function onSearchChange(ev) {
    var value = ev.currentTarget.value;
    setSearchText(value);
    debouncedCallback(value);
  }

  return React__default.createElement("div", {
    className: clsx(content.class_names && content.class_names.values)
  }, React__default.createElement(TextField, {
    InputProps: {
      startAdornment: React__default.createElement(Magnify, null)
    },
    id: content._uid,
    value: searchText,
    label: content.label,
    type: "search",
    placeholder: content.placeholder,
    variant: "outlined",
    onChange: onSearchChange
  }));
}

function LmLink(_ref) {
  var _content$link, _content$class_names2;

  var content = _ref.content;

  if (!((_content$link = content.link) === null || _content$link === void 0 ? void 0 : _content$link.cached_url)) {
    var _content$class_names;

    return React__default.createElement("span", {
      className: clsx((_content$class_names = content.class_names) === null || _content$class_names === void 0 ? void 0 : _content$class_names.values)
    }, (content.body || []).map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: blok,
        key: blok._uid
      });
    }));
  }

  var btnProps = _extends({}, getLinkAttrs(content.link, {
    openExternal: !!content.open_external
  }), {
    naked: true,
    component: LmCoreComponents.lm_link_render
  });

  return React__default.createElement(MuiLink, Object.assign({}, btnProps, {
    className: clsx('lm-link__container', (_content$class_names2 = content.class_names) === null || _content$class_names2 === void 0 ? void 0 : _content$class_names2.values)
  }), (content.body || []).map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }));
}

var NextComposed = /*#__PURE__*/React__default.forwardRef(function (_ref, ref) {
  var as = _ref.as,
      href = _ref.href,
      replace = _ref.replace,
      scroll = _ref.scroll,
      passHref = _ref.passHref,
      shallow = _ref.shallow,
      prefetch = _ref.prefetch,
      other = _objectWithoutPropertiesLoose(_ref, ["as", "href", "replace", "scroll", "passHref", "shallow", "prefetch"]);

  if (other.external) {
    delete other.nextHref;
    delete other.external; // eslint-disable-next-line jsx-a11y/anchor-has-content

    return React__default.createElement("a", Object.assign({
      ref: ref
    }, other, {
      href: href
    }));
  }

  if (!as && href) {
    as = href;
    href = other.nextHref || CONFIG.href;
    delete other.nextHref;
    delete other.external;
  }

  return React__default.createElement(Link$1, {
    href: href,
    prefetch: prefetch,
    as: as,
    replace: replace,
    scroll: scroll,
    shallow: shallow,
    passHref: passHref
  }, React__default.createElement("a", Object.assign({
    ref: ref
  }, other)));
});
NextComposed.displayName = 'NextComposedLink'; // A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link

function Link(props) {
  var _clsx;

  var href = props.href,
      _props$activeClassNam = props.activeClassName,
      activeClassName = _props$activeClassNam === void 0 ? 'active' : _props$activeClassNam,
      classNameProps = props.className,
      innerRef = props.innerRef,
      naked = props.naked,
      other = _objectWithoutPropertiesLoose(props, ["href", "activeClassName", "className", "innerRef", "naked"]);

  var router$1 = router.useRouter();
  var className = clsx(classNameProps, (_clsx = {}, _clsx[activeClassName] = (router$1 === null || router$1 === void 0 ? void 0 : router$1.pathname) === href && activeClassName, _clsx));

  if (!href) {
    // console.log(props)
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return React__default.createElement("a", Object.assign({}, other, {
      className: className
    }));
  }

  if (naked) {
    return React__default.createElement(NextComposed, Object.assign({
      className: className,
      ref: innerRef,
      href: href
    }, other));
  }

  return React__default.createElement(MuiLink, Object.assign({
    component: NextComposed,
    className: className,
    ref: innerRef,
    href: href
  }, other));
}

var MuiNextLink = /*#__PURE__*/React__default.forwardRef(function (props, ref) {
  return React__default.createElement(Link, Object.assign({}, props, {
    innerRef: ref
  }));
});
MuiNextLink.displayName = 'MuiNextLink';

var useStyles$l = /*#__PURE__*/styles.makeStyles(function (theme) {
  var _MuiAutocompleteIn;

  return styles.createStyles({
    root: {
      display: 'inline-flex',
      verticalAlign: 'middle',
      '& .MuiInputLabel-root.Mui-focused': {
        color: 'inherit'
      }
    },
    mobile: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      zIndex: 1,
      height: '100%',
      verticalAlign: 'middle',
      backgroundColor: 'inherit',
      '& .MuiFormControl-root': {
        alignSelf: 'center'
      }
    },
    inputRoot: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: styles.fade('rgba(0,0,0,.05)', 0.15),
      color: 'inherit',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.divider
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.action.focus
      },
      '&:hover': {
        backgroundColor: styles.fade('rgba(0,0,0,.05)', 0.25),
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.action.focus
        }
      }
    },
    borderSquare: {
      borderRadius: 0,
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: 0
      }
    },
    borderRounded: {
      borderRadius: '25px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '25px'
      }
    },
    inputDefaultWidth: {
      color: 'inherit',
      transition: theme.transitions.create('width')
    },
    variableWidth: {
      '&.MuiAutocomplete-input': (_MuiAutocompleteIn = {}, _MuiAutocompleteIn[theme.breakpoints.up('sm')] = {
        width: 120,
        '&:focus,&:active': {
          width: 200
        }
      }, _MuiAutocompleteIn)
    },
    listbox: {
      '& .MuiLink-root': {
        display: 'block',
        width: '100%',
        color: 'inherit',
        '&:hover': {
          textDecoration: 'none'
        }
      }
    }
  });
});

var ListSearchAutocompleteContainer = function ListSearchAutocompleteContainer(_ref) {
  var content = _ref.content,
      children = _ref.children,
      popperActive = _ref.popperActive,
      inputRef = _ref.inputRef,
      isMobileAction = _ref.isMobileAction;

  var _useState = React.useState(false),
      visible = _useState[0],
      setVisible = _useState[1];

  var classes = useStyles$l();

  var _useState2 = React.useState(),
      bgColor = _useState2[0],
      setBgColor = _useState2[1];

  React.useEffect(function () {
    if (isMobileAction) {
      var _inputRef$current;

      var toolbar = (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.closest('.MuiAppBar-root');
      var bg = toolbar && window.getComputedStyle(toolbar, null).backgroundColor;
      setBgColor(bg || undefined);
    }
  }, [isMobileAction, inputRef]);
  React.useEffect(function () {
    var _inputRef$current2;

    if (!isMobileAction) {
      return;
    }

    (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 ? void 0 : _inputRef$current2.focus();
  }, [visible, inputRef, isMobileAction]);
  React.useEffect(function () {
    if (!isMobileAction) {
      return;
    }

    if (!popperActive) {
      setVisible(false);
    }
  }, [popperActive, isMobileAction]);

  var onOpen = function onOpen() {
    setVisible(true);
  };

  if (isMobileAction) {
    var _content$icon;

    return React__default.createElement(React__default.Fragment, null, !visible && React__default.createElement(IconButton, {
      onClick: onOpen
    }, ((_content$icon = content.icon) === null || _content$icon === void 0 ? void 0 : _content$icon.name) ? React__default.createElement(IconCore, {
      iconName: content.icon.name
    }) : React__default.createElement(Magnify, null)), React__default.createElement("div", {
      style: {
        display: !visible ? 'none' : 'inline-flex',
        backgroundColor: bgColor
      },
      className: classes.mobile
    }, children));
  }

  return React__default.createElement(React__default.Fragment, null, children);
};

ListSearchAutocompleteContainer.displayName = 'ListSearchAutocompleteContainer';
function LmListSearchAutocomplete(_ref2) {
  var _clsx, _clsx2;

  var content = _ref2.content;

  // const { allStories } = useAppContext()
  var _useState3 = React.useState([]),
      allStories = _useState3[0],
      setAllStories = _useState3[1];

  var classes = useStyles$l();
  var inputRef = React.createRef();

  var _useState4 = React.useState(),
      open = _useState4[0],
      setOpen = _useState4[1];

  var theme = styles.useTheme();
  var matches = useMediaQuery(theme.breakpoints.down(content.mobile_breakpoint || 'xs'));
  var isMobileAction = content.mobile_breakpoint && matches;

  var _useDebouncedCallback = useDebounce.useDebouncedCallback(function (value) {
    if (value.length < 2) {
      return;
    }

    setOpen(true);
    lumenCmsUtils.LmStoryblokService.getSearch("cdn/stories", {
      per_page: 25,
      sort_by: 'content.preview_title:desc',
      excluding_fields: 'body,right_body,meta_robots,property,seo_body',
      search_term: value,
      filter_query: {
        component: {
          "in": 'page'
        }
      }
    }).then(function (res) {
      setAllStories(res.data.stories);
      setOpen(true); // setSearchText(value)
    });
  }, 400),
      debounceFunc = _useDebouncedCallback[0];

  return React__default.createElement(ListSearchAutocompleteContainer, {
    content: content,
    popperActive: open,
    inputRef: inputRef,
    isMobileAction: !!isMobileAction
  }, React__default.createElement(Autocomplete, {
    onOpen: function onOpen() {
      return setOpen(true);
    },
    onClose: function onClose() {
      return setOpen(false);
    },
    style: {
      width: isMobileAction ? '100%' : undefined
    },
    options: allStories.map(function (option) {
      var _option$content, _option$content2;

      return {
        uuid: option.uuid,
        full_slug: option.full_slug,
        label: ((_option$content = option.content) === null || _option$content === void 0 ? void 0 : _option$content.preview_title) || ((_option$content2 = option.content) === null || _option$content2 === void 0 ? void 0 : _option$content2.meta_title) || option.name || ''
      };
    }).sort(function (a, b) {
      return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
    }),
    freeSolo: true,
    classes: {
      root: classes.root,
      listbox: classes.listbox,
      inputRoot: clsx(classes.inputRoot, (_clsx = {}, _clsx[classes.borderSquare] = content.shape === 'square', _clsx[classes.borderRounded] = content.shape === 'rounded', _clsx)),
      input: clsx(classes.inputDefaultWidth, (_clsx2 = {}, _clsx2[classes.variableWidth] = !isMobileAction, _clsx2))
    },
    renderInput: function renderInput(params) {
      var _content$icon2;

      return React__default.createElement(TextField, Object.assign({}, params, {
        size: "small",
        variant: "outlined",
        label: content.label || undefined,
        placeholder: content.placeholder,
        fullWidth: !!(content.fullwidth || isMobileAction),
        inputRef: inputRef,
        InputProps: _extends({}, params.InputProps, {
          onFocus: function onFocus() {
            setOpen(true);
          },
          onBlur: function onBlur() {
            setOpen(false);
          },
          onChange: function onChange(event) {
            return debounceFunc(event.currentTarget.value);
          },
          autoComplete: 'new-password',
          startAdornment: React__default.createElement(InputAdornment, {
            position: "start"
          }, ' ', ((_content$icon2 = content.icon) === null || _content$icon2 === void 0 ? void 0 : _content$icon2.name) ? React__default.createElement(IconCore, {
            iconName: content.icon.name
          }) : React__default.createElement(Magnify, null))
        })
      }));
    },
    noOptionsText: content.not_found_label,
    getOptionLabel: function getOptionLabel(option) {
      return option.label;
    },
    PaperComponent: function PaperComponent(props) {
      return React__default.createElement(Paper, Object.assign({}, props, {
        square: content.menu_square,
        variant: content.menu_outlined ? 'outlined' : 'elevation',
        elevation: content.menu_elevation ? Number(content.menu_elevation) : 1,
        style: _extends({}, props.style, {
          borderRadius: content.menu_border_radius ? content.menu_border_radius : undefined
        })
      }));
    },
    renderOption: function renderOption(item) {
      var _getLinkAttrs = getLinkAttrs({
        cached_url: item.full_slug,
        linktype: 'story'
      }, {}),
          href = _getLinkAttrs.href;

      return React__default.createElement(MuiNextLink, {
        href: CONFIG.href,
        as: href,
        passHref: true,
        key: item.uuid,
        prefetch: false
      }, item.label);
    }
  }));
}

var InlineClassMapping = {
  bold: 'font-weight-bold',
  strike: 'text-decoration-line-through',
  underline: 'text-decoration-underline',
  strong: 'font-weight-bolder',
  code: 'text-code',
  italic: 'font-italic',
  link: 'text-link',
  styled: ''
};

function RteNodeText(_ref) {
  var content = _ref.content;

  if (content.marks && content.marks.length) {
    var _link$attrs;

    var link = content.marks.find(function (_ref2) {
      var type = _ref2.type;
      return type === 'link';
    });
    var className = clsx(content.marks.map(function (_ref3) {
      var type = _ref3.type,
          attrs = _ref3.attrs;

      if (attrs && attrs["class"]) {
        return attrs["class"];
      }

      return InlineClassMapping[type];
    }));

    if (link === null || link === void 0 ? void 0 : (_link$attrs = link.attrs) === null || _link$attrs === void 0 ? void 0 : _link$attrs.href) {
      var btnProps = _extends({}, getLinkAttrs({
        cached_url: link.attrs.href,
        linktype: link.attrs.linktype
      }, {}), {
        naked: true,
        component: LmCoreComponents.lm_link_render
      });

      return React__default.createElement(MuiLink, Object.assign({}, btnProps), content.text);
    }

    return React__default.createElement("span", {
      className: className
    }, content.text);
  }

  return React__default.createElement(React__default.Fragment, null, content.text);
}

var ElementMap = {
  paragraph: 'p',
  blockquote: 'blockquote',
  bullet_list: 'ul',
  list_item: 'li',
  ordered_list: 'ol',
  horizontal_rule: 'hr',
  hard_break: 'br',
  // 'image': '',
  code_block: 'code'
};

function RteNode(_ref) {
  var content = _ref.content;
  return React__default.createElement(content.type === 'heading' ? "h" + (content.attrs.level || '3') : ElementMap[content.type], {}, content.content && content.content.map(function (blok, i) {
    return (// eslint-disable-next-line @typescript-eslint/no-use-before-define
      LmRteContentRenderer(blok, i)
    );
  }));
}

var RteComponents = {
  heading: RteNode,
  text: RteNodeText,
  paragraph: RteNode,
  blockquote: RteNode,
  bullet_list: RteNode,
  list_item: RteNode,
  ordered_list: RteNode,
  horizontal_rule: function horizontal_rule() {
    return React__default.createElement("hr", null);
  },
  hard_break: RteNode,
  image: RteNode,
  code_block: RteNode
};
function LmRteContentRenderer(blok, i) {
  if (typeof RteComponents[blok.type] !== 'undefined') {
    return React__default.createElement(RteComponents[blok.type], {
      content: blok,
      key: blok.type + "_" + i
    });
  }

  return React__default.createElement(function () {
    return React__default.createElement("div", {
      style: {
        color: 'red'
      }
    }, "The component ", blok.type, " ", i, " has not been created yet.");
  }, {
    key: blok.type + "_" + i
  });
}

var useRichTextStyles = /*#__PURE__*/styles.makeStyles(function (theme) {
  return styles.createStyles({
    richText: {
      '& > p': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        '&:first-child': {
          marginTop: 0
        },
        '&:last-child': {
          marginBottom: 0
        }
      }
    }
  });
});

function LmRichTextParagraph(_ref) {
  var _clsx;

  var content = _ref.content;
  var classes = useRichTextStyles();
  return React__default.createElement(Typography, {
    className: clsx('lm-markup', classes.richText, content.style, content.class_names && content.class_names.values, (_clsx = {}, _clsx["lm-font-" + content.font] = content.font, _clsx)),
    align: content.align ? content.align : undefined,
    color: content.color ? content.color : undefined,
    component: "div",
    style: {
      color: content.custom_color && content.custom_color.rgba ? content.custom_color.rgba : undefined,
      lineHeight: content.line_height ? content.line_height : undefined,
      fontSize: content.font_size ? content.font_size : undefined,
      letterSpacing: content.letter_spacing ? content.letter_spacing : undefined
    },
    variant: mapTypographyVariant[content.typography ? content.typography : 'body1']
  }, content.body && content.body.content.map(function (blok, i) {
    return LmRteContentRenderer(blok, i);
  }));
}

function LmTimeline(_ref) {
  var _content$body;

  var content = _ref.content;

  var _useDeviceDimensions = useDeviceDimensions(),
      isMobile = _useDeviceDimensions.isMobile;

  return React__default.createElement(Timeline, {
    align: isMobile ? 'left' : content.align || 'alternate'
  }, (_content$body = content.body) === null || _content$body === void 0 ? void 0 : _content$body.map(function (blok, i) {
    var _content$body2;

    return React__default.createElement(LmComponentRender, {
      content: blok,
      options: content,
      key: blok._uid,
      isLast: i + 1 === ((_content$body2 = content.body) === null || _content$body2 === void 0 ? void 0 : _content$body2.length),
      isMobile: isMobile
    });
  }));
}

var sizeMap = {
  dense: {
    container: 30,
    icon: 18
  },
  large: {
    container: 50,
    icon: 25
  },
  xlarge: {
    container: 64,
    icon: 32
  }
};
function LmAvatar(_ref) {
  var content = _ref.content;

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var iconName = content.icon && content.icon.name;
  var imageSrc = content.image;
  var customSize = content.custom_size && Number(content.custom_size);

  var _useState = React.useState({}),
      imageAttrs = _useState[0],
      setImageSrc = _useState[1];

  var style = {
    color: content.color && content.color.rgba,
    backgroundColor: content.background_color && content.background_color.rgba
  };

  if (content.size) {
    var individualSize = sizeMap[content.size];

    if (individualSize) {
      style.width = individualSize.container;
      style.height = individualSize.container;
      style.fontSize = individualSize.icon;
    } else {
      console.error("Size of avatar is not defined inside of LmAvatar: " + content.size);
    }
  }

  if (customSize) {
    style.width = customSize;
    style.height = customSize;
    style.fontSize = customSize / 2;
  }

  React.useEffect(function () {
    if (inView && imageSrc) {
      var imgAttrs = getImageAttrs({
        originalSource: imageSrc,
        width: customSize && customSize > 128 ? customSize : 128,
        height: customSize && customSize > 128 ? customSize : 128,
        smart: true
      });
      setImageSrc(imgAttrs);
    }
  }, [inView, imageSrc, customSize]);
  return React__default.createElement(Avatar, Object.assign({
    ref: refIntersectionObserver,
    variant: content.variant || 'circle',
    style: style,
    className: clsx(content.class_names && content.class_names.values)
  }, imageAttrs), content.letter, iconName && React__default.createElement(IconCore, {
    iconName: iconName
  }));
}

function LmDateHeadline(_ref) {
  var _content$text, _content$text_xs;

  var content = _ref.content;

  var modifContent = _extends({}, content, {
    text: (_content$text = content.text) === null || _content$text === void 0 ? void 0 : _content$text.replace('{date}', "" + new Date().getFullYear()),
    text_xs: (_content$text_xs = content.text_xs) === null || _content$text_xs === void 0 ? void 0 : _content$text_xs.replace('{date}', "" + new Date().getFullYear())
  });

  return React__default.createElement(LmHeadline, {
    content: modifContent
  });
}

function LmMotion(_ref) {
  var content = _ref.content;
  var type = content.type || 'fade';
  var options = {
    triggerOnce: true
  };

  if (content.threshold) {
    options.threshold = Number((Number(content.threshold) / 100).toFixed(2));
  }

  var _useInView = reactIntersectionObserver.useInView(options),
      viewRef = _useInView[0],
      inView = _useInView[1];

  var transitionProps = {};

  if (content.duration) {
    transitionProps.timeout = Number(content.duration);
  }

  return React__default.createElement("div", {
    ref: viewRef,
    style: {
      overflow: content.enable_overflow ? undefined : 'hidden'
    }
  }, {
    slide: React__default.createElement(Slide, Object.assign({
      "in": inView
    }, transitionProps, {
      direction: content.slide_direction || 'down'
    }), React__default.createElement("div", null, (content.body || []).map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: blok,
        key: blok._uid
      });
    }))),
    fade: React__default.createElement(Fade, Object.assign({
      "in": inView
    }, transitionProps), React__default.createElement("div", null, (content.body || []).map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: blok,
        key: blok._uid
      });
    }))),
    grow: React__default.createElement(Grow, Object.assign({
      "in": inView
    }, transitionProps), React__default.createElement("div", null, (content.body || []).map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: blok,
        key: blok._uid
      });
    }))),
    zoom: React__default.createElement(Zoom, Object.assign({
      "in": inView
    }, transitionProps), React__default.createElement("div", null, (content.body || []).map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: blok,
        key: blok._uid
      });
    }))),
    collapse: React__default.createElement(Collapse, Object.assign({
      "in": inView
    }, transitionProps), React__default.createElement("div", null, (content.body || []).map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: blok,
        key: blok._uid
      });
    })))
  }[type]);
}

function LmToolbarLogo(_ref) {
  var settings = _ref.settings;
  var websiteTitle = settings.website_title;
  var websiteLogo = settings.website_logo;
  var websiteLogoInvert = settings.website_logo_invert;
  var height = settings.toolbar_main_height ? settings.toolbar_main_height * 2 : 48 * 2;

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var _useDeviceDimensions = useDeviceDimensions(),
      isMobile = _useDeviceDimensions.isMobile;

  var getImageSrc = function getImageSrc(image) {
    return imageService(image, "0x" + height);
  };

  return React__default.createElement("div", {
    className: "h-100 d-inline-block",
    ref: refIntersectionObserver
  }, websiteLogo && settings.seo_website_url && React__default.createElement(nextSeo.LogoJsonLd, {
    logo: imageService(websiteLogo),
    url: settings.seo_website_url
  }), React__default.createElement(Link$1, {
    as: homepageLinkHandler(),
    href: CONFIG.href,
    passHref: true
  }, React__default.createElement(MuiLink, {
    className: clsx('lm-logo-header', {
      'lm-logo-text': !websiteLogo
    })
  }, React__default.createElement(React__default.Fragment, null, !websiteLogo && React__default.createElement(Typography, null, websiteTitle), websiteLogo && inView && React__default.createElement("img", {
    src: getImageSrc(isMobile && settings.website_logo_xs ? settings.website_logo_xs : websiteLogo),
    className: "lm-logo-img" + (websiteLogoInvert ? ' lm-logo__default' : ''),
    alt: websiteTitle || 'website logo'
  }), websiteLogoInvert && inView && React__default.createElement("img", {
    src: getImageSrc(isMobile && settings.website_logo_invert_xs ? settings.website_logo_invert_xs : websiteLogoInvert),
    className: "lm-logo-img" + (websiteLogoInvert ? ' lm-logo__inverted' : ''),
    alt: websiteTitle || 'website logo'
  })))));
}

function LmToggleDrawerButton(_ref) {
  var _content$class_names, _clsx, _content$icon;

  var content = _ref.content;
  var rightDrawer = content.is_right_drawer;

  var _useAppSetup = useAppSetup(),
      rightDrawerMediaBreakpoint = _useAppSetup.rightDrawerMediaBreakpoint,
      leftDrawerMediaBreakpoint = _useAppSetup.leftDrawerMediaBreakpoint,
      hasRightDrawer = _useAppSetup.hasRightDrawer;

  if (rightDrawer && !hasRightDrawer) {
    return null; // if no right drawer on page hide
  }

  var breakpointClass = rightDrawer ? rightDrawerMediaBreakpoint || 'sm' : leftDrawerMediaBreakpoint || 'sm';
  return React__default.createElement(IconButton, {
    className: clsx((_content$class_names = content.class_names) === null || _content$class_names === void 0 ? void 0 : _content$class_names.values, (_clsx = {}, _clsx["d-" + breakpointClass + "-none"] = !content.force_show, _clsx)),
    style: {
      width: 'max-content'
    },
    onClick: function onClick() {
      return rightDrawer ? toggleRightNavigation() : toggleLeftNavigation();
    }
  }, ((_content$icon = content.icon) === null || _content$icon === void 0 ? void 0 : _content$icon.name) ? React__default.createElement(IconCore, {
    iconName: content.icon.name
  }) : rightDrawer ? React__default.createElement(AppsIcon, null) : React__default.createElement(MenuUi, null));
}

var useStyles$m = /*#__PURE__*/styles.makeStyles({
  videoContainer: {
    position: 'relative'
  },
  ratio16x9: {
    paddingTop: 100 / (16 / 9) + "%"
  },
  ratio4x3: {
    paddingTop: 100 / (4 / 3) + "%"
  },
  ratio3x2: {
    paddingTop: 100 / (3 / 2) + "%"
  },
  ratio1x1: {
    paddingTop: "100%"
  }
});
function LmPlayer(_ref) {
  var _content$url_internal, _clsx;

  var content = _ref.content;
  var classes = useStyles$m();

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var videoUrl = ((_content$url_internal = content.url_internal) === null || _content$url_internal === void 0 ? void 0 : _content$url_internal.filename) || content.url; // need to define style rather than class name otherwise change in Storybook not detected if ratio changes

  var url = videoUrl && videoUrl.indexOf(',') !== -1 ? videoUrl.split(',').map(function (i) {
    return i.trim();
  }) : videoUrl;
  return React__default.createElement("div", {
    ref: refIntersectionObserver,
    className: clsx(classes.videoContainer, (_clsx = {}, _clsx[classes["ratio" + content.ratio]] = !!content.ratio, _clsx))
  }, inView ? React__default.createElement(ReactPlayer, {
    style: {
      position: content.ratio ? 'absolute' : undefined,
      top: content.ratio ? 0 : undefined,
      left: content.ratio ? 0 : undefined
    },
    url: url,
    volume: content.muted ? 0 : content.volume,
    loop: content.loop,
    muted: content.muted,
    playsinline: content.playsinline,
    playing: content.playing,
    light: content.fallback_image || content.light,
    controls: content.controls,
    height: content.ratio ? '100%' : content.height || undefined,
    width: content.ratio ? '100%' : content.width || undefined
  }) : React__default.createElement(Skeleton, {
    style: {
      position: 'absolute'
    },
    width: "100%",
    height: "100%",
    variant: "rect"
  }));
}

var ToolbarSectionContainer = function ToolbarSectionContainer(_ref) {
  var _content$class_names;

  var children = _ref.children,
      content = _ref.content;
  var align = content.align;
  var theme = styles.useTheme();
  var appSetup = useAppSetup();
  var matches = useMediaQuery(theme.breakpoints.up(appSetup.leftDrawerMediaBreakpoint || 'sm'));
  var hideOnMediaQuery = content.use_media_query && !matches;
  var invHideOnMediaQuery = content.inv_use_media_query && matches;
  return React__default.createElement(Grid, {
    item: true,
    className: clsx((_content$class_names = content.class_names) === null || _content$class_names === void 0 ? void 0 : _content$class_names.values, {
      'h-100': !align,
      'd-inline-flex': !content.align && !hideOnMediaQuery && !invHideOnMediaQuery,
      'd-none': hideOnMediaQuery || invHideOnMediaQuery
    }),
    style: {
      alignItems: !align ? 'center' : undefined,
      alignSelf: align || 'center'
    }
  }, children);
};

ToolbarSectionContainer.displayName = 'ToolbarSectionContainer';
function LmToolbarSection(_ref2) {
  var settings = _ref2.settings,
      content = _ref2.content;
  var body = content.body || [];
  return React__default.createElement(ToolbarSectionContainer, {
    content: content
  }, body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      settings: settings,
      key: blok._uid
    });
  }));
}

var TransitionSlideUp = /*#__PURE__*/React__default.forwardRef(function (props, ref) {
  return (// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    React__default.createElement(Slide, Object.assign({
      direction: "up",
      ref: ref
    }, props))
  );
});
var useStyles$n = /*#__PURE__*/styles.makeStyles({
  trigger: {
    cursor: 'pointer'
  },
  dialogTitle: {
    '& .MuiTypography-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }
});
function LmDialog(_ref) {
  var _content$trigger, _content$body, _content$body2;

  var content = _ref.content;
  var theme = styles.useTheme();
  var classes = useStyles$n();
  var mediaQueryResult = useMediaQuery(theme.breakpoints.down(content.fullscreen || 'sm'));
  var fullScreen = content.fullscreen ? mediaQueryResult : false;

  var _useState = React.useState(false),
      isOpen = _useState[0],
      setOpen = _useState[1];

  if (!Array.isArray(content.trigger)) {
    console.warn('The Dialog has not a correct trigger element.');
  }

  var dialogProps = {
    open: isOpen,
    fullScreen: fullScreen,
    onClose: content.prevent_click_outside ? undefined : function () {
      return setOpen(false);
    }
  };

  if (content.slide_up) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    dialogProps.TransitionComponent = TransitionSlideUp;
  }

  return React__default.createElement("div", null, React__default.createElement("a", {
    onClick: function onClick() {
      return setOpen(true);
    },
    className: classes.trigger
  }, (_content$trigger = content.trigger) === null || _content$trigger === void 0 ? void 0 : _content$trigger.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  })), React__default.createElement(Dialog, Object.assign({}, dialogProps), !!content.title || !content.prevent_close_button && React__default.createElement(DialogTitle, {
    classes: {
      root: classes.dialogTitle
    }
  }, React__default.createElement("span", null, content.title), !content.prevent_close_button && React__default.createElement(IconButton, {
    onClick: function onClick() {
      return setOpen(false);
    }
  }, React__default.createElement(Close, null))), content.no_padding ? React__default.createElement(React__default.Fragment, null, (_content$body = content.body) === null || _content$body === void 0 ? void 0 : _content$body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  })) : React__default.createElement(DialogContent, null, (_content$body2 = content.body) === null || _content$body2 === void 0 ? void 0 : _content$body2.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }))));
}

var fetcher = function fetcher(input, init) {
  try {
    return Promise.resolve(fetch(input, init)).then(function (res) {
      return res.json();
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var security =  'http';
function LmInstagramPost(_ref) {
  var _swr$data, _swr$data2;

  var content = _ref.content;
  var url = new URL(security + "://api.instagram.com/oembed");
  url.searchParams.append('url', content.url);
  url.searchParams.append('omitscript', 'true');

  if (content.hide_caption) {
    url.searchParams.append('hidecaption', 'true');
  }

  if (content.max_width) {
    url.searchParams.append('maxwidth', "" + content.max_width);
  }

  var urlStr = url.toString();

  var _useScript = useScript(security + "://platform.instagram.com/en_US/embeds.js"),
      ready = _useScript[0];

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var swr = useSWR(function () {
    return ready && inView ? urlStr : null;
  }, fetcher);
  var swrHtml = (_swr$data = swr.data) === null || _swr$data === void 0 ? void 0 : _swr$data.html;
  React.useEffect(function () {
    if (swrHtml) {
      window.instgrm.Embeds.process();
    }
  }, [swrHtml]);
  return React__default.createElement("div", {
    ref: refIntersectionObserver,
    dangerouslySetInnerHTML: {
      __html: ((_swr$data2 = swr.data) === null || _swr$data2 === void 0 ? void 0 : _swr$data2.html) || '<div/>'
    }
  });
}

function InstagramListItem(_ref) {
  var content = _ref.content,
      options = _ref.options;

  if (options.type === 'image') {
    var Social = function Social() {
      return React__default.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between'
        }
      }, React__default.createElement("div", null, !options.hide_comments && content.commented_count > 0 && React__default.createElement(React__default.Fragment, null, React__default.createElement(Comment, {
        fontSize: "small"
      }), content.commented_count)), React__default.createElement("div", null, !options.hide_likes && content.liked_by > 0 && React__default.createElement(React__default.Fragment, null, content.liked_by, React__default.createElement(Heart, {
        fontSize: "small"
      }))));
    };

    return React__default.createElement(React__default.Fragment, null, React__default.createElement("img", {
      src: content.thumbnail.src,
      alt: content.alt,
      style: {
        width: '100%',
        height: !options.height ? 'auto' : '100%',
        objectFit: options.height ? 'cover' : undefined
      },
      width: content.thumbnail.config_width,
      height: content.thumbnail.config_height
    }), (!options.hide_comments || !options.hide_likes) && React__default.createElement(GridListTileBar, {
      subtitle: React__default.createElement(Social, null),
      titlePosition: "top"
    }), !options.hide_description && React__default.createElement(GridListTileBar, {
      subtitle: content.description.split('#')[0],
      titlePosition: "bottom"
    }));
  }

  return React__default.createElement("div", null, React__default.createElement(LmInstagramPost, {
    content: {
      url: "https://instagr.am/p/" + content.shortcode,
      hide_caption: (options === null || options === void 0 ? void 0 : options.hide_caption) || undefined,
      _uid: content.shortcode,
      component: 'instagram_post'
    }
  }));
}

var security$1 =  'http';
function LmInstagramList(_ref) {
  var _data$graphql, _data$graphql$user, _data$graphql$user$ed, _data$graphql$user$ed2, _clsx;

  var content = _ref.content;
  var username = content.username.trim().replace('@', '');

  var _useInView = reactIntersectionObserver.useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var classesShadow = useShadowStyles();

  var _useSWR = useSWR(function () {
    return inView ? security$1 + "://www.instagram.com/" + username + "/?__a=1" : null;
  }, fetcher),
      data = _useSWR.data;

  var posts = data === null || data === void 0 ? void 0 : (_data$graphql = data.graphql) === null || _data$graphql === void 0 ? void 0 : (_data$graphql$user = _data$graphql.user) === null || _data$graphql$user === void 0 ? void 0 : (_data$graphql$user$ed = _data$graphql$user.edge_owner_to_timeline_media) === null || _data$graphql$user$ed === void 0 ? void 0 : (_data$graphql$user$ed2 = _data$graphql$user$ed.edges) === null || _data$graphql$user$ed2 === void 0 ? void 0 : _data$graphql$user$ed2.filter(function (i) {
    if (content.hide_videos) {
      return !i.node.is_video;
    }

    if (content.hide_images) {
      return i.node.is_video;
    }

    return true;
  }).map(function (i) {
    return {
      shortcode: i.node.shortcode,
      image_url: i.node.display_url,
      commented_count: i.node.edge_media_to_comment.count,
      liked_by: i.node.edge_liked_by.count,
      media_preview: i.node.media_preview,
      thumbnail: i.node.thumbnail_resources[i.node.thumbnail_resources.length - 1],
      is_video: i.node.is_video,
      description: i.node.edge_media_to_caption.edges[0].node.text,
      alt: i.node.accessibility_caption
    };
  }).splice(0, content.max_posts ? Number(content.max_posts) : 12);
  var gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet,
    isMasonry: !!content.masonry
  });
  return React__default.createElement("div", {
    ref: refIntersectionObserver,
    style: {
      overflowX: 'hidden'
    },
    className: clsx((_clsx = {}, _clsx[gridClasses.masonry] = content.masonry, _clsx))
  }, React__default.createElement(GridList, {
    className: gridClasses.gridList,
    cellHeight: content.height || 'auto',
    style: {
      columnGap: content.masonry ? content.column_gap + "px" : undefined
    },
    spacing: !content.masonry ? content.column_gap ? Number(content.column_gap) : 2 : 0
  }, (posts || []).map(function (item) {
    var _clsx2;

    return React__default.createElement(core.GridListTile, {
      key: item.shortcode,
      component: "a",
      classes: {
        tile: clsx((_clsx2 = {}, _clsx2[classesShadow[content.shadow_effect || '']] = !!content.shadow_effect, _clsx2))
      },
      href: "https://instagram.com/p/" + item.shortcode,
      target: "_blank"
    }, React__default.createElement(InstagramListItem, {
      content: item,
      options: content
    }));
  })));
}

var CardContentContainer = function CardContentContainer(_ref) {
  var content = _ref.content,
      children = _ref.children;

  if (content.link) {
    var _content$link;

    var btnProps = ((_content$link = content.link) === null || _content$link === void 0 ? void 0 : _content$link.cached_url) ? _extends({}, getLinkAttrs(content.link, {
      openExternal: !!content.open_external
    }), {
      naked: true,
      component: LmCoreComponents.lm_link_render
    }) : {};
    return React__default.createElement(CardActionArea, Object.assign({}, btnProps), children);
  }

  return React__default.createElement(React__default.Fragment, null, children);
};
CardContentContainer.displayName = 'CardContentContainer';

var useStyles$o = /*#__PURE__*/styles.makeStyles({
  naked: {
    padding: 0,
    boxShadow: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 'unset'
  },
  none: {
    display: 'none'
  }
});
function LmTimelineItem(_ref) {
  var _content$opposite_bod, _clsx, _content$body;

  var content = _ref.content,
      options = _ref.options,
      isMobile = _ref.isMobile,
      isLast = _ref.isLast;
  var classes = useStyles$o();
  return React__default.createElement(TimelineItem, null, React__default.createElement(TimelineOppositeContent, {
    classes: {
      root: isMobile ? classes.none : undefined
    }
  }, (_content$opposite_bod = content.opposite_body) === null || _content$opposite_bod === void 0 ? void 0 : _content$opposite_bod.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  })), React__default.createElement(TimelineSeparator, null, React__default.createElement(TimelineDot, {
    color: content.dot_color || undefined,
    variant: content.dot_variant === 'outlined' || options.variant === 'outlined' ? 'outlined' : 'default',
    className: clsx((_clsx = {}, _clsx[classes.naked] = content.dot_variant === 'naked' || options.variant === 'naked', _clsx))
  }, content.icon && content.icon.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  })), !isLast && React__default.createElement(TimelineConnector, null)), React__default.createElement(TimelineContent, null, React__default.createElement(Card, null, React__default.createElement(CardContentContainer, {
    content: content
  }, (content.title || content.subheader) && React__default.createElement(CardHeader, {
    title: content.title,
    subheader: content.subheader
  }), (content.body || []).length > 0 && React__default.createElement(CardContent, null, (_content$body = content.body) === null || _content$body === void 0 ? void 0 : _content$body.map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  }))))));
}

function useScrollOnce() {
  var _useState = React.useState(false),
      isScrolled = _useState[0],
      setState = _useState[1];

  React.useEffect(function () {
    if (typeof window === 'undefined') {
      return undefined;
    }

    var handler = function handler() {
      setState(true);
    };

    window.addEventListener('scroll', handler, {
      capture: false,
      passive: true,
      once: true
    });
    return function () {
      window.removeEventListener('scroll', handler);
    };
  }, []);
  return isScrolled;
}

function TawktoChatButton(_ref) {
  var content = _ref.content;

  var _useAppContext = useAppContext(),
      insideStoryblok = _useAppContext.insideStoryblok;

  var tawkToId = content.account;
  var isScrolled = useScrollOnce();
  var startInclude = content.disable_lazy || isScrolled;
  var tawkToScriptName = !insideStoryblok && tawkToId && startInclude ? "https://embed.tawk.to/" + tawkToId + "/default" : '';

  var _useScript = useScript(tawkToScriptName),
      status = _useScript[1];

  if (status === ScriptStatus.ERROR) {
    console.error('Tawkto script could not load');
  }

  React.useEffect(function () {
    var _window, _window$Tawk_API;

    if ((_window = window) === null || _window === void 0 ? void 0 : (_window$Tawk_API = _window.Tawk_API) === null || _window$Tawk_API === void 0 ? void 0 : _window$Tawk_API.isChatHidden()) {
      var _window$Tawk_API2;

      (_window$Tawk_API2 = window.Tawk_API) === null || _window$Tawk_API2 === void 0 ? void 0 : _window$Tawk_API2.showWidget();
    }

    return function () {
      var _window2;

      if ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);
  return null;
}

var whatsappUrl = "https://wa.me";
function WhatsappChatButton(_ref) {
  var content = _ref.content;
  var phoneNumber = content.phone_number || '';
  phoneNumber = phoneNumber.replace(/[^\w\s]/gi, '').replace(/ /g, '');
  var url = new URL(whatsappUrl + "/" + phoneNumber);
  return React__default.createElement(Tooltip, {
    placement: "top",
    title: content.tooltip || ''
  }, React__default.createElement(Fab, {
    onClick: function onClick() {
      window.open(url.toString());
    },
    style: {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      backgroundColor: '#4dc247',
      color: 'white'
    }
  }, React__default.createElement(Whatsapp, null)));
}

function FacebookChatButton(_ref) {
  var content = _ref.content;

  var _useAppContext = useAppContext(),
      insideStoryblok = _useAppContext.insideStoryblok;

  var isScrolled = useScrollOnce();
  var startInclude = !insideStoryblok && content.page_id && (content.disable_lazy || isScrolled);

  var _useState = React.useState(false),
      initialized = _useState[0],
      setInitialized = _useState[1];

  var _useScript = useScript(startInclude ? 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js' : '', {
    id: 'facebook-jssdk'
  }),
      status = _useScript[1];

  if (!initialized) {
    window.fbAsyncInit = function () {
      var _window$FB;

      (_window$FB = window.FB) === null || _window$FB === void 0 ? void 0 : _window$FB.init({
        xfbml: true,
        version: 'v8.0'
      });
      setInitialized(true);
    };
  }

  if (ScriptStatus.ERROR === status) {
    console.log(status);
  }

  React.useEffect(function () {
    var _window, _window$FB2, _window$FB2$CustomerC;

    (_window = window) === null || _window === void 0 ? void 0 : (_window$FB2 = _window.FB) === null || _window$FB2 === void 0 ? void 0 : (_window$FB2$CustomerC = _window$FB2.CustomerChat) === null || _window$FB2$CustomerC === void 0 ? void 0 : _window$FB2$CustomerC.show();
    return function () {
      var _window2, _window2$FB, _window2$FB$CustomerC;

      (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$FB = _window2.FB) === null || _window2$FB === void 0 ? void 0 : (_window2$FB$CustomerC = _window2$FB.CustomerChat) === null || _window2$FB$CustomerC === void 0 ? void 0 : _window2$FB$CustomerC.hide();
    };
  }, []);
  return startInclude ? // <MessengerCustomerChat
  //   pageId={content.page_id}
  //   appId={content.app_id}
  // />
  React__default.createElement("div", {
    className: "fb-customerchat",
    // @ts-ignore
    attribution: "setup_tool",
    page_id: content.page_id
  }) : null;
}

function LmSnackbar(_ref) {
  var _content$background_c, _content$border_color;

  var content = _ref.content;

  var _React$useState = React__default.useState(false),
      open = _React$useState[0],
      setOpen = _React$useState[1];

  var isScrolled = useScrollOnce();
  var cookieExists = content.cookie_name ? Cookies.get(content.cookie_name) : false;
  React.useEffect(function () {
    var initalValue = true;

    if (cookieExists || content.auto_show || content.display === 'show_on_scroll') {
      initalValue = false;
    }

    setOpen(initalValue);
  }, [cookieExists, content.display, content.auto_show]);
  React.useEffect(function () {
    if (!content.display || !isScrolled) {
      return;
    }

    if (content.display === 'show_on_scroll' && !cookieExists) {
      setOpen(true);
    } else if (content.display === 'hide_on_scroll') {
      setOpen(false);
    }
  }, [isScrolled, content.display, cookieExists]);
  React.useEffect(function () {
    if (!content.auto_close) {
      return undefined;
    }

    var timer = setTimeout(function () {
      setOpen(false);
    }, content.auto_close);
    return function () {
      return clearTimeout(timer);
    };
  }, [content.auto_close]);
  React.useEffect(function () {
    if (!content.auto_show && !cookieExists) {
      return undefined;
    }

    var timer = setTimeout(function () {
      setOpen(true);
    }, content.auto_show);
    return function () {
      return clearTimeout(timer);
    };
  }, [content.auto_show, cookieExists]);

  var handleAccept = function handleAccept() {
    setOpen(false);
  };

  return content.dialog ? React__default.createElement(core.Dialog, {
    open: open,
    maxWidth: content.max_width || false,
    PaperProps: {
      elevation: content.elevation || undefined,
      square: content.square
    },
    onClose: content.prevent_click_outside ? undefined : function () {
      return setOpen(false);
    }
  }, React__default.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, ((content === null || content === void 0 ? void 0 : content.close_action) || []).map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: _extends({
        color: 'secondary_text'
      }, blok),
      key: blok._uid,
      onClick: handleAccept
    });
  })), React__default.createElement(core.DialogContent, null, ((content === null || content === void 0 ? void 0 : content.descriptions) || []).map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: blok,
      key: blok._uid
    });
  })), React__default.createElement(core.DialogActions, null, ((content === null || content === void 0 ? void 0 : content.additional_actions) || []).map(function (blok) {
    return React__default.createElement(LmComponentRender, {
      content: _extends({
        color: 'secondary_text'
      }, blok),
      key: blok._uid
    });
  }))) : React__default.createElement(Snackbar, {
    anchorOrigin: {
      horizontal: content.anchor_horizontal || 'center',
      vertical: content.anchor_vertical || 'bottom'
    },
    open: open,
    classes: {},
    style: {
      width: content.width ? content.width : undefined
    }
  }, React__default.createElement(SnackbarContent, {
    elevation: content.elevation || undefined,
    variant: content.variant === 'outlined' ? 'outlined' : 'elevation',
    style: {
      width: content.width ? content.width : undefined,
      backgroundColor: ((_content$background_c = content.background_color) === null || _content$background_c === void 0 ? void 0 : _content$background_c.rgba) || undefined,
      alignItems: content.button_top_align ? 'flex-start' : undefined,
      border: ((_content$border_color = content.border_color) === null || _content$border_color === void 0 ? void 0 : _content$border_color.rgba) ? "1px solid " + content.border_color.rgba : undefined,
      borderRadius: content.square ? 0 : undefined
    },
    message: React__default.createElement(React__default.Fragment, null, ((content === null || content === void 0 ? void 0 : content.descriptions) || []).map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: blok,
        key: blok._uid
      });
    })),
    action: React__default.createElement(React__default.Fragment, null, ((content === null || content === void 0 ? void 0 : content.additional_actions) || []).map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: _extends({
          color: 'secondary_text'
        }, blok),
        key: blok._uid
      });
    }), ((content === null || content === void 0 ? void 0 : content.close_action) || []).map(function (blok) {
      return React__default.createElement(LmComponentRender, {
        content: _extends({
          color: 'secondary_text'
        }, blok),
        key: blok._uid,
        onClick: handleAccept
      });
    }))
  }));
}

LmCoreComponents.page = LmPage;
LmCoreComponents.table = LmTable;
LmCoreComponents.accordion = LmAccordion;
LmCoreComponents.accordion_item = LmAccordionItem;
LmCoreComponents.static_section = LmStaticSection;
LmCoreComponents.static_container = LmStaticContainer;
LmCoreComponents.divider = LmDivider;
LmCoreComponents.html = LmHtml;
LmCoreComponents.hubspot_meeting = LmHubspotMeeting;
LmCoreComponents.button_list = LmButtonList;
LmCoreComponents.section = LmSection;
LmCoreComponents.headline = LmHeadline; // LmCoreComponents.paragraph = LmParagraph

LmCoreComponents.row = LmGridRow;
LmCoreComponents.column = LmGridColumn;
LmCoreComponents.image = LmImage$1;
LmCoreComponents.image_list = LmImageList;
LmCoreComponents.image_list_item = LmImageListItem;
LmCoreComponents.button = LmButton;
LmCoreComponents.nav_list = LmNavList;
LmCoreComponents.nav_menu = LmMenu;
LmCoreComponents.icon = LmIcon;
LmCoreComponents.iframe = LmIframe;
LmCoreComponents.slider = LmSlider;
LmCoreComponents.section_video_bg = LmSectionVideo;
LmCoreComponents.card_list = LmCardList;
LmCoreComponents.card_list_item = LmCardListItem;
LmCoreComponents.section_parallax = LmSectionParallax;
LmCoreComponents.tabs = LmTabs;
LmCoreComponents.list_widget = LmListWidget;
LmCoreComponents.flex_row = LmFlexRow;
LmCoreComponents.iframe_advanced = LmIframeAdvanced;
LmCoreComponents.category_box = LmCategoryBox;
LmCoreComponents.list_search_field = LmListSearchField;
LmCoreComponents.link = LmLink;
LmCoreComponents.list_search_autocomplete = LmListSearchAutocomplete;
LmCoreComponents.rich_text_editor = LmRichTextParagraph;
LmCoreComponents.timeline = LmTimeline;
LmCoreComponents.timeline_item = LmTimelineItem;
LmCoreComponents.avatar = LmAvatar;
LmCoreComponents.date_headline = LmDateHeadline;
LmCoreComponents.motion = LmMotion;
LmCoreComponents.toolbar_logo = LmToolbarLogo;
LmCoreComponents.toolbar_navi_button = LmToggleDrawerButton;
LmCoreComponents.player = LmPlayer;
LmCoreComponents.toolbar_row_section = LmToolbarSection;
LmCoreComponents.dialog = LmDialog;
LmCoreComponents.instagram_post = LmInstagramPost;
LmCoreComponents.instagram_list = LmInstagramList;
LmCoreComponents.lm_link_render = MuiNextLink;
LmCoreComponents.chat_tawkto = TawktoChatButton;
LmCoreComponents.chat_whatsapp = WhatsappChatButton;
LmCoreComponents.chat_facebook = FacebookChatButton;
LmCoreComponents.snackbar = LmSnackbar;

var AppSetupProvider = function AppSetupProvider(_ref) {
  var _page$right_body;

  var children = _ref.children,
      settings = _ref.settings,
      page = _ref.page;

  var _useDeviceDimensions = useDeviceDimensions(),
      isMobile = _useDeviceDimensions.isMobile;

  var hasDrawer = Array.isArray(settings.drawer_body) && settings.drawer_body.length > 0;
  var hasFeatureImage = page && Array.isArray(page.property) && page.property.includes('has_feature');
  var hasRightDrawer = page && Array.isArray(page.right_body) && ((_page$right_body = page.right_body) === null || _page$right_body === void 0 ? void 0 : _page$right_body.length) > 0;
  var hasScrollCollapse = !!(settings.toolbar_config && settings.toolbar_config.includes('scroll_collapse'));
  var drawerVariant = isMobile && settings.drawer_below_toolbar_xs ? 'persistent' : 'temporary';

  if (!isMobile) {
    drawerVariant = settings.drawer_below_toolbar ? 'persistent' : settings.drawer_variant || 'temporary';
  }

  var toolbarMainHeight = settings.toolbar_main_height;
  var drawerBelowToolbar = settings.drawer_below_toolbar_xs || settings.drawer_below_toolbar;
  var drawerFullWidthMobile = !!settings.drawer_full_width_mobile;
  var rightDrawerMediaBreakpoint = page === null || page === void 0 ? void 0 : page.mobile_breakpoint;
  var leftDrawerMediaBreakpoint = settings === null || settings === void 0 ? void 0 : settings.mobile_nav_breakpoint;
  var value = React.useMemo(function () {
    return {
      hasDrawer: hasDrawer,
      hasFeatureImage: hasFeatureImage,
      hasRightDrawer: hasRightDrawer,
      hasScrollCollapse: hasScrollCollapse,
      toolbarMainHeight: toolbarMainHeight,
      drawerVariant: drawerVariant,
      drawerBelowToolbar: drawerBelowToolbar,
      drawerFullWidthMobile: drawerFullWidthMobile,
      rightDrawerMediaBreakpoint: rightDrawerMediaBreakpoint,
      leftDrawerMediaBreakpoint: leftDrawerMediaBreakpoint
    };
  }, [hasDrawer, hasFeatureImage, hasRightDrawer, hasScrollCollapse, toolbarMainHeight, drawerVariant, drawerBelowToolbar, drawerFullWidthMobile, rightDrawerMediaBreakpoint, leftDrawerMediaBreakpoint]);
  return React__default.createElement(AppSetupContext.Provider, {
    value: value
  }, children);
};

AppSetupProvider.displayName = 'AppSetupProvider';

var AppProvider = function AppProvider(_ref) {
  var children = _ref.children,
      content = _ref.content;
  return React__default.createElement(AppContext.Provider, {
    value: content
  }, children);
};

AppProvider.displayName = 'AppProvider';

function LmImageList(_ref) {
  var _clsx;

  var content = _ref.content;
  var classes = useImageListStyles();

  var _useWindowSize = windowSize.useWindowSize(),
      width = _useWindowSize[0],
      height = _useWindowSize[1];

  var gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet,
    isMasonry: !!content.masonry
  });
  var containerRef = React__default.createRef();

  var _useState = React.useState(''),
      lightbox = _useState[0],
      setLightbox = _useState[1];

  var gutterSize = content.column_gap ? Number(content.column_gap) : 2;

  function onImageClick(element) {
    // open lightbox
    content.enable_lightbox && setLightbox(element._uid);
  }

  var body = content.body || [];
  var gridListProps = {
    spacing: gutterSize
  };

  if (content.masonry) {
    gridListProps.spacing = 0;
    gridListProps.style = {
      // columnCount: columnCount,
      columnGap: gutterSize + "px"
    };
  }

  return React__default.createElement("div", {
    className: "lm-imagelist__container"
  }, React__default.createElement("div", {
    ref: containerRef,
    style: {
      padding: gutterSize + "px"
    },
    className: clsx(classes.root, (_clsx = {}, _clsx[gridClasses.masonry] = content.masonry, _clsx[classes.aspectRatio] = content.aspect_ratio && !content.masonry, _clsx["ratio-" + content.aspect_ratio] = content.aspect_ratio, _clsx['with-lightbox'] = content.enable_lightbox, _clsx))
  }, React__default.createElement(GridList, Object.assign({
    cellHeight: "auto",
    className: gridClasses.gridList
  }, gridListProps), body.map(function (item, i) {
    var _item$link;

    var btnProps = ((_item$link = item.link) === null || _item$link === void 0 ? void 0 : _item$link.cached_url) && !content.enable_lightbox ? _extends({}, getLinkAttrs(item.link, {
      openExternal: !!item.open_external
    }), {
      naked: true,
      component: LmCoreComponents.lm_link_render
    }) : {};
    return React__default.createElement(GridListTile, Object.assign({
      key: item.component + "_" + i
    }, btnProps, {
      style: {
        padding: !content.masonry ? gutterSize + "px" : undefined,
        marginBottom: content.masonry ? gutterSize + "px" : undefined
      },
      onClick: function onClick(ev) {
        return onImageClick(_extends({
          _uid: item._uid,
          count: i
        }, ev));
      }
    }), React__default.createElement(LmComponentRender, {
      content: item,
      listProps: content
    }));
  }))), lightbox && ImageListLightbox({
    elements: body,
    lightbox: lightbox,
    setLightbox: setLightbox,
    onImageClick: onImageClick,
    className: classes.lightbox,
    width: width,
    height: height
  }));
}

var LmCoreComponentsNamed = {
  table: LmTable,
  accordion: LmAccordion,
  accordion_item: LmAccordionItem,
  divider: LmDivider,
  html: LmHtml,
  button_list: LmButtonList,
  section: LmSection,
  headline: LmHeadline,
  row: LmGridRow,
  column: LmGridColumn,
  image: LmImage$1,
  image_list: LmImageList,
  image_list_item: LmImageListItem,
  button: LmButton,
  nav_list: LmNavList,
  icon: LmIcon,
  iframe: LmIframe,
  slider: LmSlider,
  section_video_bg: LmSectionVideo,
  card_list: LmCardList,
  section_parallax: LmSectionParallax,
  tabs: LmTabs,
  flex_row: LmFlexRow,
  rich_text_editor: LmRichTextParagraph,
  timeline: LmTimeline,
  timeline_item: LmTimelineItem,
  avatar: LmAvatar,
  date_headline: LmDateHeadline,
  motion: LmMotion,
  player: LmPlayer
};
function LmComponentRender$1(props) {
  var content = props.content,
      i = props.i,
      rest = _objectWithoutPropertiesLoose(props, ["content", "i"]);

  if (typeof LmCoreComponentsNamed[content.component] !== 'undefined') {
    return React__default.createElement(LmCoreComponentsNamed[content.component], _extends({
      content: content,
      key: typeof i === 'number' ? content.component + "_" + i : undefined
    }, rest));
  }

  return React__default.createElement("div", {
    style: {
      color: 'red'
    },
    key: (content === null || content === void 0 ? void 0 : content._uid) || "" + i
  }, "The component ", content.component || 'no name found', " has not been created yet.");
}

exports.CONFIG = CONFIG;
exports.LmAccordion = LmAccordion;
exports.LmAccordionItem = LmAccordionItem;
exports.LmAppProvider = AppProvider;
exports.LmAppSetupProvider = AppSetupProvider;
exports.LmAvatar = LmAvatar;
exports.LmButton = LmButton;
exports.LmButtonList = LmButtonList;
exports.LmCardList = LmCardList;
exports.LmComponentRender = LmComponentRender$1;
exports.LmCoreComponentsNamed = LmCoreComponentsNamed;
exports.LmDateHeadline = LmDateHeadline;
exports.LmDivider = LmDivider;
exports.LmFlexRow = LmFlexRow;
exports.LmGridColumn = LmGridColumn;
exports.LmGridRow = LmGridRow;
exports.LmHeadline = LmHeadline;
exports.LmHtml = LmHtml;
exports.LmIcon = LmIcon;
exports.LmIframe = LmIframe;
exports.LmImage = LmImage$1;
exports.LmImageList = LmImageList;
exports.LmImageListItem = LmImageListItem;
exports.LmMotion = LmMotion;
exports.LmNavList = LmNavList;
exports.LmPlayer = LmPlayer;
exports.LmRichTextParagraph = LmRichTextParagraph;
exports.LmSection = LmSection;
exports.LmSectionParallax = LmSectionParallax;
exports.LmSectionVideo = LmSectionVideo;
exports.LmSlider = LmSlider;
exports.LmTable = LmTable;
exports.LmTabs = LmTabs;
exports.LmTimeline = LmTimeline;
exports.useAppContext = useAppContext;
exports.useAppSetup = useAppSetup;
//# sourceMappingURL=lumen-cms-base.cjs.development.js.map
