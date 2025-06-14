import React from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'

const MarkdownEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Enter markdown text...',
  height = 200,
  className = '',
  ...props 
}) => {
  const handleChange = (val) => {
    if (onChange) {
      onChange(val || '')
    }
  }

  return (
    <div className={`markdown-editor-wrapper ${className}`}>
      <MDEditor
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        height={height}
        preview="edit"
        hideToolbar={false}
        data-color-mode="light"
        {...props}
      />
    </div>
  )
}

export default MarkdownEditor