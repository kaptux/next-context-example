import React, { useState } from 'react';
import styled from 'styled-components';

import Map from '~/components/Map';
import variables from '~/styles/Variables';
import { mediaMin } from '~/styles/MediaQueries';
import CopyrightFooter from '~/components/CopyrightFooter';

const { colors } = variables;

const MapContainer = styled.div`
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: fit-content;
  ${mediaMin.tabletLandscape`
    padding: 45px 40px 0 40px;
  `}
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: fit-content;
  ${mediaMin.tabletLandscape`
  flex-direction: row;
  height: 60%;
  `}
`;

const MapCol = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 90vh;
  width: 100%;
  ${mediaMin.tabletLandscape`
  width: 75%;
  min-height: 100%;
  `}
`;
const SelectCol = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5%;
  justify-content: flex-start;
  align-items: start;
  min-height: fit-content;
  ${mediaMin.tablet`
    margin-bottom: 2.5%;
  `}
  ${mediaMin.tabletLandscape`
  margin-bottom: 0;
  width: 25%;
  flex-direction: column;
  `}
`;

const SelectOption = styled.button`
  background: none;
  color: ${props => (props.active ? colors.babyBlue : '#000')};
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  font-weight: 500;
  text-align: left;
  font-size: 1.1em;
  line-height: 30px;
  margin-bottom: 0.5;
  width: ${props => (props.fullWidth ? '100%' : '50%')};
  ${mediaMin.tabletLandscape`
  width: 100%;
  font-size: 22px;
  margin-bottom: 5px;
`}
`;

const selectOptions = [
  'Our Buildings',
  'Restaurants',
  'Grab & Go Food',
  'Event Spaces',
  'Bars',
  'Cafes + Bakeries',
  'Retail',
  'Health + Fitness',
  'Galleries + Museums',
  'Film, Theater And Culture',
  'Bank And Convenience'
];

const MapPage = () => {
  const [activeFilter, setSelection] = useState('Our Buildings');
  const generateSelections = () => {
    return selectOptions.map(option => {
      return (
        <SelectOption
          onClick={() => setSelection(option)}
          key={option}
          fullWidth={option === 'Our Buildings' ? true : false}
          active={activeFilter === option}
        >
          {option}
        </SelectOption>
      );
    });
  };

  return (
    <MapContainer>
      <ContentRow>
        <SelectCol>{generateSelections()}</SelectCol>
        <MapCol>
          <Map activeFilter={activeFilter} />
        </MapCol>
      </ContentRow>
      <CopyrightFooter />
    </MapContainer>
  );
};

export default MapPage;
