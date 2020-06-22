import React, { useContext, createContext, useState, createRef, useMemo, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import InlineSVG from 'react-inlinesvg';
import { useInView } from 'react-intersection-observer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { createGlobalState } from 'react-hooks-global-state';
import Fade from '@material-ui/core/Fade';
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import SwipeableViews from 'react-swipeable-views';
import ChevronLeft from 'mdi-material-ui/ChevronLeft';
import ChevronRight from 'mdi-material-ui/ChevronRight';
import Close from 'mdi-material-ui/Close';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import MuiLink from '@material-ui/core/Link';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ChevronDown from 'mdi-material-ui/ChevronDown';
import ReactPlayer from 'react-player';
import { ParallaxBanner } from 'react-scroll-parallax';
import MuiTabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';
import Zoom from '@material-ui/core/Zoom';
import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import Plus from 'mdi-material-ui/Plus';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import StoryblokClient from 'storyblok-js-client';
import { useDebouncedCallback } from 'use-debounce';
import { isMobile } from 'is-mobile';

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
  insideStoryblok: false,
  ComponentRender: function ComponentRender(_blok) {
    return React.createElement("div", null, "needs to be set");
  }
};
var AppContext = /*#__PURE__*/createContext(defaultValue);
var useAppContext = function useAppContext() {
  return useContext(AppContext);
};

function LmAccordion(_ref) {
  var content = _ref.content;

  var _useState = useState(''),
      opened = _useState[0],
      setOpen = _useState[1];

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender; // console.log(ctx)


  return React.createElement("div", {
    className: "lm-accordion"
  }, (content.body || []).map(function (blok, iteration) {
    return ComponentRender({
      content: blok,
      options: content,
      opened: opened,
      setOpen: setOpen,
      iteration: iteration,
      i: iteration
    });
  }));
}

