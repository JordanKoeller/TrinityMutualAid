import React from 'react'

export const ExtLink: React.FC<{ href?: string }> = ({ href, children }) => {
    if (href) {
        if (href.startsWith("http") || !href.toLocaleLowerCase().includes("trinitymutualaid.com")) {
            return <a href={href} target="_blank" rel="noreferrer">{children}</a>
        } else {
            return <a href={href}>{children}</a>
        }
    } else {
        return <>{children}</>
    }

}