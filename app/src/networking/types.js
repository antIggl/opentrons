// @flow

import type { RobotApiRequestMeta } from '../robot-api/types'

export type InternetStatus = 'none' | 'portal' | 'limited' | 'full' | 'unknown'

export type WifiSecurityType = 'none' | 'wpa-psk' | 'wpa-eap'

// TODO(mc, 2019-11-5): this does not match the response shape
// the shape change happens in the selector, but should be happening
// in the reducer. THis will be fixed when http-api-client is gone
export type NetworkInterface = {|
  ipAddress: ?string,
  subnetMask: ?string,
  macAddress: string,
  gatewayAddress: ?string,
  state: 'connected' | 'connecting' | 'disconnected',
  type: 'wifi' | 'ethernet',
|}

export type WifiNetwork = {
  ssid: string,
  signal: number,
  active: boolean,
  security: string,
  securityType: WifiSecurityType,
}

export type WifiNetworkList = Array<WifiNetwork>

export type WifiListResponse = { list: WifiNetworkList }

export type NetworkingStatusResponse = {
  status: InternetStatus,
  interfaces: { [device: string]: NetworkInterface },
}

export type WifiAuthField = {
  name: string,
  displayName: string,
  required: boolean,
  type: 'string' | 'password' | 'file',
}

export type WifiEapOption = {
  name: string,
  // API <= 3.4.0 does not include displayName in response
  displayName?: string,
  options: Array<WifiAuthField>,
}

export type WifiEapOptionsList = Array<WifiEapOption>

export type WifiEapOptionsResponse = {
  options: WifiEapOptionsList,
}

export type WifiKey = {
  id: string,
  uri: string,
  name: string,
}

export type WifiKeysList = Array<WifiKey>

export type WifiKeysRequest = ?{ key: string }

export type WifiKeysResponse = { keys: WifiKeysList }

export type WifiConfigureRequest = {
  ssid: string,
  psk?: string,
  securityType?: WifiSecurityType,
  hidden?: boolean,
  eapConfig?: {
    method: string,
    [eapOption: string]: string,
  },
}

export type WifiConfigureResponse = {
  ssid: string,
  message: string,
}

// action types

// fetch status

export type FetchStatusAction = {|
  type: 'networking:FETCH_STATUS',
  payload: {| robotName: string |},
  meta: RobotApiRequestMeta,
|}

export type FetchStatusSuccessAction = {|
  type: 'networking:FETCH_STATUS_SUCCESS',
  payload: {| robotName: string, networkStatus: NetworkingStatusResponse |},
  meta: RobotApiRequestMeta,
|}

export type FetchStatusFailureAction = {|
  type: 'networking:FETCH_STATUS_FAILURE',
  payload: {| robotName: string, error: {} |},
  meta: RobotApiRequestMeta,
|}

// fetch wifi list

export type FetchWifiListAction = {|
  type: 'networking:FETCH_WIFI_LIST',
  payload: {| robotName: string |},
  meta: RobotApiRequestMeta,
|}

export type FetchWifiListSuccessAction = {|
  type: 'networking:FETCH_WIFI_LIST_SUCCESS',
  payload: {| robotName: string, networkList: WifiListResponse |},
  meta: RobotApiRequestMeta,
|}

export type FetchWifiListFailureAction = {|
  type: 'networking:FETCH_WIFI_LIST_FAILURE',
  payload: {| robotName: string, error: {} |},
  meta: RobotApiRequestMeta,
|}

// fetch wifi eap options

export type FetchWifiEapOptionsAction = {|
  type: 'networking:FETCH_WIFI_EAP_OPTIONS',
  payload: {| robotName: string |},
  meta: RobotApiRequestMeta,
|}

export type FetchWifiEapOptionsSuccessAction = {|
  type: 'networking:FETCH_WIFI_EAP_OPTIONS_SUCCESS',
  payload: {| robotName: string, eapOptions: WifiEapOptionsResponse |},
  meta: RobotApiRequestMeta,
|}

export type FetchWifiEapOptionsFailureAction = {|
  type: 'networking:FETCH_WIFI_EAP_OPTIONS_FAILURE',
  payload: {| robotName: string, error: {} |},
  meta: RobotApiRequestMeta,
|}

// fetch wifi keys

export type FetchWifiKeysAction = {|
  type: 'networking:FETCH_WIFI_KEYS',
  payload: {| robotName: string |},
  meta: RobotApiRequestMeta,
|}

export type FetchWifiKeysSuccessAction = {|
  type: 'networking:FETCH_WIFI_KEYS_SUCCESS',
  payload: {| robotName: string, wifiKeys: WifiKeysResponse |},
  meta: RobotApiRequestMeta,
|}

export type FetchWifiKeysFailureAction = {|
  type: 'networking:FETCH_WIFI_KEYS_FAILURE',
  payload: {| robotName: string, error: {} |},
  meta: RobotApiRequestMeta,
|}

// add wifi key

export type AddWifiKeysAction = {|
  type: 'networking:WIFI_KEYS',
  payload: {| robotName: string, key: WifiKeysRequest |},
  meta: RobotApiRequestMeta,
|}

export type AddWifiKeysSuccessAction = {|
  type: 'networking:WIFI_KEYS_SUCCESS',
  payload: {| robotName: string, key: WifiKey |},
  meta: RobotApiRequestMeta,
|}

export type AddWifiKeysFailureAction = {|
  type: 'networking:WIFI_KEYS_FAILURE',
  payload: {| robotName: string, error: {} |},
  meta: RobotApiRequestMeta,
|}

// delete wifi key
// ????

// configure

export type ConfigureWifiAction = {|
  type: 'networking:WIFI_CONFIGURE',
  payload: {| robotName: string, config: WifiConfigureRequest |},
  meta: RobotApiRequestMeta,
|}

export type ConfigureWifiSuccessAction = {|
  type: 'networking:WIFI_CONFIGURE_SUCCESS',
  payload: {| robotName: string, response: WifiConfigureResponse |},
  meta: RobotApiRequestMeta,
|}

export type ConfigureWifiFailureAction = {|
  type: 'networking:WIFI_CONFIGURE_FAILURE',
  payload: {| robotName: string, error: {} |},
  meta: RobotApiRequestMeta,
|}

// networking action unions

export type FetchStatusDoneAction =
  | FetchStatusFailureAction
  | FetchStatusSuccessAction

export type FetchWifiListDoneAction =
  | FetchWifiListSuccessAction
  | FetchWifiListFailureAction

export type FetchWifiEapOptionsDoneAction =
  | FetchWifiEapOptionsSuccessAction
  | FetchWifiEapOptionsFailureAction

export type FetchWifiKeysDoneAction =
  | FetchWifiKeysSuccessAction
  | FetchWifiKeysFailureAction

export type AddWifiKeysDoneAction =
  | AddWifiKeysSuccessAction
  | AddWifiKeysFailureAction

export type ConfigureWifiDoneAction =
  | ConfigureWifiSuccessAction
  | ConfigureWifiFailureAction

export type NetworkingAction =
  | FetchStatusDoneAction
  | FetchStatusAction
  | FetchWifiListDoneAction
  | FetchWifiListAction
  | FetchWifiEapOptionsDoneAction
  | FetchWifiEapOptionsAction
  | FetchWifiKeysDoneAction
  | FetchWifiKeysAction
  | AddWifiKeysDoneAction
  | AddWifiKeysFailureAction
  | ConfigureWifiDoneAction
  | ConfigureWifiFailureAction
