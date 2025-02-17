import * as React from 'react'
import InviteModal from './InviteModal'
import WarningBeforeContinueModal from './WarningBeforeContinueModal'
import ContextMenuModal from './ContextMenuModal'

const modalFactory = (modalType: string, propsToInherit: Record<string, any>) => {
  const modalComponent = modalTypeMap[modalType]
  const modalComponentToRender = modalComponent(propsToInherit)
  return modalComponentToRender
}

const modalTypeMap: Record<string, React.FC> = {
  'invite': InviteModal,
  'contextMenu': ContextMenuModal,
  'warningBeforeContinue': WarningBeforeContinueModal,
}

export default modalFactory