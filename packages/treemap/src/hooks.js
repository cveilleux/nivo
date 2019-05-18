/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { useMemo } from 'react'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { treemap as d3Treemap, hierarchy } from 'd3-hierarchy'
import { treeMapTileFromProp, useTheme } from '@nivo/core'
import { useOrdinalColorScale, useInheritedColor } from '@nivo/colors'

export const useTreeMapLayout = ({ width, height, tile, innerPadding, outerPadding }) => useMemo(
    () => d3Treemap()
        .size([width, height])
        .tile(treeMapTileFromProp(tile))
        .round(true)
        .paddingInner(innerPadding)
        .paddingOuter(outerPadding),
    [width, height, tile, innerPadding, outerPadding]
)

export const useHierarchy = ({
    root,
    getValue,
}) => useMemo(
    () => hierarchy(root).sum(getValue),
    [root, getValue]
)

export const useAccessor = accessor => useMemo(
    () => {
        if (typeof accessor === 'function') return accessor
        return d => get(d, accessor)
    },
    [accessor]
)

const computeNodePath = (node, getIdentity) =>
    node
        .ancestors()
        .map(ancestor => getIdentity(ancestor.data))
        .join('.')

export const useTreeMap = ({
    root,
    identity,
    value,
    leavesOnly,
    width,
    height,
    tile,
    innerPadding,
    outerPadding,
    colors,
    colorBy,
    borderColor,
    labelTextColor,
}) => {
    const getIdentity = useAccessor(identity)
    const getValue = useAccessor(value)

    const layout = useTreeMapLayout({
        width,
        height,
        tile,
        innerPadding,
        outerPadding,    
    })

    const theme = useTheme()
    const getColor = useOrdinalColorScale(colors, colorBy)
    const getBorderColor = useInheritedColor(borderColor, theme)
    const getLabelTextColor = useInheritedColor(labelTextColor, theme)

    const hierarchy = useHierarchy({ root, getValue })
    const nodes = useMemo(
        () => {
            const rootCopy = cloneDeep(hierarchy)
            layout(rootCopy)

            const rawNodes = leavesOnly ? rootCopy.leaves() : rootCopy.descendants()

            return rawNodes.map(node => {
                node.path = computeNodePath(node, getIdentity)

                node.nodeHeight = node.height

                node.x = node.x0
                node.y = node.y0
                node.width = node.x1 - node.x0
                node.height = node.y1 - node.y0

                node.data.id = node.id = getIdentity(node.data)
                node.data.color = node.color = getColor({
                    ...node,
                    depth: node.depth
                })
                node.data.value = node.value

                node.style = {
                    borderColor: getBorderColor(node),
                    labelTextColor: getLabelTextColor(node),
                }

                return node
            })
        },
        [hierarchy, layout, leavesOnly, getIdentity, getColor, getBorderColor, getLabelTextColor]
    )

    return {
        root,
        hierarchy,
        nodes,
        layout,
        getColor,
        getBorderColor,
        getLabelTextColor,
    }
}