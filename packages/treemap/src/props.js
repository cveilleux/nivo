/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import PropTypes from 'prop-types'
import { noop, treeMapTilePropType, defsPropTypes, motionPropTypes } from '@nivo/core'
import {
    ordinalColorsPropType,
    colorPropertyAccessorPropType,
    inheritedColorPropType,
} from '@nivo/colors'
import TreeMapNode from './TreeMapNode'
import TreeMapHtmlNode from './TreeMapHtmlNode'

const commonPropTypes = {
    identity: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    valueFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    leavesOnly: PropTypes.bool.isRequired,
    tile: treeMapTilePropType.isRequired,
    innerPadding: PropTypes.number.isRequired,
    outerPadding: PropTypes.number.isRequired,

    layers: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.oneOf(['nodes']),
            PropTypes.func,
        ])
    ).isRequired,

    colors: ordinalColorsPropType.isRequired,
    colorBy: colorPropertyAccessorPropType.isRequired,
    borderWidth: PropTypes.number.isRequired,
    activeBorderWidth: PropTypes.number.isRequired,
    inactiveBorderWidth: PropTypes.number.isRequired,
    borderColor: inheritedColorPropType.isRequired,

    enableLabel: PropTypes.bool.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    labelFormat: PropTypes.string,
    labelSkipSize: PropTypes.number.isRequired,
    labelTextColor: inheritedColorPropType.isRequired,
    orientLabel: PropTypes.bool.isRequired,

    isInteractive: PropTypes.bool.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    tooltip: PropTypes.func,
}

export const TreeMapPropTypes = {
    ...commonPropTypes,
    nodeComponent: PropTypes.func.isRequired,
    ...defsPropTypes,
    ...motionPropTypes,
}

export const TreeMapHtmlPropTypes = {
    ...commonPropTypes,
    nodeComponent: PropTypes.func.isRequired,
    ...motionPropTypes,
}

export const TreeMapCanvasPropTypes = {
    ...commonPropTypes,
    pixelRatio: PropTypes.number.isRequired,
}

const commonDefaultProps = {
    identity: 'id',
    value: 'value',

    leavesOnly: false,
    tile: 'squarify',
    innerPadding: 0,
    outerPadding: 0,

    layers: ['nodes'],

    colors: { scheme: 'nivo' },
    colorBy: 'depth',
    borderWidth: 0,
    activeBorderWidth: 1,
    inactiveBorderWidth: 0,
    borderColor: { from: 'color' },

    enableLabel: true,
    label: 'id',
    labelSkipSize: 0,
    labelTextColor: { from: 'color', modifiers: [['darker', 1]] },
    orientLabel: true,

    isInteractive: true,
    onClick: noop,
}

export const TreeMapDefaultProps = {
    ...commonDefaultProps,
    nodeComponent: TreeMapNode,
    defs: [],
    fill: [],
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
}

export const TreeMapHtmlDefaultProps = {
    ...commonDefaultProps,
    nodeComponent: TreeMapHtmlNode,
    animate: true,
    motionStiffness: 90,
    motionDamping: 15,
}

export const TreeMapCanvasDefaultProps = {
    ...commonDefaultProps,
    pixelRatio:
        global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1,
}
