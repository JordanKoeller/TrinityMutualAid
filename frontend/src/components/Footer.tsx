import React from 'react';

import {
  Container,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { MediaQuery, useMediaQuery } from '../utilities/hooks';

export const Footer: React.FC = () => {

  const mq = useMediaQuery();
  return <Container fluid bsPrefix="footer" >
      <div id="socials-bar">
        <span>
        <a href="https://www.instagram.com/trinitymutualaid" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faInstagram} size={mq > MediaQuery.MD ? "3x" : "2x"} className="socials-link" />
        </a>
        </span>
        <span>
        <a href="https://twitter.com/trinmutualaid" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faTwitter} size={mq > MediaQuery.MD ? "3x" : "2x"} className="socials-link"/>
        </a>
        </span>
        <span>
        <a href="https://www.facebook.com/trinity.mutualaid" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faFacebook} size={mq > MediaQuery.MD ? "3x" : "2x"} className="socials-link"/>
        </a>
        </span>
      </div>
      <div>
      &copy; <em id="date"></em>{new Date().getFullYear()} | Trinity Mutual Aid
      <br />
       Trinity Mutual Aid is unaffiliated with Trinity University
      </div>
  </Container>;
}