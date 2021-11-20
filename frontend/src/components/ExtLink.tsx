import React from 'react'

export const ExtLink: React.FC<{href?: string}> = ({href, children}) => href ? 
<a href={href} target="_blank" rel="noreferrer">{children}</a> : <>{children}</>;