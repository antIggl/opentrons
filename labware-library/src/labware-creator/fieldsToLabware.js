// @flow
import {
  createRegularLabware,
  //   createIrregularLabware,
  type LabwareDefinition2,
} from '@opentrons/shared-data'
import { DISPLAY_VOLUME_UNITS, type ProcessedLabwareFields } from './fields'

// TODO Ian 2019-07-29: move this constant to shared-data?
// This is the distance from channel 1 to channel 8 of any 8-channel, not tied to name/model
export const MULTI_CHANNEL_WIDTH_MM = 64

export function fieldsToLabware(
  fields: ProcessedLabwareFields
): LabwareDefinition2 {
  // NOTE Ian 2019-07-27: only the 15-50-esque tube rack has multiple grids,
  // and it is not supported in labware creator. So all are regular.
  const isRegularLabware = true
  const { displayName } = fields
  const displayCategory = fields.labwareType

  if (isRegularLabware) {
    const totalLiquidVolume = fields.wellVolume
    const commonWellProperties = {
      depth: fields.wellDepth,
      totalLiquidVolume,
    }
    const wellProperties =
      fields.wellShape === 'circular'
        ? {
            ...commonWellProperties,
            shape: 'circular',
            diameter: fields.wellDiameter,
          }
        : {
            ...commonWellProperties,
            shape: 'rectangular',
            xDimension: fields.wellXDimension,
            yDimension: fields.wellYDimension,
          }

    // NOTE Ian 2019-07-29: Cannot use fields.labwareType, must be "96Standard", "384Standard", "trough", "irregular", or "trash".
    // Also note that 'irregular' in `format` just means "not 96/384 standard, not trough, and not trash",
    // it doesn't imply anything about having multiple grids or not.
    let format = 'irregular'
    let quirks = []

    const heightOrDiameter =
      fields.wellShape === 'circular'
        ? fields.wellDiameter
        : fields.wellYDimension
    if (fields.gridRows === 1 && heightOrDiameter >= MULTI_CHANNEL_WIDTH_MM) {
      quirks = [...quirks, 'centerMultichannelOnWells', 'touchTipDisabled']

      // Legacy API (v1) uses `lw_format == 'trough'` instead of centerMultichannelOnWells quirk.
      // HOWEVER, setting format to 'trough' also makes the well size zero, so you can't
      // position the tip to the edges of the labware.
      // Optimizing for the APIv1 labware test protocol (which is always with a single-channel)
      // over APIv1 protocol use, we'll AVOID setting the format to 'trough' here
      //
      // format = 'trough' // Uncomment to break test protocol but allow multichannel use in APIv1
    }

    const brand = {
      brand: fields.brand,
      brandId: fields.brandId,
      //   links: []
    }

    const def = createRegularLabware({
      strict: false,
      metadata: {
        displayName,
        displayCategory,
        displayVolumeUnits: DISPLAY_VOLUME_UNITS,
        tags: [], // specifying tags is not yet supported
      },
      parameters: {
        format,
        quirks,

        isTiprack: fields.labwareType === 'tiprack', // NOTE: 'tiprack' is not a possible labwareType now anyway
        //   tipLength?: number,

        // Currently, assume labware is not magnetic module compatible. We don't have the information here.
        isMagneticModuleCompatible: false,
        //   magneticModuleEngageHeight?: number,
      },
      dimensions: {
        xDimension: fields.footprintXDimension,
        yDimension: fields.footprintYDimension,
        zDimension: fields.labwareZDimension,
      },
      brand,
      version: 1,
      offset: {
        x: fields.gridOffsetX,
        y: fields.gridOffsetY,
        // NOTE: must give wells a z offset b/c `well.z = offset.z - wellDepth`.
        // We include well lip as part of Z dimension in Labware Creator's fields,
        // so labware's offset.z is the SAME as labwareZDimension.
        z: fields.labwareZDimension,
      },
      grid: {
        column: fields.gridColumns,
        row: fields.gridRows,
      },
      spacing: {
        column: fields.gridSpacingX,
        row: fields.gridSpacingY,
      },
      well: wellProperties,
      group: {
        metadata: {
          displayName,
          displayCategory,
          wellBottomShape: fields.wellBottomShape,
        },
        brand,
      },
    })

    // overwrite loadName from createRegularLabware with ours
    def.parameters.loadName = fields.loadName

    return def
  } else {
    throw new Error('use of createIrregularLabware not yet implemented')
    // return createIrregularLabware({ TODO })
  }
}
