/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo } from 'react'
import { TransitionMotion, spring } from 'react-motion'
import { withContainer, SvgWrapper, useDimensions, useTheme, useMotionConfig } from '@nivo/core'
import { interpolateColor, getInterpolatedColor } from '@nivo/colors'
import { useTooltip } from '@nivo/tooltip'
import { TreeMapPropTypes, TreeMapDefaultProps } from './props'
import { nodeWillEnter, nodeWillLeave } from './motion'
import { getNodeHandlers } from './interactivity'
import { useTreeMap } from './hooks'

const TreeMap = ({
    width,
    height,
    margin: partialMargin,

    root,
    identity,
    value,
    nodeComponent,

    tile,
    innerPadding,
    outerPadding,
    leavesOnly,

    colors,
    colorBy,
    borderWidth,
    borderColor,
    defs,

    labelTextColor,
    orientLabel,

    isInteractive,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onClick,
    tooltipFormat,
    tooltip,
}) => {
    const theme = useTheme()
    const { margin, innerWidth, innerHeight, outerWidth, outerHeight } = useDimensions(
        width,
        height,
        partialMargin
    )
    const { animate, springConfig } = useMotionConfig()
    const { showTooltipFromEvent, hideTooltip } = useTooltip()

    const { nodes } = useTreeMap({
        root,
        identity,
        value,
        width: innerWidth,
        height: innerHeight,
        tile,
        innerPadding,
        outerPadding,
        leavesOnly,
        colors,
        colorBy,
        borderColor,
        labelTextColor,
    })

    const getHandlers = node =>
        getNodeHandlers(node, {
            isInteractive,
            onClick,
            showTooltip: showTooltipFromEvent,
            hideTooltip,
            theme,
            tooltipFormat,
            tooltip,
        })

    return (
        <SvgWrapper
            width={outerWidth}
            height={outerHeight}
            margin={margin}
            defs={defs}
            theme={theme}
        >
            {!animate && (
                <>
                    {nodes.map(node =>
                        React.createElement(nodeComponent, {
                            key: node.path,
                            node,
                            style: {
                                fill: node.fill,
                                x: node.x0,
                                y: node.y0,
                                width: node.width,
                                height: node.height,
                                color: node.color,
                                borderWidth,
                                borderColor: node.style.borderColor,
                                labelTextColor: node.style.labelTextColor,
                                orientLabel,
                            },
                            handlers: getHandlers(node),
                        })
                    )}
                </>
            )}
            {animate && (
                <TransitionMotion
                    willEnter={nodeWillEnter}
                    willLeave={nodeWillLeave(springConfig)}
                    styles={nodes.map(node => ({
                        key: node.path,
                        data: node,
                        style: {
                            x: spring(node.x, springConfig),
                            y: spring(node.y, springConfig),
                            width: spring(node.width, springConfig),
                            height: spring(node.height, springConfig),
                            ...interpolateColor(node.color, springConfig),
                        },
                    }))}
                >
                    {interpolatedStyles => (
                        <>
                            {interpolatedStyles.map(({ style, data: node }) => {
                                style.color = getInterpolatedColor(style)

                                return React.createElement(nodeComponent, {
                                    key: node.path,
                                    node,
                                    style: {
                                        ...style,
                                        fill: node.fill,
                                        borderWidth,
                                        borderColor: node.style.borderColor,
                                        labelTextColor: node.style.labelTextColor,
                                        orientLabel,
                                    },
                                    handlers: getHandlers(node),
                                })
                            })}
                        </>
                    )}
                </TransitionMotion>
            )}
        </SvgWrapper>
    )
}

TreeMap.propTypes = TreeMapPropTypes
TreeMap.defaultProps = TreeMapDefaultProps

export default memo(withContainer(TreeMap))
