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
    padding: 0 10px;
`;

const StyledCalendar = styled(Calendar)`
    width: 100%;
    max-width: 500px;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;

    .react-calendar__tile {
        padding: 10px;
        font-size: 1em;
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

    @media (max-width: 768px) {
        .react-calendar__tile {
            padding: 5px;
            font-size: 0.8em;
        }
    }
`;

const InputContainer = styled.div`
    margin-top: 20px;
    display: ${(props) => (props.show ? 'flex' : 'none')};
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 500px;
`;

const Input = styled.input`
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;

    &:hover {
        background-color: #0056b3;
    }
`;

const ModalContent = styled.div`
    padding: 15px;
    max-width: 250px;
    margin: auto;
    text-align: center;
    border-radius: 8px;
    background-color: #fff;
`;

const ModalTitle = styled.h2`
    font-size: 1.2em;
    margin-bottom: 10px;
`;

const HighlightedName = styled.span`
    font-size: 1.5em;
    font-weight: bold;
    color: #007bff;
`;

const SelectedDatesDisplay = styled.div`
    margin-top: 10px;
    font-size: 0.9em;
    color: #555;
`;

const CalendarComponent = () => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [name, setName] = useState('');
    const [reservations, setReservations] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(
                    'https://port-0-back-reservation-come-back-home-m00peap060a6b751.sel4.cloudtype.app/reservations'
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

    const handleDateChange = (dates) => {
        const sortedDates = dates.sort((a, b) => a - b);
        setSelectedDates(sortedDates);
    };

    const handleReservation = async () => {
        if (!name) {
            alert('Please enter your name.');
            return;
        }

        if (selectedDates.length === 0) {
            alert('Please select at least one date.');
            return;
        }

        try {
            for (const date of selectedDates) {
                const formattedDate = date.toISOString().split('T')[0];
                await axios.post(
                    'https://port-0-back-reservation-come-back-home-m00peap060a6b751.sel4.cloudtype.app/reservations/reserve',
                    {
                        name,
                        date: formattedDate,
                    }
                );
                setReservations({ ...reservations, [formattedDate]: name });
            }
            setSelectedDates([]);
            setName('');
        } catch (error) {
            console.error('Failed to reserve dates', error);
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
                value={selectedDates}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                minDetail="month"
                maxDetail="month"
                view="month"
                locale="en-US"
                showNeighboringMonth={false}
                selectRange={false}
                allowMultipleSelection={true}
                activeStartDate={new Date(2024, 9, 1)}
            />
            <InputContainer show={selectedDates.length > 0}>
                <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <SelectedDatesDisplay>
                    Selected dates:{' '}
                    {selectedDates
                        .map((date) => date.toLocaleDateString())
                        .join(', ')}
                </SelectedDatesDisplay>
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
