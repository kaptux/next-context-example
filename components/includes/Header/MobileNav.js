import Link from 'next/link';
import styled from 'styled-components';

import { MobileHamburger, MobileClose } from './Hamburgers';
import { generateBuildingLinks, generateLocationLinks, generateNewsLink, generateStoryLinks } from './SubNav';
import { mediaMin } from '~/styles/MediaQueries';
import variables from '~/styles/Variables';
import Context from '~/config/Context';

const MobileHamburgerContainer = styled.div`
  display: flex;
  height: 100%;

  ${mediaMin.desktopSmall`
    display: none;
  `}
`;

const MobileOverlay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 200ms ease;
  visibility: ${props => (props.active ? 'visible' : 'hidden')};
  opacity: ${props => (props.active ? 1 : 0)};

  ${mediaMin.desktopSmall`
    display: none;
  `}
`;

const MobileNav = styled.div`
  background: #fff;
  width: 300px;
  position: fixed;
  height: 100%;
  top: 0;
  right: ${props => (props.active ? 0 : '-300px')};
  visibility: ${props => (props.active ? 'visible' : 'hidden')};
  transition: all 400ms ease;
  z-index: 100;
  overflow-y: scroll;

  ${mediaMin.desktopSmall`
    display: none;
  `}

  ul.main-nav-ul {
    padding: 30px;
    margin-top: 0;
    overflow-y: scroll;
    li.main-nav-li:nth-child(10) {
      border-bottom: none;
    }

    li.main-nav-li {
      list-style-type: none;
      padding: 17px 0;
      border-bottom: 2px solid rgba(200, 200, 200, 0.2);
      position: relative;
      font-family: ${variables.typography.default};
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 1px;
      i {
        position: absolute;
        right: 0;
        color: rgba(51, 51, 51, 0.27);
        cursor: pointer;
        transition: transform 200ms ease;
        transform: rotate(0);
        &.active {
          transform: rotate(45deg);
        }
      }
    }
    li.main-nav-li:last-child {
      border-bottom: none;
    }
    li.active {
      color: ${variables.colors.babyBlue};
    }
    li.inactive {
      color: #000;
    }
  }

  .social-links {
    padding-top: 20px;
    text-align: center;
    a {
      margin: 0 10px;
    }
  }
`;

const setActive = (route, linkPath) => {
  if (route === linkPath) {
    return 'active';
  }
  if (route === 'building' && linkPath === 'buildings') {
    return 'active';
  }
  if (route === 'press' && linkPath === 'news') {
    return 'active';
  }
  return '';
};

const MobileNavigation = props => {
  const context = React.useContext(Context);
  const generateLinks = props.routes.map(page => {
    const linkText = page.link;
    const linkPath = page.path;
    let pageLink = (page, subNav = null) => (
      <li className={`main-nav-li ${setActive(props.route, linkPath)}`} key={`mobile-link-${linkText}`}>
        {linkText === 'login' ? (
          <a href={linkPath}>{linkText.charAt(0).toUpperCase() + linkText.slice(1)}</a>
        ) : (
          <Link href={`/${linkPath}`}>
            {/* eslint-disable-next-line */}
            <a
              onClick={() => {
                context.closeMobileNav();
              }}
            >
              {linkText.charAt(0).toUpperCase() + linkText.slice(1)}
            </a>
          </Link>
        )}
        {/* eslint-disable */}
        {subNav && (
          <i
            className={`fas fa-plus ${context.state.navigation.activeSubNav === linkText ? 'active' : null}`}
            onClick={() => context.toggleSubNav(linkText)}
          />
        )}
        {/* eslint-disable */}
        {subNav}
      </li>
    );

    if (linkText === 'buildings') {
      return pageLink(linkText, generateBuildingLinks(props.route, props.query));
    } else if (linkText === 'location') {
      return pageLink(linkText, generateLocationLinks());
    } else if (linkText === 'news') {
      return pageLink(linkText, generateNewsLink(props.route));
    } else if (linkText === 'story') {
      return pageLink(linkText, generateStoryLinks());
    } else {
      return pageLink(linkText);
    }
  });

  return (
    <Context.Consumer>
      {context => (
        <React.Fragment>
          <MobileHamburgerContainer>
            <MobileHamburger />
          </MobileHamburgerContainer>
          <MobileNav active={context.state.navigation.mobileNavActive}>
            <MobileClose />
            <ul className="main-nav-ul">
              {generateLinks}
              <div className="social-links">
                <a href="https://www.instagram.com/hudsonsquareproperties/">
                  <img src="/static/images/icons/insta.svg" alt="insta icon" />
                </a>
                <a href="https://www.facebook.com/HudsonSquareProperties/">
                  <img src="/static/images/icons/fb.svg" alt="fb icon" />
                </a>
              </div>
            </ul>
          </MobileNav>
          {context.state.windowDimensions.width < 1250 && (
            <MobileOverlay onClick={context.closeMobileNav} active={context.state.navigation.mobileNavActive} />
          )}
        </React.Fragment>
      )}
    </Context.Consumer>
  );
};

export default MobileNavigation;
