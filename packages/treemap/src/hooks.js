/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { useMemo } from 'react'
import { treemap as d3Treemap } from 'd3-hierarchy'
import { useOrdinalColorScale } from '@nivo/colors'

export const useTreeMapLayout = ({ width, height, tile, innerPadding, outerPadding }) => useMemo(
    () => d3Treemap()
        .size([width, height])
        .tile(treeMapTileFromProp(tile))
        .round(true)
        .paddingInner(innerPadding)
        .paddingOuter(outerPadding),
    [width, height, tile, innerPadding, outerPadding]
)

export const useTreeMap = ({
    colors,
    colorBy,
}) => {
    const getColor = useOrdinalColorScale(colors, colorBy)
}