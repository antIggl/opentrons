// @flow
import assert from 'assert'
import { getModuleState } from '../robotStateSelectors'
import {
  TEMPDECK,
  TEMPERATURE_APPROACHING_TARGET,
  TEMPERATURE_DEACTIVATED,
} from '../../constants'
import type {
  SetTargetTempParams,
  DeactivateTempParams,
} from '@opentrons/shared-data/protocol/flowTypes/schemaV4'
import type { InvariantContext, RobotStateAndWarnings } from '../types'

function _setTemperatureAndStatus(moduleState, temperature, status) {
  if (moduleState.type === TEMPDECK) {
    moduleState.targetTemperature = temperature
    moduleState.status = status
  }
}

export function forSetTemperature(
  params: SetTargetTempParams,
  invariantContext: InvariantContext,
  robotStateAndWarnings: RobotStateAndWarnings
): void {
  const { robotState } = robotStateAndWarnings
  const { module, temperature } = params
  const moduleState = getModuleState(robotState, module)

  _setTemperatureAndStatus(
    moduleState,
    temperature,
    TEMPERATURE_APPROACHING_TARGET
  )
}

export function forDeactivateTemperature(
  params: DeactivateTempParams,
  invariantContext: InvariantContext,
  robotStateAndWarnings: RobotStateAndWarnings
): void {
  const { robotState } = robotStateAndWarnings
  const { module } = params

  const moduleState = getModuleState(robotState, module)
  const temperature = null

  _setTemperatureAndStatus(moduleState, temperature, TEMPERATURE_DEACTIVATED)
}
