import * as Dgram from 'dgram'

export const formatAddress = (rinfo: Dgram.RemoteInfo) => {
  return `${rinfo.address}:${rinfo.port}`
}