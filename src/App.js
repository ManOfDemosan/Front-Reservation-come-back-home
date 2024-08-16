import React from 'react';
import styled from 'styled-components';
import CalendarComponent from './components/Calendar';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f4f4f4;
    text-align: center;
`;

const Header = styled.h1`
    font-size: 2.5em;
    color: #333;
    margin-bottom: 20px;
    padding: 10px;
    border-bottom: 2px solid #007bff;
    width: 100%;
    max-width: 600px;
`;

const App = () => {
    return (
        <AppContainer>
            <Header>한국 돌아가는 재환이 예약 테이블</Header>
            <CalendarComponent />
        </AppContainer>
    );
};

export default App;
