import React from 'react';
import { Jumbotron } from '../components/Jumbotron';

const AboutPage: React.FC = () => {
  return <div>
    <Jumbotron variant="light" title="Redistributing Wealth">
      <p>
        Trinity Mutual Aid is a student-run organization (unaffiliated with Trinity University) that
        focuses on redistributing wealth within the San Antonio community. Our organization provides
        aid to those in need of financial assistance with medical expenses, housing expenses, and food
        insecurity. We do so in hopes of strengthening community connections so we can fulfill
        collective needs together.
      </p>
    </Jumbotron>
    <br />
    <Jumbotron variant="dark" title="How we Started">
      <p>
        TMA was created in the fall of 2020 with a primary focus of combating food insecurity. Pantry
        runs were our primary form of outreach. Our focus expanded in February of 2021, when the winter
        storm that hit Texas created a huge need for aid. We provided aid to folks in need of assistance
        with utility bills, medical bills, and more, as well as distributing essential
        cold-weather items to houseless folks.
      </p>
    </Jumbotron>
    <br />
    <Jumbotron variant="light" title="A Wider Network of Aid">
      <p>
        We have affiliated with local non-profit Community Housing Resource Partners, an organization
        that focuses on developing affordable housing to promote “self-sufficiency, education, health
        and wellness, and stable communities.” This partnership ensures long-term sustainability in our
        organization so that we can continue to provide aid within the community.
      </p>
    </Jumbotron>
  </div>
}

export default AboutPage;