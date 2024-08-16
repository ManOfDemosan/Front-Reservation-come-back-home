import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import axios from 'axios';
import Modal from 'react-modal';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
`;

// 백엔드의 API URL 설정
const API_URL = 'https://comebackhome-9b0f2ac70c85.herokuapp.com/api';

const CalendarComponent = () => {
    const [date, setDate] = useState(null);
    const [name, setName] = useState('');
    const [reservations, setReservations] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${API_URL}/reservations`);
                console.log('Reservations data received:', response.data);
                const reservationData = {};
                response.data.forEach((reservation) => {
                    const formattedDate = new Date(reservation.date)
                        .toISOString()
                        .split('T')[0];
                    reservationData[formattedDate] = reservation.name;
                });
                setReservations(reservationData);
            } catch (error) {
                console.error('Failed to fetch reservations', error);
            }
        };

        fetchReservations();
    }, []);

    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        if (reservations[formattedDate]) {
            setModalContent(
                `이날의 일정은 이미 ${reservations[formattedDate]} (이)가 예약해 부렸네요!`
            );
            setModalIsOpen(true);
            return;
        }
        setDate(date);
    };

    const handleReservation = async () => {
        if (!name) {
            alert('Please enter your name.');
            return;
        }

        const formattedDate = date.toISOString().split('T')[0];

        try {
            await axios.post(`${API_URL}/reservations/reserve`, {
                name,
                date: formattedDate,
            });
            setReservations({ ...reservations, [formattedDate]: name });
            setDate(null);
            setName('');
        } catch (error) {
            console.error('Failed to reserve date', error);
        }
    };

    const tileDisabled = ({ date }) => {
        const formattedDate = date.toISOString().split('T')[0];
        const startDate = new Date(2024, 9, 14); // 2024년 10월 14일
        const endDate = new Date(2024, 10, 18); // 2024년 11월 18일

        return date < startDate || date > endDate;
    };

    const tileClassName = ({ date }) => {
        const formattedDate = date.toISOString().split('T')[0];
        return reservations[formattedDate] ? 'reserved' : null;
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <Container>
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                minDetail="month"
                maxDetail="month"
                view="month"
                locale="en-US"
                showNeighboringMonth={false}
                showDoubleView={true}
                activeStartDate={new Date(2024, 9, 1)}
            />
            {date && (
                <div>
                    <input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={handleReservation}>예약하기</button>
                </div>
            )}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Reservation Info"
                ariaHideApp={false}
            >
                <div>{modalContent}</div>
                <button onClick={closeModal}>닫기</button>
            </Modal>
        </Container>
    );
};

export default CalendarComponent;
