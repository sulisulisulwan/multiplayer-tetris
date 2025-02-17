export const findDataInElementOrParent = (domElement: HTMLElement, dataName: string): string => {
  if (!domElement) {
    return null
  }

  if (domElement.hasAttribute('data-' + dataName)) {
    return domElement.getAttribute('data-' + dataName)
  }

  return findDataInElementOrParent(domElement.parentElement, dataName)
}