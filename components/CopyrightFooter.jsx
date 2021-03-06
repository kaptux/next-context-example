import styled from 'styled-components';
import { mediaMin } from '../styles/MediaQueries';
import Link from 'next/link';

const CopyrightFooterContainer = styled.div`
  font-size: 11px;
  line-height: 1.5;
  font-weight: lighter;
  padding: 20% 5% 10px 5%;
  justify-content: center;
  text-align: center;
  max-width: 100%;
  ${mediaMin.tablet`
    padding: 10% 5% 10px 5%;
  `}
  ${mediaMin.tabletLandscape`
    font-size: 12px;
    line-height: 22px;
    padding: 5% 5% 10px 5%;
  `}
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CopyrightFooter = () => {
  return (
    <CopyrightFooterContainer>
      Copyright © 2019. No part of this website (eg. pictures, graphs, logos and others designing material) may be
      copied, disseminated or published for commercial or advertising use without the prior written permission from
      Hudson Square Properties. |{' '}
      <Link href="/accessibility">
        {/* eslint-disable-next-line */}
        <a>Accessibility Statement</a>
      </Link>
    </CopyrightFooterContainer>
  );
};

export default CopyrightFooter;