var useStyles = /*#__PURE__*/makeStyles(function (theme) {
  return createStyles({
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
  return React.createElement("tr", null, content.map(function (column, iterator) {
    return React.createElement("td", {
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
  return React.createElement("table", {
    className: className
  }, !content.disable_table_head && React.createElement("thead", null, React.createElement("tr", null, tableHead.map(function (content, index) {
    return React.createElement("th", {
      key: "head_" + index
    }, content);
  }))), React.createElement("tbody", null, tableBody.map(function (row, index) {
    return React.createElement(TableRow, {
      key: "row_" + index,
      index: index,
      content: row
    });
  })));
}

var intersectionDefaultOptions = {
  triggerOnce: true,
  rootMargin: '400px 0px 400px 0px'
};

var underscoreToMinus = function underscoreToMinus(str) {
  return str.replace(/_/g, '-');
};

var useStyles$1 = /*#__PURE__*/makeStyles({
  icon: {
    fill: 'currentColor',
    width: '1em',
    height: '1em'
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
      iconUrl = _ref.iconUrl;
  var classes = useStyles$1();

  var _useInView = useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  iconName = iconName ? iconMap[iconName] || iconName : undefined;
  var iconSrc = '';

  if (inView && (iconUrl || iconName)) {
    iconSrc = iconUrl ? iconUrl : "https://cdn.jsdelivr.net/npm/@mdi/svg/svg/" + underscoreToMinus(iconName) + ".svg";
  }

  return iconName || iconUrl ? React.createElement(React.Fragment, null, iconSrc && React.createElement(InlineSVG, {
    style: style,
    className: clsx(classes.icon, 'lm-svg-icon', className, (_clsx = {}, _clsx['size__' + buttonSize] = buttonSize, _clsx)),
    onError: function onError() {
      console.error("Icon not found: " + iconName); // console.error(e)
    },
    src: iconSrc
  }), React.createElement("span", {
    ref: refIntersectionObserver
  })) : React.createElement("span", null);
}

var useStyles$2 = /*#__PURE__*/makeStyles({
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
  return React.createElement("div", {
    className: className,
    style: style
  }, React.createElement("div", {
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
    return React.createElement(DividerContainer, {
      style: style,
      childStyle: childStyle,
      className: className
    }, React.createElement("div", null, React.createElement("div", {
      style: {
        borderTopWidth: (content.thickness || 1) + "px"
      }
    }, React.createElement("span", null, React.createElement(IconCore, {
      iconName: iconName,
      style: {
        fontSize: iconSize + 'px',
        marginTop: (content.thickness || 1) + "px"
      }
    })))));
  }

  return React.createElement(DividerContainer, {
    style: style,
    childStyle: childStyle,
    className: className
  }, React.createElement("span", null));
}

function LmButtonList(_ref) {
  var content = _ref.content;

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var body = content.body || [];
  var properties = content.property || [];
  var classNames = clsx('d-flex', content.class_names && content.class_names.values, {
    'lm-button-list__margin-left': properties.includes('margin_left')
  });
  return React.createElement("div", {
    className: classNames
  }, body.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  }));
}

// @ts-ignore
function componentLogger(component) {
  if (process.env.NODE_ENV !== 'production') ;
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

function LmHeadline(_ref) {
  var _clsx;

  var content = _ref.content;
  componentLogger();
  var component = content.tag ? content.tag : undefined;
  return React.createElement(Typography, {
    className: clsx(content.style, content.style_props, content.class_names && content.class_names.values, (_clsx = {}, _clsx["lm-font-" + content.font] = content.font, _clsx)),
    component: component,
    align: content.align ? content.align : undefined,
    color: content.color ? content.color : undefined,
    style: {
      color: content.custom_color && content.custom_color.rgba ? content.custom_color.rgba : undefined,
      lineHeight: content.line_height ? content.line_height : undefined,
      fontSize: content.font_size ? content.font_size : undefined,
      letterSpacing: content.letter_spacing ? content.letter_spacing : undefined
    },
    variant: mapTypographyVariant[content.typography ? content.typography : 'headline4']
  }, !!content.text_xs && React.createElement(React.Fragment, null, React.createElement("span", {
    className: "d-none d-sm-block"
  }, content.text), React.createElement("span", {
    className: "d-block d-sm-none"
  }, content.text_xs)), React.createElement(React.Fragment, null), !content.text_xs && content.text);
}

var CONFIG = {
  href: process.env.HREF || '/[...index]',
  previewToken: process.env.NEXT_PUBLIC_PREVIEW_TOKEN || '',
  publicToken: process.env.NEXT_PUBLIC_PUBLIC_TOKEN || '',
  languages: process.env.NEXT_PUBLIC_LANGUAGES && /*#__PURE__*/process.env.NEXT_PUBLIC_LANGUAGES.split(',') || [],
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
  rootDirectory: process.env.NEXT_PUBLIC_ROOT_DIRECTORY,
  overwriteLocale: process.env.NEXT_PUBLIC_OVERWRITE_LOCALE,
  suppressSlugLocale: !!process.env.NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE,
  overwriteDisableIndex: !!process.env.NEXT_PUBLIC_OVERWRITE_DISABLE_INDEX,
  GA: process.env.NEXT_PUBLIC_GA,
  TAWKTO: process.env.NEXT_PUBLIC_TAWKTO,
  prefetch: !process.env.NEXT_PUBLIC_DISABLE_PREFETCH
};

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

var _createGlobalState = /*#__PURE__*/createGlobalState(initialState),
    getGlobalState = _createGlobalState.getGlobalState;

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

  if (originalDimensions.width < width) {
    width = originalDimensions.width;
  }

  if (height && originalDimensions.height < height) {
    height = originalDimensions.height;
  }

  if (fitInColor) {
    filter += ":fill(" + fitInColor + ")";
  }

  var path = getPath(width, height);

  if (focalPoint) {
    filter += getFocalPoint(originalSource, focalPoint);
  }

  var src = imageService(originalSource, path, filter);
  var imgObj = {
    src: src,
    srcSet: src
  }; // enable retina sourceset

  if (width <= originalDimensions.width / 2 && height <= originalDimensions.height / 2) {
    imgObj.srcSet = imgObj.src + " 1x, " + imageService(originalSource, getPath(width * 2, height * 2), filter) + " 2x";
  }

  function getPath(width, height) {
    var path = (width || 0) + "x" + (height || 0);

    if (fitInColor) {
      path = 'fit-in/' + path;
    } else if (smart && !focalPoint) {
      path += '/smart';
    }

    return path;
  }

  return imgObj;
}

var boundCoordinate = function boundCoordinate(value, upperBound) {
  value = Math.max(0, value);
  value = Math.min(value, upperBound);
  return Math.ceil(value);
};

var FOCAL_SQUARE_LENGTH = 100;
function getFocalPoint(src, focalPoint) {
  var _getOriginalImageDime = getOriginalImageDimensions(src),
      width = _getOriginalImageDime.width,
      height = _getOriginalImageDime.height;

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
}
function imageService(image, option, filter) {
  if (option === void 0) {
    option = '';
  }

  if (filter === void 0) {
    filter = '';
  }

  if (image.endsWith('.svg')) {
    return image;
  }

  option && (option += '/');

  if (getGlobalState('hasWebpSupport')) {
    option += 'filters:format(webp)' + filter;
  } else if (filter) {
    option += 'filters' + filter;
  }

  return "https://img2.storyblok.com/" + option + image.split('storyblok.com')[1];
}

var defaultWindowsProvider = {
  height: 500,
  width: 599,
  isMobile: true,
  isTablet: false,
  isDesktop: false
};
var WindowDimensionsCtx = /*#__PURE__*/createContext(defaultWindowsProvider);
var useWindowDimensions = function useWindowDimensions() {
  return useContext(WindowDimensionsCtx);
};

var ImageShadow = function ImageShadow(_ref) {
  var afterLoad = _ref.afterLoad,
      rest = _objectWithoutPropertiesLoose(_ref, ["afterLoad"]);

  var ref = createRef();

  if (!rest.src) {
    return null; // don't render any component
  }

  var hasLoaded = function hasLoaded() {
    var _ref$current, _ref$current2;

    var src = ((_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.currentSrc) || ((_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.src) || '';
    src && typeof afterLoad === 'function' && afterLoad(src);
  };

  return React.createElement("img", Object.assign({
    ref: ref,
    style: {
      display: 'none'
    },
    alt: 'img shadow'
  }, rest, {
    onLoad: hasLoaded
  }));
};

var useStyles$3 = /*#__PURE__*/makeStyles(function (theme) {
  var _lmFixedBg;

  return createStyles({
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
      }, _lmFixedBg[theme.breakpoints.down('sm') + 'and (orientation: portrait)'] = {
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      }, _lmFixedBg[theme.breakpoints.down('sm') + 'and (orientation: landscape)'] = {
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      }, _lmFixedBg)
    }
  });
});

function BackgroundImage(_ref) {
  var content = _ref.content,
      backgroundStyle = _ref.backgroundStyle;

  if (!content.image) {
    return null;
  }

  var image = content.image;
  var classes = useStyles$3();

  var _useWindowDimensions = useWindowDimensions(),
      isDesktop = _useWindowDimensions.isDesktop,
      width = _useWindowDimensions.width,
      height = _useWindowDimensions.height;

  var _useState = useState(),
      imgSrc = _useState[0],
      setImgSrc = _useState[1];

  var _useInView = useInView(intersectionDefaultOptions),
      viewRef = _useInView[0],
      inView = _useInView[1],
      anchorRef = _useInView[2];

  var theme = useTheme();
  var matches = useMediaQuery(theme.breakpoints.down(content.hide_image_on_breakpoint || 'xs'));
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
        currentHeight = currentHeight + 200;
        currentWidth = currentWidth + 200;
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


  return React.createElement(React.Fragment, null, !imgSrc && React.createElement(Skeleton, {
    width: '100%',
    height: '100%',
    style: {
      position: 'absolute'
    },
    variant: "rect"
  }), React.createElement(ImageShadow, {
    src: imageAttrs.src,
    srcSet: imageAttrs.srcSet,
    afterLoad: setImgSrc
  }), React.createElement(Fade, {
    "in": !!imgSrc,
    timeout: 1000
  }, React.createElement("div", {
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

  var _useInView = useInView(intersectionDefaultOptions),
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
      }
    }).filter(function (i) {
      return i;
    }).join(',');
  }

  return React.createElement("div", {
    ref: viewRef,
    style: styleElement
  });
}

var useShadowStyles = /*#__PURE__*/makeStyles({
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

  var background = props.background,
      variant = props.variant;
  var theme = useTheme();
  var styles = useShadowStyles();

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
  var border = undefined;

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
  var className = clsx((_background$className = background.classNames) === null || _background$className === void 0 ? void 0 : _background$className.values, (_clsx = {}, _clsx[styles[background.shadow_effect || '']] = !!background.shadow_effect, _clsx));
  return {
    className: className,
    style: style
  };
}

var useStyles$4 = /*#__PURE__*/makeStyles(function (theme) {
  var _xsColumnReverse, _smColumnReverse;

  return createStyles({
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
  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var classes = useStyles$4();
  var spacing = content.spacing ? Number(content.spacing) : 3;
  var background = Array.isArray(content.background) && content.background[0];
  var direction = content.direction;

  var _useBackgroundBox = useBackgroundBox({
    background: background
  }),
      style = _useBackgroundBox.style,
      className = _useBackgroundBox.className;

  return React.createElement(Grid, {
    container: true,
    style: _extends({}, style, {
      padding: spacing ? "-" + spacing * 8 + "px" : undefined
    }),
    spacing: spacing,
    alignItems: content.align_items ? content.align_items : undefined,
    direction: direction ? direction : undefined,
    className: clsx(className, classes.gridRow, (_clsx = {}, _clsx[classes.xsColumnReverse] = content.reverse_on_mobile, _clsx[classes.smColumnReverse] = content.reverse_on_tablet, _clsx)),
    justify: content.justify ? content.justify : undefined,
    alignContent: content.align_content ? content.align_content : undefined
  }, (background === null || background === void 0 ? void 0 : background.image) && React.createElement(BackgroundImage, {
    content: background,
    backgroundStyle: content.background_style
  }), (background === null || background === void 0 ? void 0 : background.background_elements) && background.background_elements.length > 0 && React.createElement(BackgroundElements, {
    elements: background.background_elements
  }), content.body && content.body.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  }));
}

var xsSpanMap = {
  1: 3,
  2: 6,
  3: 9,
  4: 12,
  'false': false,
  'auto': 'auto',
  'true': true
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
  'false': false,
  'auto': 'auto',
  'true': true
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
  'false': false,
  'auto': 'auto',
  'true': true
};
function LmGridColumn(_ref) {
  var content = _ref.content;

  // const classes = useStyles(content)
  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

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

  return React.createElement(Grid, {
    item: true,
    xs: content.width_phone ? xsSpanMap[content.width_phone] : 12,
    sm: smWidth,
    md: mdWidth,
    className: className,
    style: style
  }, (background === null || background === void 0 ? void 0 : background.image) && React.createElement(BackgroundImage, {
    content: background
  }), (background === null || background === void 0 ? void 0 : background.background_elements) && background.background_elements.length > 0 && React.createElement(BackgroundElements, {
    elements: background.background_elements
  }), content.justify || content.align_content || content.align_items ? React.createElement(Grid, {
    container: true,
    direction: 'column',
    className: 'mh-100',
    justify: content.justify ? content.justify : undefined,
    alignItems: content.align_items ? content.align_items : undefined,
    alignContent: content.align_content ? content.align_content : undefined
  }, content.body && content.body.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  })) : content.body && content.body.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  }));
}

var useStyles$5 = /*#__PURE__*/makeStyles(function (theme) {
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

  var content = _ref.content;
  var classes = useStyles$5();
  var winDims = useWindowDimensions();
  var isMobile = winDims.isMobile;

  var _useState = useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1];

  var imageCrop = content.image_crop || [];
  var property = content.property || [];
  var fitInColor = content.color && content.color.rgba || content.fit_in_color;

  var _useInView = useInView(intersectionDefaultOptions),
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
    var width = Math.ceil(parentDim.width || winDims.width);

    if (!definedWidth && !definedHeight || imageCrop.length || fitInColor) {
      // default: set available width to the current width either in crop mode
      definedWidth = definedWidth || parentDim.height / parentDim.width * 100 > 300 ? grandParentDim.width : width;
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

  return React.createElement("figure", {
    ref: refIntersectionObserver,
    className: clsx(classes.root, (_clsx = {}, _clsx[classes.rootNoMargin] = content.disable_ratio_correction, _clsx)),
    style: {
      height: content.height ? content.height + "px" : content.height_fill ? '100%' : undefined,
      width: content.width ? content.width + "px" : content.height_fill ? '100%' : undefined
    }
  }, !loaded && React.createElement(Skeleton, {
    style: {
      position: 'absolute'
    },
    width: '100%',
    height: '100%',
    variant: property.includes('rounded-circle') ? 'circle' : 'rect'
  }), React.createElement(Fade, {
    "in": loaded
  }, !imgProperties.src ? React.createElement("span", null) : React.createElement("img", Object.assign({}, imgProperties, {
    alt: content.alt || 'website image',
    width: content.width ? content.width : undefined,
    height: definedHeight ? definedHeight : undefined,
    style: {
      width: content.width ? content.width + "px" : 'auto',
      maxHeight: 'inherit',
      height: definedHeight ? definedHeight + "px" : 'auto'
    },
    className: clsx(classes.image, content.property, (_content$class_names = content.class_names) === null || _content$class_names === void 0 ? void 0 : _content$class_names.values),
    onLoad: onImageLoaded
  }))));
}

var useStyles$6 = /*#__PURE__*/makeStyles({
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
  var content = _ref.content;
  var classes = useStyles$6();

  var _useInView = useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var src = inView ? content.source : '';

  var _useState = useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1];

  var afterSvgLoaded = function afterSvgLoaded() {
    setLoaded(true);
  };

  var onErrorHandler = function onErrorHandler(error) {
    console.error(error);
  };

  var fitInColor = content.color && content.color.rgba || content.fit_in_color; // legacy fit_in_color

  return React.createElement(Fade, {
    "in": loaded
  }, React.createElement("div", {
    className: classes.root,
    ref: refIntersectionObserver
  }, !!src && React.createElement(InlineSVG, {
    src: src,
    style: {
      color: fitInColor,
      width: content.width && content.width + "px",
      height: content.height && content.height + "px"
    },
    onLoad: afterSvgLoaded,
    onError: onErrorHandler,
    className: clsx(classes.svg, {
      'has-color': !!fitInColor
    })
  })));
}

function LmImage$1(_ref) {
  var content = _ref.content;
  var isSvgImage = content.source && content.source.endsWith('.svg');

  if (isSvgImage) {
    return React.createElement(ImageSvg, {
      content: content
    });
  }

  return React.createElement(LmImage, {
    content: content
  });
}

function LmHtml(_ref) {
  var content = _ref.content;

  var _useInView = useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var htmlContent = useMemo(function () {
    if (content.lazy_load) {
      if (inView) {
        return content.body || '';
      } else {
        return '';
      }
    } else {
      return content.body || '';
    }
  }, [inView, content.lazy_load]);
  return React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: htmlContent
    },
    ref: refIntersectionObserver
  });
}

var useStyles$7 = /*#__PURE__*/makeStyles(function (_ref) {
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
  return React.createElement("div", Object.assign({
    className: clsx(className, 'Indicator-root', 'InvertedIndicator-root', active && '-active', classes.root)
  }, props));
}

function Swipe(props) {
  var currentIndex = props.elements.findIndex(function (i) {
    return i._uid === props.lightbox;
  });

  function getImageSource(source) {
    var dimensionHeight = props.dimensions.height - 68 - 16;
    var dimensionWidth = props.dimensions.width - 48;
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

  return React.createElement("div", {
    className: "carousel slide"
  }, React.createElement(SwipeableViews, {
    index: currentIndex,
    className: "carousel-inner",
    onChangeIndex: handleChangeIndex
  }, props.elements.map(function (item) {
    return React.createElement("div", {
      key: item._uid,
      className: "carousel-item"
    }, React.createElement("figure", {
      className: "d-block"
    }, React.createElement("img", Object.assign({}, getImageSource(item.source), {
      className: 'img-fluid'
    }))));
  })), React.createElement("a", {
    className: "carousel-control-prev",
    role: "button",
    onClick: function onClick() {
      return props.onImageClick(currentIndex === 0 ? props.elements[props.elements.length - 1] : props.elements[currentIndex - 1]);
    }
  }, React.createElement(ChevronLeft, null)), React.createElement("a", {
    className: "carousel-control-next",
    role: "button",
    onClick: function onClick() {
      return props.onImageClick(currentIndex === props.elements.length - 1 ? props.elements[0] : props.elements[currentIndex + 1]);
    }
  }, React.createElement(ChevronRight, null)), React.createElement("ol", {
    className: "carousel-indicators"
  }, props.elements.map(function (item) {
    return React.createElement(InvertedIndicator, {
      key: item._uid,
      active: props.lightbox === item._uid,
      color: 'light',
      onClick: function onClick() {
        return props.onImageClick(item);
      }
    });
  })));
}

function ImageListLightbox(props) {
  return React.createElement(Dialog, {
    fullScreen: true,
    className: props.className,
    onEscapeKeyDown: function onEscapeKeyDown() {
      return props.setLightbox();
    },
    open: !!props.lightbox
  }, React.createElement(DialogTitle, null, React.createElement(IconButton, {
    className: "text-white",
    onClick: function onClick() {
      return props.setLightbox();
    }
  }, React.createElement(Close, null))), Swipe(props));
}

var useGridListStyles = /*#__PURE__*/makeStyles(function (theme) {
  return createStyles({
    gridList: function gridList(props) {
      if (!props.isMasonry) {
        var _MuiGridListTileR;

        var opts = {
          '& .MuiGridListTile-root': (_MuiGridListTileR = {
            width: 100 / Number(props.columnCount || 4) * 1 + "% !important"
          }, _MuiGridListTileR[theme.breakpoints.only('xs')] = {
            width: 100 / Number(props.columnCountPhone || 1) * 1 + "% !important"
          }, _MuiGridListTileR)
        };

        if (props.columnCountTablet) {
          opts[theme.breakpoints.between('sm', 'md')] = {
            '& .MuiGridListTile-root': {
              width: 100 / Number(props.columnCountTablet) * 1 + "% !important"
            }
          };
        }

        return opts;
      } else {
        var _opts2;

        var _opts = (_opts2 = {
          columnCount: Number(props.columnCount || 4)
        }, _opts2[theme.breakpoints.only('xs')] = {
          columnCount: Number(props.columnCountPhone || 2)
        }, _opts2);

        if (props.columnCountTablet) {
          _opts[theme.breakpoints.between('sm', 'md')] = {
            columnCount: Number(props.columnCountTablet)
          };
        }

        return _opts;
      }
    }
  });
});

var useImageListStyles = /*#__PURE__*/makeStyles({
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
    overflowX: 'hidden',
    '&.with-lightbox': {}
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

var internalLinkHandler = function internalLinkHandler(url) {
  if (CONFIG.rootDirectory) {
    var urlArray = url.split('/');

    if (urlArray[0] === CONFIG.rootDirectory) {
      urlArray.shift();
      url = urlArray.join('/');
    }
  } else if (CONFIG.suppressSlugLocale) {
    var _urlArray = url.split('/');

    if (_urlArray.length > 1 && CONFIG.languages.includes(_urlArray[0]) && _urlArray[1] !== 'home') {
      _urlArray.shift();

      url = _urlArray.join('/');
    }
  }

  return url.startsWith('/') ? url : "/" + url;
};
var linkHandler = function linkHandler(link, options) {
  var props = {
    href: '/'
  };
  var cachedUrl = link.cached_url;

  if (!cachedUrl) {
    return {};
  }

  if (link.linktype === 'story') {
    props.href = internalLinkHandler(cachedUrl);
  } else {
    var href = cachedUrl || '';

    if (href.includes('@')) {
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

function LmImageList(_ref) {
  var _clsx;

  var content = _ref.content;
  var classes = useImageListStyles();

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender,
      LinkRender = _useAppContext.LinkRender;

  var gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet,
    isMasonry: !!content.masonry
  });
  var dimensions = useWindowDimensions();
  var containerRef = React.createRef();

  var _useState = useState(''),
      lightbox = _useState[0],
      setLightbox = _useState[1];

  var gutterSize = content.column_gap ? Number(content.column_gap) : 2;

  function onImageClick(element) {
    // open lightbox
    content.enable_lightbox && setLightbox(element._uid);
  }

  var body = content.body || [];
  var gridListProps = {
    spacing: gutterSize // cols: columnCount

  };

  if (content.masonry) {
    gridListProps.spacing = 0;
    delete gridListProps.cols;
    gridListProps.style = {
      // columnCount: columnCount,
      columnGap: gutterSize + "px"
    };
  }

  return React.createElement("div", {
    className: "lm-imagelist__container"
  }, React.createElement("div", {
    ref: containerRef,
    style: {
      padding: gutterSize + 'px'
    },
    className: clsx(classes.root, (_clsx = {}, _clsx[classes.masonry] = content.masonry, _clsx[classes.aspectRatio] = content.aspect_ratio && !content.masonry, _clsx['ratio-' + content.aspect_ratio] = content.aspect_ratio, _clsx['with-lightbox'] = content.enable_lightbox, _clsx))
  }, React.createElement(GridList, Object.assign({
    cellHeight: 'auto',
    className: gridClasses.gridList
  }, gridListProps), body.map(function (item, i) {
    var _item$link;

    var btnProps = ((_item$link = item.link) === null || _item$link === void 0 ? void 0 : _item$link.cached_url) && !content.enable_lightbox ? _extends({}, getLinkAttrs(item.link, {
      openExternal: !!item.open_external
    }), {
      naked: true,
      component: LinkRender
    }) : {};
    return React.createElement(GridListTile, Object.assign({
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
    }), ComponentRender({
      content: item,
      listProps: content
    }));
  }))), lightbox && ImageListLightbox({
    elements: body,
    lightbox: lightbox,
    setLightbox: setLightbox,
    dimensions: dimensions,
    onImageClick: onImageClick,
    className: classes.lightbox
  }));
}

var useStyles$8 = /*#__PURE__*/makeStyles({
  avatar: {
    '&.small': {
      width: 24,
      height: 24
    },
    '&.large': {
      width: 52,
      height: 52
    },
    '.xlarge': {
      width: 64,
      height: 64
    }
  }
});
function LmMuiAvatar(_ref) {
  var _clsx;

  var src = _ref.src,
      size = _ref.size;
  var classes = useStyles$8();

  var _useInView = useInView(intersectionDefaultOptions),
      reference = _useInView[0],
      inView = _useInView[1];

  var _useState = useState({
    src: '',
    srcSet: ''
  }),
      imageAttrs = _useState[0],
      setImageSrc = _useState[1];

  useEffect(function () {
    if (!inView) {
      return;
    }

    var imgAttrs = getImageAttrs({
      originalSource: src,
      width: 128
    });
    setImageSrc(imgAttrs);
  }, [inView]);
  return React.createElement(Avatar, {
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
  'raised': 'contained',
  'outlined': 'outlined',
  'unelevated': 'contained'
};
var mapColor = {
  'dark': 'primary',
  'light': 'default',
  'primary': 'primary',
  'secondary': 'secondary',
  'primary_text': 'inherit',
  'secondary_text': 'inherit'
};
var useStyles$9 = /*#__PURE__*/makeStyles(function (theme) {
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
function LmButton(_ref) {
  var _clsx, _content$link, _content$custom_color4, _content$custom_color5, _content$custom_color6;

  var content = _ref.content;
  var classes = useStyles$9();

  var _useAppContext = useAppContext(),
      LinkRender = _useAppContext.LinkRender;

  var properties = content.properties || [];
  var disableRipple = !!properties.find(function (i) {
    return i === 'disable-ripple';
  });
  var isUnelevated = properties.find(function (i) {
    return i === 'disable-shadow';
  }) || content.variant === 'unelevated';
  var color = content.color ? mapColor[content.color] : undefined;
  var className = clsx(classes.button, content.class_names && content.class_names.values, (_clsx = {
    'lm-default-color': !content.color
  }, _clsx[content.corners] = !!content.corners, _clsx['lm-unelevated'] = isUnelevated, _clsx['lm-outlined'] = content.variant === 'outlined', _clsx[content.size] = !!content.size, _clsx["lm-font-" + content.font] = content.font, _clsx));
  var btnProps = ((_content$link = content.link) === null || _content$link === void 0 ? void 0 : _content$link.cached_url) ? _extends({}, getLinkAttrs(content.link, {
    openExternal: !!content.open_external
  }), {
    naked: true,
    component: LinkRender
  }) : {};

  if (content.variant === 'fab') {
    var _content$custom_color;

    return React.createElement(Fab, Object.assign({
      variant: content.label ? 'extended' : undefined
    }, btnProps, {
      className: className,
      style: {
        backgroundColor: ((_content$custom_color = content.custom_color) === null || _content$custom_color === void 0 ? void 0 : _content$custom_color.rgba) ? content.custom_color.rgba : undefined
      },
      size: mapSize[content.size] || 'medium',
      color: color,
      disableRipple: disableRipple
    }), React.createElement(IconCore, {
      iconName: content.icon && content.icon.name,
      buttonSize: content.size
    }), content.image && React.createElement(LmMuiAvatar, {
      src: content.image,
      size: mapAvatarSize[content.size]
    }), content.label, React.createElement(IconCore, {
      iconName: content.trailing_icon && content.trailing_icon.name,
      buttonSize: content.size
    }));
  }

  if (!content.label) {
    var _content$custom_color2, _content$custom_color3;

    return React.createElement(IconButton, Object.assign({
      color: color
    }, btnProps, {
      size: mapIconButtonSize[content.size] || 'medium',
      disableRipple: disableRipple,
      style: {
        color: ((_content$custom_color2 = content.custom_color) === null || _content$custom_color2 === void 0 ? void 0 : _content$custom_color2.rgba) ? content.custom_color.rgba : undefined,
        borderColor: content.variant === 'outlined' && ((_content$custom_color3 = content.custom_color) === null || _content$custom_color3 === void 0 ? void 0 : _content$custom_color3.rgba) ? content.custom_color.rgba : undefined
      },
      className: className
    }), React.createElement(IconCore, {
      iconName: content.icon && content.icon.name,
      buttonSize: content.size
    }), content.image && React.createElement(LmMuiAvatar, {
      src: content.image,
      size: mapAvatarSize[content.size]
    }));
  }

  return React.createElement(Button, Object.assign({
    size: mapSize[content.size]
  }, btnProps, {
    className: className,
    variant: mapVariant[content.variant],
    disabled: disableRipple,
    color: color,
    style: {
      color: !['raised', 'unelevated'].includes(content.variant || '') && ((_content$custom_color4 = content.custom_color) === null || _content$custom_color4 === void 0 ? void 0 : _content$custom_color4.rgba) ? content.custom_color.rgba : undefined,
      backgroundColor: ['raised', 'unelevated'].includes(content.variant || '') && ((_content$custom_color5 = content.custom_color) === null || _content$custom_color5 === void 0 ? void 0 : _content$custom_color5.rgba) ? content.custom_color.rgba : undefined,
      borderColor: content.variant === 'outlined' && ((_content$custom_color6 = content.custom_color) === null || _content$custom_color6 === void 0 ? void 0 : _content$custom_color6.rgba) ? content.custom_color.rgba : undefined
    },
    startIcon: React.createElement(IconCore, {
      iconName: content.icon && content.icon.name,
      buttonSize: content.size
    }),
    endIcon: React.createElement(IconCore, {
      iconName: content.trailing_icon && content.trailing_icon.name,
      buttonSize: content.size
    })
  }), content.image && React.createElement(LmMuiAvatar, {
    src: content.image,
    size: mapAvatarSize[content.size]
  }), content.label);
}

function LmNavListItem(props) {
  var _content$link;

  var content = _extends({}, props);

  var _useAppContext = useAppContext(),
      LinkRender = _useAppContext.LinkRender;

  var btnProps = ((_content$link = content.link) === null || _content$link === void 0 ? void 0 : _content$link.cached_url) ? _extends({}, getLinkAttrs(content.link, {
    openExternal: !!content.open_external
  }), {
    naked: true,
    component: LinkRender
  }) : {};
  return React.createElement(MuiLink, Object.assign({}, btnProps), content.name);
}

function useDeviceDimensions() {
  var theme = useTheme();
  var isMobile = useMediaQuery(theme.breakpoints.only('xs'));
  return {
    isMobile: isMobile
  };
}

var useStyles$a = /*#__PURE__*/makeStyles({
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
  var classes = useStyles$a();

  var _useDeviceDimensions = useDeviceDimensions(),
      isMobile = _useDeviceDimensions.isMobile;

  var body = content && content.body || [];
  var properties = content.properties || [];
  var header = content.header;

  if (isMobile && content.collapse_on_mobile || content.forceCollapse) {
    return React.createElement(ExpansionPanel, null, React.createElement(ExpansionPanelSummary, {
      expandIcon: content.collapse_icon && content.collapse_icon.name ? React.createElement(IconCore, {
        iconName: content.collapse_icon.name
      }) : React.createElement(ChevronDown, null)
    }, React.createElement(Typography, null, content.header)), React.createElement(ExpansionPanelDetails, null, React.createElement("div", {
      className: clsx('lm-nav-list', content.class_names && content.class_names.values, {
        'lm-nav-list__column': properties.find(function (i) {
          return i === 'flex-column';
        })
      }, classes.root)
    }, body.map(function (blok) {
      return React.createElement(LmNavListItem, Object.assign({}, blok, {
        key: blok._uid
      }));
    }))));
  }

  var navClassNames = clsx(content.style);
  return React.createElement("div", {
    className: clsx('lm-nav-list', content.class_names && content.class_names.values, {
      'lm-nav-list__column': properties.find(function (i) {
        return i === 'flex-column';
      })
    }, classes.root)
  }, header && React.createElement("h4", null, header), React.createElement("nav", {
    className: navClassNames
  }, body.map(function (blok) {
    return React.createElement(LmNavListItem, Object.assign({}, blok, {
      key: blok._uid
    }));
  })));
}

function LmIframe(_ref) {
  var _clsx;

  var content = _ref.content;

  var _useInView = useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var _useState = useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1];

  var urlSrc = useMemo(function () {
    if (inView) {
      return content.url;
    }

    return '';
  }, [inView]);
  var properties = content.property || [];
  var allowed = content.allow || [];
  return React.createElement("div", {
    ref: refIntersectionObserver,
    className: clsx((_clsx = {
      'embed-responsive': !!content.responsive_ratio
    }, _clsx["embed-responsive-" + content.responsive_ratio] = !!content.responsive_ratio, _clsx))
  }, !loaded && React.createElement(Skeleton, {
    style: {
      position: 'absolute'
    },
    width: '100%',
    height: '100%',
    variant: "rect"
  }), React.createElement("iframe", {
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

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  return React.createElement("div", {
    className: "d-flex h-100 lm-slider__container flex-row justify-content-center"
  }, body.map(function (item, i) {
    if (item.component === 'section') {
      var newOpts = _extends({}, item, {
        presetVariant: sectionVariant || 'transparent'
      });

      return ComponentRender({
        content: newOpts,
        i: i
      });
    }

    return React.createElement("div", {
      key: "child_" + item._uid,
      className: "flex-grow-1"
    }, ComponentRender({
      content: item,
      i: i
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

var useStyles$b = /*#__PURE__*/makeStyles({
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

  var _useState = useState(0),
      slide = _useState[0],
      setSlide = _useState[1];

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var _useDeviceDimensions = useDeviceDimensions(),
      isMobile = _useDeviceDimensions.isMobile;

  var classes = useStyles$b();
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
    return 'carousel__' + i;
  }));

  function handleChangeIndex(item) {
    setSlide(body.findIndex(function (i) {
      return i._uid === item._uid;
    }));
  }

  if (content.background_color) {
    styles.backgroundColor = content.background_color && content.background_color.rgba;
  }

  return React.createElement("div", {
    className: carouselClasses,
    style: styles
  }, React.createElement(SwipeableViews, {
    index: slide,
    animateTransitions: !content.disable_transition,
    onChangeIndex: function onChangeIndex(i) {
      return setSlide(i);
    }
  }, wrapInColumns ? body.map(function (child, index) {
    return React.createElement(LmSliderChild, {
      key: "swipeable_" + index,
      body: child,
      sectionVariant: content.section_variant
    });
  }) : body.map(function (item, i) {
    if (item.component === 'section') {
      var newOpts = _extends({}, item, {
        presetVariant: content.section_variant || 'transparent'
      });

      return ComponentRender({
        content: newOpts,
        i: i
      });
    }

    return ComponentRender({
      content: item,
      i: i
    });
  })), React.createElement("a", {
    className: carouselPrevClasses,
    role: "button",
    onClick: function onClick() {
      return setSlide(slide === 0 ? body.length - 1 : slide - 1);
    }
  }, React.createElement(ChevronLeft, null), React.createElement(Typography, {
    variant: 'srOnly'
  }, "Previous")), React.createElement("a", {
    className: carouselNextClasses,
    role: "button",
    onClick: function onClick() {
      return setSlide(slide === body.length - 1 ? 0 : slide + 1);
    }
  }, React.createElement(ChevronRight, null), React.createElement(Typography, {
    variant: 'srOnly'
  }, "Next")), React.createElement("div", {
    className: paginationClasses
  }, body.map(function (item, i) {
    return React.createElement(InvertedIndicator, {
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
  var properties = content.property || [];
  var videoAspect = content.ratioHeight / content.ratioWidth; // let fixedToRatio = content.fixedToRatio

  var _useState = useState(false),
      error = _useState[0],
      setError = _useState[1];

  var className = clsx('react-player');

  if (!content.url) {
    return React.createElement("div", null, "please insert a video URL");
  }

  var muted = properties.includes('muted');
  var playerProps = {
    loop: properties.includes('loop'),
    playing: properties.includes('autoplay'),
    muted: muted,
    controls: properties.includes('controls'),
    playsinline: properties.includes('playsinline'),
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
    vidBgWidth = (windowAspect / videoAspect * 100).toFixed(2) + '%';
  } // cover the available space


  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "videobg-width" + (properties.includes('suppress_mouse_events') ? ' video-no-mouse' : ''),
    style: {
      width: vidBgWidth
    }
  }, React.createElement("div", {
    className: "videobg-aspect",
    style: {
      paddingBottom: (videoAspect * 100).toFixed(2) + "%"
    }
  }, React.createElement("div", {
    className: "videobg-make-height"
  }, React.createElement(ReactPlayer, Object.assign({
    url: content.url,
    className: className,
    width: "100%",
    height: "100%"
  }, playerProps))))), error && content.fallback_image && React.createElement(BackgroundImage, {
    content: {
      image: content.fallback_image,
      _uid: "bg_fallback_" + content._uid,
      component: 'background'
    }
  }));
}

var useStyles$c = /*#__PURE__*/makeStyles({
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
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: '#111'
      /* bg color, if video is not high enough */

    },

    /* horizontally center the video */
    '& .videobg-width': {
      position: 'absolute',
      width: '100%',
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
      //padding-bottom: 56.25%; /* 16:9 ratio this is calculated inside the component */
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
  var content = _ref.content;
  var classes = useStyles$c();

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var dimensions = useWindowDimensions();

  var _useInView = useInView(intersectionDefaultOptions),
      intersectionRef = _useInView[0],
      inView = _useInView[1],
      intersectionElement = _useInView[2];

  var _useState = useState({
    width: 0,
    height: 0
  }),
      containerDimensions = _useState[0],
      setContainerDimensions = _useState[1];

  var hasSrc = !!content.url;
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

  useEffect(function () {
    if (inView) {
      if (!fixedToRatio && intersectionElement) {
        var current = intersectionElement.target;
        setContainerDimensions({
          width: current.clientWidth,
          height: current.clientHeight
        });
      }
    }
  }, [inView, dimensions.width, dimensions.height, content.url, fixedToRatio]);
  return React.createElement("div", {
    className: classes.videoSection,
    style: containerStyle,
    ref: intersectionRef,
    id: content.section_identifier || content._uid
  }, hasSrc && inView && React.createElement(FullscreenVideoBg, Object.assign({}, content, {
    containerDimensions: containerDimensions,
    fixedToRatio: fixedToRatio,
    ratioHeight: ratioHeight,
    ratioWidth: ratioWidth
  })), hasBody && React.createElement("div", null, body.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  })));
}

var useStyles$d = /*#__PURE__*/makeStyles({
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

  var content = _ref.content;
  var classes = useStyles$d();
  return React.createElement("div", {
    className: clsx(content.class_names && content.class_names.values)
  }, React.createElement(IconCore, {
    className: clsx(classes.icon, (_clsx = {}, _clsx[content.size] = !!content.size, _clsx)),
    iconUrl: content.icon_url,
    style: {
      color: content.color && content.color.rgba ? content.color.rgba : undefined
    },
    iconName: content.name && content.name.name
  }));
}

function useInfiniteScroll(collection, perPage) {
  if (perPage === void 0) {
    perPage = 30;
  }

  var _useState = useState(1),
      page = _useState[0],
      setPage = _useState[1];

  var _useInView = useInView({
    triggerOnce: true
  }),
      useRef = _useInView[0],
      inView = _useInView[1];

  var offset = (page - 1) * perPage;
  useEffect(function () {
    if (inView) {
      setPage(page + 1);
    }
  }, [inView]);
  return {
    ref: useRef,
    data: collection.slice(0, offset + perPage),
    hasMore: Math.ceil(collection.length / perPage) > page
  };
}

var useStyles$e = /*#__PURE__*/makeStyles({
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
function LmCardList(_ref) {
  var _clsx;

  var content = _ref.content;

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var body = content.body,
      rest = _objectWithoutPropertiesLoose(content, ["body", "column_gap", "column_count", "column_count_phone", "column_count_tablet"]);

  var classes = useStyles$e(content);
  var gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet
  });
  var gutterSize = content.column_gap ? Number(content.column_gap) : 24;

  var _useInfiniteScroll = useInfiniteScroll(body || []),
      ref = _useInfiniteScroll.ref,
      data = _useInfiniteScroll.data,
      hasMore = _useInfiniteScroll.hasMore;

  var variant = content.variant || [];
  return React.createElement("div", {
    style: {
      padding: gutterSize / 2 + "px"
    },
    className: clsx(classes.cardBase, variant.map(function (i) {
      return 'card__' + i;
    }), (_clsx = {}, _clsx['ratio-' + content.image_ratio] = content.image_ratio, _clsx))
  }, React.createElement(GridList, {
    spacing: gutterSize,
    cellHeight: 'auto',
    style: {
      overflow: 'visible'
    },
    className: gridClasses.gridList
  }, data.map(function (item, i) {
    return React.createElement(GridListTile, {
      key: item.component + "_" + i
    }, ComponentRender({
      content: item,
      options: rest
    }));
  })), React.createElement("div", {
    ref: hasMore ? ref : undefined
  }));
}

function getImagePromise(_ref) {
  var src = _ref.src,
      srcSet = _ref.srcSet;
  return new Promise(function (resolve, reject) {
    getImage({
      src: src,
      srcSet: srcSet,
      onReady: function onReady(src) {
        resolve(src);
      },
      onError: function onError(e) {
        reject(e);
      }
    });
  });
}
function getImage(_ref2) {
  var _ref2$src = _ref2.src,
      src = _ref2$src === void 0 ? '' : _ref2$src,
      _ref2$srcSet = _ref2.srcSet,
      srcSet = _ref2$srcSet === void 0 ? '' : _ref2$srcSet,
      onReady = _ref2.onReady,
      onError = _ref2.onError;
  var img = new Image();
  img.src = src;
  img.srcset = srcSet || src; // img.crossOrigin = 'anonymous'

  img.onload = function () {
    onReady && onReady(img && (img.currentSrc || img.src)); // return current selected source

    img = null; // dispose image element
  };

  img.onerror = function (e) {
    onError && onError(e);
    img = null;
  };
}

var useStyles$f = /*#__PURE__*/makeStyles({
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
  var dimensions = useWindowDimensions();

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var classes = useStyles$f();

  var _useInView = useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1],
      refElement = _useInView[2];

  var width = dimensions.width;
  var height = dimensions.height;
  var elements = content.elements || [];
  var contentHeight = content.height;

  var _useState = useState(),
      layers = _useState[0],
      setLayers = _useState[1];

  var disableLazyLoad = content.disable_lazy_load;
  var styles = {
    height: contentHeight ? contentHeight + "vh" : '50vh'
  }; // let [styles, setStyles] = useState(styles)

  useEffect(function () {
    var processLayers = function processLayers() {
      var items = elements.map(function (item, i) {
        try {
          var containerHeight = height * Number(contentHeight / 100);
          var offset = containerHeight * item.amount * 2;
          var imgHeight = containerHeight + offset;
          var img = getImageAttrs({
            originalSource: item.image,
            width: width,
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
              children: item.children && item.children.length && ComponentRender({
                content: item.children[0],
                i: i
              })
            };
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
      Promise.all(items).then(function (layers) {
        setLayers(layers);
      });
    };

    if (disableLazyLoad) {
      processLayers();
    } else if (inView) {
      refElement && processLayers();
    }
  }, [inView, width, height, elements, contentHeight]);
  var body = content.body || [];
  return React.createElement("div", {
    className: classes.parallax,
    style: styles,
    ref: refIntersectionObserver
  }, React.createElement(ParallaxBanner, {
    disabled: false,
    style: styles,
    layers: layers || []
  }, !layers && React.createElement(Skeleton, {
    style: {
      position: 'absolute'
    },
    width: '100%',
    height: '100%',
    variant: "rect"
  }), React.createElement("div", {
    className: clsx('parallax__content', content.class_names && content.class_names.values)
  }, body.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  }))));
}

var useStyles$g = /*#__PURE__*/makeStyles(function (theme) {
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
  'false': false,
  'auto': 'auto',
  'true': true
};
function LmTabs(_ref) {
  var _clsx;

  var content = _ref.content;
  var theme = useTheme();
  var isMobile = useMediaQuery(theme.breakpoints.down(content.mobile_breakpoint || 'xs'));

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var classes = useStyles$g();

  var _useState = useState(0),
      activeTab = _useState[0],
      setActiveTab = _useState[1];

  var body = content.body || [];
  var orientation = content.vertical_tabs && !isMobile ? 'vertical' : 'horizontal';
  var isVertical = orientation === 'vertical';
  return React.createElement(Grid, {
    container: true,
    direction: 'row',
    className: clsx(classes.tabContainer, (_clsx = {}, _clsx[classes.vertical] = isVertical, _clsx))
  }, React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: isVertical ? content.tabs_width ? widthMap[content.tabs_width] : 'auto' : 12
  }, React.createElement("div", null, React.createElement(MuiTabs, {
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
    return React.createElement(Tab, {
      label: tab.title,
      wrapped: !!content.wrapped,
      icon: tab.icon && tab.icon.name && React.createElement(IconCore, {
        style: {
          fontSize: 24
        },
        className: 'MuiIcon-root',
        iconName: tab.icon.name
      }),
      "aria-controls": "tabpanel-" + iteration,
      key: tab._uid
    });
  })))), React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: isVertical ? content.content_width ? widthMap[content.content_width] : 'auto' : 12
  }, React.createElement("div", null, React.createElement(SwipeableViews, {
    index: activeTab,
    onChangeIndex: function onChangeIndex(i) {
      return setActiveTab(i);
    },
    className: 'lm-slide-content',
    animateHeight: content.dynamic_height || false,
    axis: 'x'
  }, body.map(function (tab) {
    return React.createElement("div", {
      key: "content_" + tab._uid
    }, tab.body && tab.body.map(function (blok, i) {
      return ComponentRender({
        content: blok,
        i: i
      });
    }));
  })))));
}

function LmFlexRow(_ref) {
  var content = _ref.content;
  var body = content.body || [];

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  return React.createElement(Grid, {
    container: true,
    direction: content.column ? 'column' : 'row',
    justify: content.justify ? content.justify : undefined,
    alignItems: content.align_items ? content.align_items : undefined,
    alignContent: content.align_content ? content.align_content : undefined,
    className: clsx(content.class_names && content.class_names.values, {
      'mh-100': content.full_height
    })
  }, body.map(function (item, i) {
    return ComponentRender({
      content: item,
      i: i
    });
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

  var _useAppContext = useAppContext(),
      LinkRender = _useAppContext.LinkRender;

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
        component: LinkRender
      });

      return React.createElement(MuiLink, Object.assign({}, btnProps), content.text);
    }

    return React.createElement("span", {
      className: className
    }, content.text);
  }

  return React.createElement(React.Fragment, null, content.text);
}

var ElementMap = {
  'paragraph': 'p',
  'blockquote': 'blockquote',
  'bullet_list': 'ul',
  'list_item': 'li',
  'ordered_list': 'ol',
  'horizontal_rule': 'hr',
  'hard_break': 'br',
  // 'image': '',
  'code_block': 'code'
};

function RteNode(_ref) {
  var content = _ref.content;
  return React.createElement(content.type === 'heading' ? "h" + (content.attrs.level || '3') : ElementMap[content.type], {}, content.content && content.content.map(function (blok, i) {
    return LmRteContentRenderer(blok, i);
  }));
}

var RteComponents = {
  'heading': RteNode,
  'text': RteNodeText,
  'paragraph': RteNode,
  'blockquote': RteNode,
  'bullet_list': RteNode,
  'list_item': RteNode,
  'ordered_list': RteNode,
  'horizontal_rule': function horizontal_rule() {
    return React.createElement("hr", null);
  },
  'hard_break': RteNode,
  'image': RteNode,
  'code_block': RteNode
};
function LmRteContentRenderer(blok, i) {
  if (typeof RteComponents[blok.type] !== 'undefined') {
    return React.createElement(RteComponents[blok.type], {
      content: blok,
      key: blok.type + "_" + i
    });
  }

  return React.createElement(function () {
    return React.createElement("div", {
      style: {
        color: 'red'
      }
    }, "The component ", blok.type, " ", i, " has not been created yet.");
  }, {
    key: blok.type + "_" + i
  });
}

var useRichTextStyles = /*#__PURE__*/makeStyles(function (theme) {
  return createStyles({
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
  return React.createElement(Typography, {
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

var useStyles$h = /*#__PURE__*/makeStyles({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex'
  }
});
function LmTimeline(_ref) {
  var content = _ref.content;
  var classes = useStyles$h();

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var body = content.body || [];
  return React.createElement("div", {
    className: 'lm-timeline'
  }, React.createElement(Grid, {
    container: true,
    className: classes.container
  }, body.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      iteration: i,
      key: blok._uid,
      i: i
    });
  })));
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

  var _useInView = useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1];

  var iconName = content.icon && content.icon.name;
  var imageSrc = content.image;
  var customSize = content.custom_size && Number(content.custom_size);

  var _useState = useState({}),
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

  useEffect(function () {
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
  return React.createElement(Avatar, Object.assign({
    ref: refIntersectionObserver,
    variant: content.variant || 'circle',
    style: style,
    className: clsx(content.class_names && content.class_names.values)
  }, imageAttrs), content.letter, iconName && React.createElement(IconCore, {
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

  return React.createElement(LmHeadline, {
    content: modifContent
  });
}

function LmMotion(_ref) {
  var content = _ref.content;

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var type = content.type || 'fade';
  var options = {
    triggerOnce: true
  };

  if (content.threshold) {
    options.threshold = Number((Number(content.threshold) / 100).toFixed(2));
  }

  var _useInView = useInView(options),
      viewRef = _useInView[0],
      inView = _useInView[1];

  var transitionProps = {};

  if (content.duration) {
    transitionProps.timeout = Number(content.duration);
  }

  return React.createElement("div", {
    ref: viewRef
  }, {
    'slide': React.createElement(Slide, Object.assign({
      "in": inView
    }, transitionProps, {
      direction: content.slide_direction || 'down'
    }), React.createElement("div", null, (content.body || []).map(function (blok, i) {
      return ComponentRender({
        content: blok,
        i: i
      });
    }))),
    'fade': React.createElement(Fade, Object.assign({
      "in": inView
    }, transitionProps), React.createElement("div", null, (content.body || []).map(function (blok, i) {
      return ComponentRender({
        content: blok,
        i: i
      });
    }))),
    'grow': React.createElement(Grow, Object.assign({
      "in": inView
    }, transitionProps), React.createElement("div", null, (content.body || []).map(function (blok, i) {
      return ComponentRender({
        content: blok,
        i: i
      });
    }))),
    'zoom': React.createElement(Zoom, Object.assign({
      "in": inView
    }, transitionProps), React.createElement("div", null, (content.body || []).map(function (blok, i) {
      return ComponentRender({
        content: blok,
        i: i
      });
    }))),
    'collapse': React.createElement(Collapse, Object.assign({
      "in": inView
    }, transitionProps), React.createElement("div", null, (content.body || []).map(function (blok, i) {
      return ComponentRender({
        content: blok,
        i: i
      });
    })))
  }[type]);
}

var useStyles$i = /*#__PURE__*/makeStyles({
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
  var classes = useStyles$i();
  var theme = useTheme();

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

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

  var maxWidth = theme.defaultContainerWidth;

  if (content.max_width) {
    maxWidth = content.max_width === 'none' ? false : content.max_width;
  } // todo className doubled used


  return React.createElement("div", {
    className: clsx(classes.background, (_clsx = {}, _clsx[classes.dark] = !!content.variant, _clsx), className),
    style: style,
    id: content.section_identifier || content._uid
  }, ((background === null || background === void 0 ? void 0 : background.image) || (background === null || background === void 0 ? void 0 : background.background_elements)) && React.createElement(BackgroundImage, {
    content: background,
    backgroundStyle: content.background_style
  }), (background === null || background === void 0 ? void 0 : background.background_elements) && background.background_elements.length > 0 && React.createElement(BackgroundElements, {
    elements: background.background_elements
  }), React.createElement(Container, {
    style: containerStyles,
    maxWidth: maxWidth,
    className: clsx(className, (_clsx2 = {}, _clsx2[classes.fullHeight] = isFullHeight, _clsx2))
  }, body.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  })));
}

function LmAccordionItem(_ref) {
  var content = _ref.content,
      options = _ref.options,
      setOpen = _ref.setOpen,
      opened = _ref.opened,
      iteration = _ref.iteration;

  var _useState = useState(''),
      isOpen = _useState[0],
      setIsOpen = _useState[1];

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  var handleChange = function handleChange(panel) {
    return function (_, isExpanded) {
      options.restrict_one ? setOpen(isExpanded ? panel : '') : setIsOpen(isExpanded ? panel : '');
    };
  };

  var panelKey = "panel-" + iteration;
  var expanded = options.restrict_one ? opened === panelKey : isOpen === panelKey;
  return React.createElement(ExpansionPanel, {
    square: options.square ? true : false,
    expanded: expanded,
    onChange: handleChange(panelKey)
  }, React.createElement(ExpansionPanelSummary, {
    expandIcon: content.use_plus_icon || options.use_plus ? React.createElement(Plus, null) : React.createElement(ChevronDown, null)
  }, React.createElement(Typography, null, content.title)), React.createElement(ExpansionPanelDetails, null, React.createElement("div", null, (content.body || []).map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  }))));
}

var useStyles$j = /*#__PURE__*/makeStyles(function (theme) {
  return createStyles({
    cardContainer: {
      position: 'relative',
      padding: theme.spacing(1) + "px 0"
    },
    cardDecorator: {
      position: 'absolute',
      width: 0,
      height: 0,
      borderTop: '16px solid transparent',
      borderBottom: '16px solid transparent',
      top: 'calc(50% - 16px)'
    },
    cardDecoratorLeft: {
      left: '100%',
      borderLeft: '16px solid' + theme.palette.grey.A100
    },
    cardDecoratorRight: {
      borderRight: '16px solid' + theme.palette.grey.A100,
      right: '100%'
    }
  });
});

var CardContentContainer = function CardContentContainer(_ref) {
  var content = _ref.content,
      children = _ref.children;

  var _useAppContext = useAppContext(),
      LinkRender = _useAppContext.LinkRender;

  if (content.link) {
    var _content$link;

    var btnProps = ((_content$link = content.link) === null || _content$link === void 0 ? void 0 : _content$link.cached_url) ? _extends({}, getLinkAttrs(content.link, {
      openExternal: !!content.open_external
    }), {
      naked: true,
      component: LinkRender
    }) : {};
    return React.createElement(CardActionArea, Object.assign({}, btnProps), children);
  }

  return React.createElement(React.Fragment, null, children);
};

CardContentContainer.displayName = 'CardContentContainer';
function TimelineRowItem(_ref2) {
  var isLeft = _ref2.isLeft,
      content = _ref2.content;
  var classes = useStyles$j();

  var _useAppContext2 = useAppContext(),
      ComponentRender = _useAppContext2.ComponentRender;

  var body = content.body || [];
  return React.createElement("div", {
    className: classes.cardContainer
  }, React.createElement("div", {
    className: clsx(classes.cardDecorator, isLeft ? classes.cardDecoratorLeft : classes.cardDecoratorRight)
  }), React.createElement(Card, null, React.createElement(CardContentContainer, {
    content: content
  }, (content.title || content.subheader) && React.createElement(CardHeader, {
    title: content.title,
    subheader: content.subheader
  }), body.length > 0 && React.createElement(CardContent, null, body.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  })))));
}

var useStyles$k = /*#__PURE__*/makeStyles(function (theme) {
  return createStyles({
    iconGrid: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    line: {
      position: 'absolute',
      left: 'calc(50% - 1px)',
      width: '2px',
      height: '100%',
      backgroundColor: theme.palette.grey.A100
    },
    iconContainer: {
      zIndex: 0,
      margin: '0 !important'
    }
  });
});
function LmTimelineItem(_ref) {
  var content = _ref.content,
      iteration = _ref.iteration;
  var classes = useStyles$k();
  var theme = useTheme();
  var isMobile = useMediaQuery(theme.breakpoints.only('xs'));

  var _useAppContext = useAppContext(),
      ComponentRender = _useAppContext.ComponentRender;

  return React.createElement(React.Fragment, null, React.createElement(Grid, {
    item: true,
    xs: 8,
    sm: 5
  }, (iteration % 2 === 0 || isMobile) && React.createElement(TimelineRowItem, {
    isLeft: true,
    content: content
  })), React.createElement(Grid, {
    item: true,
    xs: 4,
    sm: 2,
    className: classes.iconGrid
  }, React.createElement("div", {
    className: classes.line
  }), React.createElement("div", {
    className: classes.iconContainer
  }, content.icon && content.icon.map(function (blok, i) {
    return ComponentRender({
      content: blok,
      i: i
    });
  }))), React.createElement(Grid, {
    item: true,
    xs: 5,
    sm: 5,
    style: {
      display: isMobile ? 'none' : undefined
    }
  }, iteration % 2 !== 0 && React.createElement(TimelineRowItem, {
    isLeft: false,
    content: content
  })));
}

function LmImageListItem(props) {
  var content = props.content,
      listProps = props.listProps;

  var _useInView = useInView(intersectionDefaultOptions),
      inViewRef = _useInView[0],
      inView = _useInView[1],
      currentRef = _useInView[2];

  var _useState = useState(false),
      loaded = _useState[0],
      setLoaded = _useState[1]; // const width = listProps.width


  var styles = {};
  var imageProps = {};

  if (inView && content.source && (currentRef === null || currentRef === void 0 ? void 0 : currentRef.target)) {
    // if (listProps.image_crop && !listProps.masonry /*|| (!listProps.masonry && !listProps.fit_in_color)*/) {
    //   height = listProps.height
    // }
    var tile = currentRef.target.closest('.MuiGridListTile-root');
    var width = tile === null || tile === void 0 ? void 0 : tile.clientWidth;
    var height = tile === null || tile === void 0 ? void 0 : tile.clientHeight;

    if (!width) {
      return React.createElement("span", null, "some error with image list item");
    }

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
      width: width ? width : undefined,
      height: height ? height : undefined
    });
  }

  function onLoad() {
    setLoaded(true);
  }

  return React.createElement(React.Fragment, null, !loaded && React.createElement(Skeleton, {
    width: '100%',
    height: '100%',
    style: {
      position: 'absolute'
    },
    variant: "rect"
  }), React.createElement(Fade, {
    "in": loaded
  }, React.createElement("img", Object.assign({}, imageProps, {
    ref: inViewRef,
    style: styles,
    alt: 'image list item',
    onLoad: onLoad
  }))), (content.label || content.sub_title) && React.createElement(GridListTileBar, {
    title: content.label,
    subtitle: content.sub_title,
    titlePosition: listProps.label_position || 'bottom'
  }));
}

var useStyles$l = /*#__PURE__*/makeStyles({
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
  var _clsx;

  var content = _ref.content;
  var classes = useStyles$l();

  var _useInView = useInView(intersectionDefaultOptions),
      refIntersectionObserver = _useInView[0],
      inView = _useInView[1]; // need to define style rather than class name otherwise change in Storybook not detected if ratio changes


  return React.createElement("div", {
    ref: refIntersectionObserver,
    className: clsx(classes.videoContainer, (_clsx = {}, _clsx[classes["ratio" + content.ratio]] = !!content.ratio, _clsx))
  }, inView ? React.createElement(ReactPlayer, {
    style: {
      position: content.ratio ? 'absolute' : undefined,
      top: content.ratio ? 0 : undefined,
      left: content.ratio ? 0 : undefined
    },
    url: content.url,
    volume: content.muted ? 0 : content.volume,
    loop: content.loop,
    muted: content.muted,
    playing: content.playing,
    light: content.light,
    controls: content.controls,
    height: content.ratio ? '100%' : content.height || undefined,
    width: content.ratio ? '100%' : content.width || undefined
  }) : React.createElement(Skeleton, {
    style: {
      position: 'absolute'
    },
    width: '100%',
    height: '100%',
    variant: 'rect'
  }));
}

var cv = /*#__PURE__*/new Date().getTime();
var publicToken = CONFIG.publicToken;
var previewToken = CONFIG.previewToken;

var StoryblokServiceClass = /*#__PURE__*/function () {
  function StoryblokServiceClass() {
    this.devMode = false; // If true it always loads draft

    this.token = process.env.NODE_ENV === 'development' ? previewToken : publicToken;
    this.previewToken = previewToken;
    this.client = new StoryblokClient({
      accessToken: this.token,
      cache: {
        clear: 'auto',
        type: 'memory'
      }
    });
    this.query = {};
  }

  var _proto = StoryblokServiceClass.prototype;

  _proto.setToken = function setToken(token) {
    this.token = token;
    this.client.setToken(token);
  };

  _proto.flushCache = function flushCache() {
    console.log('flush cashed triggered. ENV Vars:', this.previewToken, this.token);
    console.log('current token:', this.client.getToken());
    cv = new Date().getTime();
    this.client.flushCache();
    return true;
  };

  _proto.getCacheVersion = function getCacheVersion() {
    return this.client.cacheVersion;
  };

  _proto.getToken = function getToken() {
    return this.client.getToken();
  };

  _proto.getSearch = function getSearch(slug, params) {
    return this.client.get(slug, _extends({}, params, this.getDefaultParams()));
  };

  _proto.getDefaultParams = function getDefaultParams() {
    var params = {};

    if (!this.devMode) {
      params.cv = cv;
    }

    if (this.getQuery('_storyblok') || this.devMode || typeof window !== 'undefined' && window.storyblok) {
      this.token = this.previewToken;
      this.client.setToken(this.previewToken);
      params.version = 'draft';
    }

    if (typeof window !== 'undefined' && typeof window.StoryblokCacheVersion !== 'undefined') {
      params.cv = window.StoryblokCacheVersion;
    }

    if (this.getQuery('_storyblok_release')) {
      // @ts-ignore
      params.from_release = this.getQuery('_storyblok_release');
    }

    return params;
  };

  _proto.getAll = function getAll(slug, params) {
    if (params === void 0) {
      params = {};
    }

    return this.client.getAll(slug, _extends({}, params, this.getDefaultParams()), 'stories');
  };

  _proto.get = function get(slug, params) {
    if (params === void 0) {
      params = {};
    }

    params = params || {};
    return this.client.get(slug, _extends({}, params, this.getDefaultParams()));
  };

  _proto.setDevMode = function setDevMode() {
    this.devMode = true;
  };

  _proto.initEditor = function initEditor(_ref) {
    var _this = this;

    var page = _ref.page,
        setPage = _ref.setPage,
        settings = _ref.settings,
        setSettings = _ref.setSettings;

    if (window.storyblok) {
      window.storyblok.init({
        accessToken: this.token
      });
      window.storyblok.on(['change'], function () {
        console.log('change::save triggered');
        location.reload();
      });
      window.storyblok.on(['published', 'unpublished'], function () {
        console.log('published triggered');
        fetch(location.protocol + "//" + location.host + "/api/clear-cache").then(function () {
          console.log('flush cashed successful triggered. ENV Vars:', _this.previewToken, _this.token);
          console.log('after flush: current token:', _this.client.getToken());
          location.reload();
        })["catch"](function (e) {
          console.error('error on flush cache:', e);
        });
      });
      window.storyblok.on('input', function (event) {
        // console.log( content, event.story.content)
        // todo if this is still works after rewrite... maybe add one for settings as well..
        var newContent = _extends({}, event.story.content, {
          uuid: event.story.uuid
        });

        if (event.story.content.component === 'page' && event.story.uuid === (page === null || page === void 0 ? void 0 : page.uuid)) {
          console.log('input::input content changed'); // @ts-ignore

          setPage(window.storyblok.addComments(newContent, event.story.id));
        }

        if (event.story.content.component === 'global' && event.story.uuid === (settings === null || settings === void 0 ? void 0 : settings.uuid)) {
          console.log('input::input settings changed'); // @ts-ignore

          setSettings(window.storyblok.addComments(newContent, event.story.id));
        } // if (event.story.content.component === 'static_container') {
        //   const newContainerContent = content.allStaticContent.filter((el:any) => el._uid !== event.story.content._uid)
        //   newContainerContent.push(event.story.content)
        //   console.log('input::input static container changed',newContainerContent)
        //   setContent({
        //     ...content,
        //     allStaticContent: newContainerContent
        //   })
        // }

      });
    }
  };

  _proto.insideVisualComposer = function insideVisualComposer() {
    return !!this.getQuery('_storyblok');
  };

  _proto.setQuery = function setQuery(query) {
    this.query = query;
  };

  _proto.getQuery = function getQuery(param) {
    return this.query[param];
  };

  return StoryblokServiceClass;
}();

var StoryblokService = /*#__PURE__*/new StoryblokServiceClass();

var AppProvider = function AppProvider(_ref) {
  var children = _ref.children,
      content = _ref.content;
  return React.createElement(AppContext.Provider, {
    value: content
  }, children);
};

AppProvider.displayName = 'AppProvider';

var deviceDetect = function deviceDetect(req) {
  var userAgent = req && req.headers['user-agent'];
  var mobileDevice = isMobile({
    ua: userAgent
  });
  var tabletDevice = isMobile({
    ua: userAgent,
    tablet: true
  });
  var obj = {
    width: 1080,
    isTablet: false,
    isMobile: false,
    isDesktop: true
  };

  if (mobileDevice) {
    obj.device = 'mobile';
    obj.width = 599;
    obj.isMobile = true;
    obj.isDesktop = false;
  } else if (tabletDevice) {
    obj.width = 959;
    obj.device = 'tablet';
    obj.isTablet = true;
    obj.isDesktop = false;
  }

  return obj;
};

var WindowDimensionsProvider = function WindowDimensionsProvider(_ref) {
  var children = _ref.children;

  var _useState = useState(defaultWindowsProvider),
      dimensions = _useState[0],
      setDimensions = _useState[1];

  var _useDebouncedCallback = useDebouncedCallback( // function
  function () {
    setDimensions(getWindowDimensions());
  }, // delay in ms
  500),
      debouncedCallback = _useDebouncedCallback[0];

  useEffect(function () {
    if (typeof window === 'undefined') {
      return;
    }

    setDimensions(_extends({}, getWindowDimensions(), deviceDetect()));
    window.addEventListener('resize', debouncedCallback);
    return function () {
      window.removeEventListener('resize', debouncedCallback);
    };
  }, []);

  function getWindowDimensions() {
    var opts = _extends({}, dimensions, {
      height: window.innerHeight,
      width: window.innerWidth,
      isTabletWidth: window.innerWidth >= 600 && window.innerWidth < 960
    });

    return opts;
  }

  return React.createElement(WindowDimensionsCtx.Provider, {
    value: dimensions
  }, children);
};

WindowDimensionsProvider.displayName = 'WindowDimensionsProvider';

var defaultValue$1 = {
  hasDrawer: false,
  hasFeatureImage: false,
  hasRightDrawer: false,
  drawerVariant: 'temporary',
  drawerBelowToolbar: false,
  hasScrollCollapse: false
};
var AppSetupContext = /*#__PURE__*/createContext(defaultValue$1);
var useAppSetup = function useAppSetup() {
  return useContext(AppSetupContext);
};

var AppSetupProvider = function AppSetupProvider(_ref) {
  var _page$right_body;

  var children = _ref.children,
      settings = _ref.settings,
      page = _ref.page;

  var _useWindowDimensions = useWindowDimensions(),
      isMobile = _useWindowDimensions.isMobile;

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
  var value = useMemo(function () {
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
  return React.createElement(AppSetupContext.Provider, {
    value: value
  }, children);
};

AppSetupProvider.displayName = 'AppSetupProvider';

var LmCoreComponentsNamed = {
  'table': LmTable,
  'accordion': LmAccordion,
  'accordion_item': LmAccordionItem,
  'divider': LmDivider,
  'html': LmHtml,
  'button_list': LmButtonList,
  'section': LmSection,
  'headline': LmHeadline,
  'row': LmGridRow,
  'column': LmGridColumn,
  'image': LmImage$1,
  'image_list': LmImageList,
  'image_list_item': LmImageListItem,
  'button': LmButton,
  'nav_list': LmNavList,
  'icon': LmIcon,
  'iframe': LmIframe,
  'slider': LmSlider,
  'section_video_bg': LmSectionVideo,
  'card_list': LmCardList,
  'section_parallax': LmSectionParallax,
  'tabs': LmTabs,
  'flex_row': LmFlexRow,
  'rich_text_editor': LmRichTextParagraph,
  'timeline': LmTimeline,
  'timeline_item': LmTimelineItem,
  'avatar': LmAvatar,
  'date_headline': LmDateHeadline,
  'motion': LmMotion,
  'player': LmPlayer
};
function LmComponentRender(props) {
  var content = props.content,
      i = props.i,
      rest = _objectWithoutPropertiesLoose(props, ["content", "i"]);

  if (typeof LmCoreComponentsNamed[content.component] !== 'undefined') {
    return React.createElement(LmCoreComponentsNamed[content.component], _extends({
      content: content,
      key: typeof i === 'number' ? content.component + "_" + i : undefined
    }, rest));
  }

  return React.createElement("div", {
    style: {
      color: 'red'
    },
    key: (content === null || content === void 0 ? void 0 : content._uid) || "" + i
  }, "The component ", content.component || 'no name found', " has not been created yet.");
}

export { CONFIG, LmAccordion, LmAccordionItem, AppProvider as LmAppProvider, AppSetupProvider as LmAppSetupProvider, LmAvatar, LmButton, LmButtonList, LmCardList, LmComponentRender, LmCoreComponentsNamed, LmDateHeadline, LmDivider, LmFlexRow, LmGridColumn, LmGridRow, LmHeadline, LmHtml, LmIcon, LmIframe, LmImage$1 as LmImage, LmImageList, LmImageListItem, LmMotion, LmNavList, LmPlayer, LmRichTextParagraph, LmSection, LmSectionParallax, LmSectionVideo, LmSlider, StoryblokService as LmStoryblokService, LmTable, LmTabs, LmTimeline, WindowDimensionsProvider as LmWindowDimensionProvider, internalLinkHandler, useAppContext, useAppSetup, useWindowDimensions };
//# sourceMappingURL=lumen-cms-base.esm.js.map
