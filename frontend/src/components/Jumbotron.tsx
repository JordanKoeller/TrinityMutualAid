import React from 'react';

import {
  Container,
} from 'react-bootstrap';

export type JumboVariant = 'light' | 'dark';
export type JumboJustify = 'left' | 'center' | 'right';

export const Jumbotron: React.FC<{
  variant?: JumboVariant,
  title?: string,
  justify?: JumboJustify
}> = ({ children, variant = 'light', title, justify = 'center' }) => {
  return <Container fluid bsPrefix={`jumbotron-${variant}`} style={{ textAlign: justify }}>
    <Container fluid="lg">
      {title ? <h1 className="jumbotron-title">{title}</h1> : null}
      {children}
    </Container>
  </Container>
}

export const TitledSection: React.FC<{ title: string }> = ({ title, children }) => {
  return <>
    {title ? <h1 className="jumbotron-title">{title}</h1> : null}
    {children}
  </>
}