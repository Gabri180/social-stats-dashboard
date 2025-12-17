// Type declarations for React modules when @types packages aren't available
declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type ComponentType<P = {}> = any;
  export function createElement(
    type: any,
    props?: any,
    ...children: any[]
  ): any;
  export const Fragment: any;
  export default any;
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: any): void;
    unmount(): void;
  }
  
  export function createRoot(container: Element | DocumentFragment): Root;
  export function hydrateRoot(
    container: Element | DocumentFragment,
    initialChildren: any
  ): Root;
}

