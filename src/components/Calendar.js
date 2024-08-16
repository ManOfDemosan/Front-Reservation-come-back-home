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

const StyledCalendar = styled(Calendar)`
    width: 100%;
    max-width: 900px;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;

    .react-calendar__tile {
        padding: 20px;
        font-size: 1.2em;
        position: relative;
    }

    .react-calendar__tile--active {
        background: #28a745;
        color: white;
    }

    .react-calendar__tile--disabled {
        background: #ddd;
        color: #888;
        cursor: not-allowed;
    }

    .reserved {
        background-color: #f5c6cb !important;
        color: #721c24 !important;
        cursor: pointer;
    }
`;

const InputContainer = styled.div`
    margin-top: 20px;
    display: ${(props) => (props.show ? 'block' : 'none')};
`;

const Input = styled.input`
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const ModalContent = styled.div`
    padding: 15px; /* 모달 크기를 조정 */
    max-width: 250px; /* 모달 너비를 줄임 */
    margin: auto;
    text-align: center;
    border-radius: 8px;
    background-color: #fff;
`;

const ModalTitle = styled.h2`
    font-size: 1.2em; /* 타이틀 크기 */
    margin-bottom: 10px;
`;

const HighlightedName = styled.span`
    font-size: 1.5em; /* 예약자 이름 크기 */
    font-weight: bold;
    color: #007bff;
`;

const CalendarComponent = () => {
    const [date, setDate] = useState(null);
    const [name, setName] = useState('');
    const [reservations, setReservations] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/api/reservations'
                );
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
                <div>
                    이날의 일정은 이미{' '}
                    <HighlightedName>
                        {reservations[formattedDate]}
                    </HighlightedName>{' '}
                    (이)가 예약해 부렸네요!
                </div>
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
            await axios.post('http://localhost:3000/api/reservations/reserve', {
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
            <StyledCalendar
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
            <InputContainer show={date}>
                <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button onClick={handleReservation}>Submit</Button>
            </InputContainer>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Reservation Info"
                ariaHideApp={false}
            >
                <ModalContent>
                    <ModalTitle>누구인가 예약한자 </ModalTitle>
                    {modalContent}
                    <Button onClick={closeModal}>Close</Button>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default CalendarComponent;
