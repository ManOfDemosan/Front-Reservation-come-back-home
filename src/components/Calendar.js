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
    width: 80%; /* 화면의 80%를 차지하게 설정 */
    max-width: 1000px; /* 최대 너비를 제한 */
`;

const StyledCalendar = styled(Calendar)`
    width: 100%;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;

    .react-calendar__tile {
        padding: 15px; /* 패딩을 증가시켜 더 크게 보이게 함 */
        font-size: 1.2em; /* 폰트 크기를 키움 */
        position: relative;
    }

    .react-calendar__tile--active,
    .react-calendar__tile--rangeStart,
    .react-calendar__tile--rangeEnd {
        background: #28a745;
        color: white;
    }

    .react-calendar__tile--rangeBetween {
        background: #a8e6b1;
        color: black;
    }

    .react-calendar__tile--disabled {
        background: #ddd;
        color: #888;
        cursor: not-allowed;
    }

    .reserved {
        background-color: #f5c6cb !important;
        color: #721c24 !important;
        cursor: not-allowed;
        font-weight: bold; /* 예약된 날짜의 폰트를 두껍게 */
    }

    @media (max-width: 768px) {
        .react-calendar__tile {
            padding: 10px;
            font-size: 1em;
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
    padding: 12px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    font-size: 1.1em; /* 입력 필드의 폰트 크기 증가 */
`;

const Button = styled.button`
    padding: 12px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    font-size: 1.1em; /* 버튼의 폰트 크기 증가 */

    &:hover {
        background-color: #0056b3;
    }
`;

const ModalContent = styled.div`
    padding: 20px;
    max-width: 250px;
    margin: auto;
    text-align: center;
    border-radius: 8px;
    background-color: #fff;

    @media (max-width: 768px) {
        max-width: 80%;
        padding: 20px;
    }
`;

const ModalTitle = styled.h2`
    font-size: 1.5em; /* 모달 타이틀의 폰트 크기 증가 */
    margin-bottom: 10px;

    @media (max-width: 768px) {
        font-size: 1.3em;
    }
`;

const SelectedDatesDisplay = styled.div`
    margin-top: 10px;
    font-size: 1.2em; /* 선택한 날짜 표시 크기 증가 */
    color: #555;
`;

const CalendarComponent = () => {
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
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

    const handleDateClick = (value) => {
        const clickedDate = value.toISOString().split('T')[0];
        if (reservations[clickedDate]) {
            setModalContent(
                `${clickedDate} 에는 ${reservations[clickedDate]} 이(가) 예약을 이미 해부렸네용!`
            );
            setModalIsOpen(true);
        }
    };

    const handleDateChange = (value) => {
        setSelectedDateRange(value);
    };

    const handleReservation = async () => {
        if (!name) {
            alert('이름을 입력해주세요!');
            return;
        }

        if (!selectedDateRange[0] || !selectedDateRange[1]) {
            alert('예약할 날짜를 선택해주세요!');
            return;
        }

        try {
            const startDate = new Date(selectedDateRange[0]);
            const endDate = new Date(selectedDateRange[1]);
            for (
                let date = startDate;
                date <= endDate;
                date.setDate(date.getDate() + 1)
            ) {
                const formattedDate = date.toISOString().split('T')[0];
                if (reservations[formattedDate]) {
                    alert(
                        `${formattedDate} 는 이미 ${reservations[formattedDate]} 님이 예약했어요 힝구 😢`
                    );
                    return;
                }
            }

            for (
                let date = startDate;
                date <= endDate;
                date.setDate(date.getDate() + 1)
            ) {
                const formattedDate = date.toISOString().split('T')[0];
                console.log('Sending POST request with data:', {
                    name,
                    date: formattedDate,
                });
                await axios.post(
                    'https://port-0-back-reservation-come-back-home-m00peap060a6b751.sel4.cloudtype.app/reservations/reserve',
                    {
                        name,
                        date: formattedDate,
                    }
                );
                setReservations((prev) => ({ ...prev, [formattedDate]: name }));
            }
            setSelectedDateRange([null, null]);
            setName('');
            console.log('Sending POST request with data:', {
                name,
                date: formattedDate,
            });
            alert('예약 성공! 🎉');
        } catch (error) {
            console.error('Failed to reserve dates', error);
            alert('예약 실패! 😢');
        }
    };

    const tileDisabled = ({ date }) => {
        const startDate = new Date(2024, 9, 14);
        const endDate = new Date(2024, 10, 18);

        return date < startDate || date > endDate;
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = date.toISOString().split('T')[0];
            return reservations[formattedDate] ? 'reserved' : null;
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <Container>
            <StyledCalendar
                onChange={handleDateChange}
                onClickDay={handleDateClick}
                value={selectedDateRange}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                minDetail="month"
                maxDetail="month"
                view="month"
                locale="en-US"
                showNeighboringMonth={false}
                selectRange={true}
                minDate={new Date(2024, 9, 14)}
                maxDate={new Date(2024, 10, 18)}
                defaultActiveStartDate={new Date(2024, 9, 1)}
            />
            <InputContainer
                show={
                    selectedDateRange[0] !== null &&
                    selectedDateRange[1] !== null
                }
            >
                <Input
                    type="text"
                    placeholder="이름을 알려주세요 😊"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <SelectedDatesDisplay>
                    Selected dates: {selectedDateRange[0]?.toLocaleDateString()}{' '}
                    - {selectedDateRange[1]?.toLocaleDateString()}
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
                    <ModalTitle> 빠르다 빨라 선약한 사람 </ModalTitle>
                    <p>{modalContent}</p>
                    <Button onClick={closeModal}>Close</Button>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default CalendarComponent;
