import React from 'react';
import { TextJumbotron, } from '../components/Jumbotron';
import { TopSpacer } from '../components/TopSpacer';
import { ExtLink } from '../components/ExtLink';
import { SplitPanel } from '../components/SplitPanel';

const ContactPage: React.FC = () => {
    return <>
        <TopSpacer />
        <TextJumbotron variant="dark" i18nKey="pages.Contact.0" />
        <SplitPanel src="content/table2.jpg">
        <div className="contact-link">
            <b>Email:</b>
            <ExtLink href="mailto://trinity_mutual_aid@chrpartners.org">
                trinity_mutual_aid@chrpartners.org
            </ExtLink>
            <br />
            <b>Instagram:</b>
            <ExtLink href="https://www.instagram.com/trinitymutualaid">
                trinity_mutual_aid@chrpartners.org
            </ExtLink>
            <br />
            <b>Twitter:</b>
            <ExtLink href="https://twitter.com/trinmutualaid">
                trinity_mutual_aid@chrpartners.org
            </ExtLink>
        </div>
        </SplitPanel>
        {/* <Jumbotron variant="light" justify="left">
        </Jumbotron> */}
    </>
}

export default ContactPage;