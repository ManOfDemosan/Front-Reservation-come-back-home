import React from 'react';
import styled from 'styled-components';
import CalendarComponent from './components/Calendar';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 20px;
`;

const Header = styled.h1`
    font-size: 3em; /* 헤더 글자 크기 증가 */
    color: #007bff; /* 헤더 색상 변경 */
    margin-bottom: 30px;
    padding: 10px;
    border-bottom: 3px solid #007bff; /* 더 두꺼운 하단 경계선 */
    width: 100%;
    max-width: 700px; /* 헤더 최대 너비를 조금 더 넓힘 */
    background-color: #fff; /* 헤더 배경색 추가 */
    border-radius: 8px; /* 헤더에 약간의 곡선 추가 */
`;

const App = () => {
    return (
        <AppContainer>
            <Header>재환이 예약 테이블</Header>
            <CalendarComponent />
        </AppContainer>
    );
};

export default App;
