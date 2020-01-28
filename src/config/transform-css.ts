import * as CSS from 'csstype';

import { IConfig } from '../types';

type TCssConfig = Omit<IConfig, 'themes' | 'breakpoints'>;
type CSSProperty = keyof CSS.StandardShorthandProperties | keyof CSS.StandardPropertiesHyphen;

const classes: {
  [key in keyof TCssConfig]: CSSProperty[];
} = {
  space: [
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
  ],
  colors: ['color', 'background-color'],
  sizes: ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height'],
  borderStyles: ['border-style', 'border-bottom-style', 'border-top-style', 'border-left-style', 'border-right-style'],
  borderWidths: ['border-width', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
  borderColors: ['border-color', 'border-bottom-color', 'border-top-color', 'border-left-color', 'border-right-color'],
  radii: [
    'border-radius',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
  ],
  fontSizes: ['font-size'],
  fontWeights: ['font-weight'],
  fonts: ['font-family'],
  letterSpacings: ['letter-spacing'],
  lineHeights: ['line-height'],
  shadows: ['box-shadow', 'text-shadow'],
  transitions: ['transition'],
  zIndices: ['z-index'],
};

export interface ITheme {
  name: string;
  variable: string;
  value: string;
  originValue: string;
}

export interface ICssClasses {
  [name: string]: {
    theme?: ITheme;
    css: string;
  };
}

function getTheme(name: string, mainKey: keyof IConfig, valueKey: string, config: IConfig): ITheme {
  const themes = config.themes || {};
  return Object.keys(themes).reduce((aggr, themeKey) => {
    if (aggr) {
      return aggr;
    }
    if (themes[themeKey][mainKey] && (themes[themeKey][mainKey] as any)[valueKey]) {
      return {
        name: themeKey,
        variable: name,
        value: (themes[themeKey][mainKey] as any)[valueKey],
        originValue: (config[mainKey] as any)[valueKey],
      };
    }

    return aggr;
  }, undefined as any);
}

function buildClassesFromObject(
  mainKey: keyof IConfig,
  cssProperty: string,
  values: { [key: string]: string },
  config: IConfig,
) {
  return Object.keys(values).reduce((aggr, key) => {
    const name = `${cssProperty}-${key}`;
    const theme = getTheme(name, mainKey, key, config);

    aggr[name] = {
      theme,
      css: `{${cssProperty}:${theme ? `var(--${theme.variable})` : values[key]};}`,
    };

    return aggr;
  }, {} as ICssClasses);
}

function getClasses(key: keyof TCssConfig, config: IConfig) {
  return classes[key].reduce((allAggr, cssProperty) => {
    const values = typeof config[key] === 'function' ? (config[key] as any)(config) : config[key];

    return {
      ...allAggr,
      ...buildClassesFromObject(key, cssProperty, values, config),
    };
  }, {} as ICssClasses);
}

export const transform = (config: IConfig) => {
  const cssClasses: ICssClasses = {};

  Object.assign(cssClasses, getClasses('space', config));
  Object.assign(cssClasses, getClasses('colors', config));
  Object.assign(cssClasses, getClasses('sizes', config));
  Object.assign(cssClasses, getClasses('borderStyles', config));
  Object.assign(cssClasses, getClasses('borderWidths', config));
  Object.assign(cssClasses, getClasses('borderColors', config));
  Object.assign(cssClasses, getClasses('radii', config));
  Object.assign(cssClasses, getClasses('fontSizes', config));
  Object.assign(cssClasses, getClasses('fontWeights', config));
  Object.assign(cssClasses, getClasses('fonts', config));
  Object.assign(cssClasses, getClasses('letterSpacings', config));
  Object.assign(cssClasses, getClasses('lineHeights', config));
  Object.assign(cssClasses, getClasses('shadows', config));
  Object.assign(cssClasses, getClasses('transitions', config));
  Object.assign(cssClasses, getClasses('zIndices', config));

  return cssClasses;
};
