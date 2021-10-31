import React from 'react';
import { Jumbotron } from '../components/Jumbotron';

const NewsPage: React.FC = () => {
  return <div>
    <Jumbotron title="What kind of aid do you provide?" justify="left">
      We provide financial assistance to help cover medical expenses, housing and
      utility expenses, and food expenses. These are distributed in the form of
      reimbursements that can be obtained through
      our <a href="/RequestAid" target="_blank" rel="noreferrer"> request for aid process.</a>
    </Jumbotron>
    <br />
    <Jumbotron title="How can I help support TMA?" variant="dark" justify="left">
      TMA relies on donors in order to provide assistance, so donating via
      our <a href="/Donate" target="_blank" rel="noreferrer">donation form</a> is
      a great way to support our efforts. You can also follow us on instagram
      and share our content to get the word out about our organization!
    </Jumbotron>
    <br />
    <Jumbotron title="How do I request aid from TMA?" variant="light" justify="left">
      Glad you asked! Please see
      our <a href="/RequestAid" target="_blank" rel="noreferrer">requesting aid</a> form
      for more details.
    </Jumbotron>
    <br />
    <Jumbotron title="How many times/how often may I request aid from TMA?" variant="dark" justify="left">
      ???
    </Jumbotron>
    <br />
    <Jumbotron title="When is the next TMA event/fundraiser?" variant="light" justify="left">
      Please refer to our <a href="/Events" target="_blank" rel="noreferrer">events page</a>!
    </Jumbotron>
  </div>
}

export default NewsPage;