declare module 'react-pageflip' {
  import type { ComponentType, ReactNode, Ref } from 'react'

  type HTMLFlipBookProps = {
    children?: ReactNode
    className?: string
    style?: React.CSSProperties
    width: number
    height: number
    size?: 'fixed' | 'stretch'
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    drawShadow?: boolean
    flippingTime?: number
    usePortrait?: boolean
    startPage?: number
    showCover?: boolean
    mobileScrollSupport?: boolean
    maxShadowOpacity?: number
    autoSize?: boolean
    clickEventForward?: boolean
    useMouseEvents?: boolean
    swipeDistance?: number
    showPageCorners?: boolean
    disableFlipByClick?: boolean
    onFlip?: (e: { data: number }) => void
    onChangeOrientation?: (e: { data: string }) => void
    onChangeState?: (e: { data: string }) => void
    ref?: Ref<unknown>
  }

  const HTMLFlipBook: ComponentType<HTMLFlipBookProps>
  export default HTMLFlipBook
}
