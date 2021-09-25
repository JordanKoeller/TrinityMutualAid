import React from 'react';

import {
  Container, Row
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

export const Footer: React.FC = () => {
  const pad = '2em';
  return <Container fluid="lg">
    <Row></Row>
    <Row>
      <div>
        <span style={{paddingLeft: pad, paddingRight: pad}}>
        <a href="https://www.instagram.com/trinitymutualaid" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="2x" color="#D49464" />
        </a>
        </span>
        <span style={{paddingLeft: pad, paddingRight: pad}}>
        <a href="https://twitter.com/trinmutualaid" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faFacebook} size="2x" color="#D49464"/>
        </a>
        </span>
        <span style={{paddingLeft: pad, paddingRight: pad}}>
        <a href="https://www.facebook.com/trinity.mutualaid" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faTwitter} size="2x" color="#D49464"/>
        </a>
        </span>
      </div>
    </Row>
    <Row style={{paddingTop: '1em', paddingBottom: '2em'}}>
      <div className="footer-credits">
        Created by Jordan Koeller.
        <br />
        Source code released under MIT License.
      </div>
    </Row>
    <Row></Row>
  </Container>;
}