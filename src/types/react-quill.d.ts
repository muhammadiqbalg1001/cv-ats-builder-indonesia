declare module 'react-quill' {
  import * as React from 'react';
  
  export interface ReactQuillProps {
    theme?: string;
    value?: string;
    onChange?: (value: string) => void;
    modules?: any;
    formats?: string[];
    bounds?: string | HTMLElement;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
  }

  const ReactQuill: React.ComponentType<ReactQuillProps>;
  export default ReactQuill;
}