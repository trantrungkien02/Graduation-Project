import { useState } from 'react';
import './index.scss'; // Import file CSS thường
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpenReader } from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar } from 'react-circular-progressbar';
type Question = {
    a: string;
    b: string;
    c: string;
    d: string;
    explanation: string; // Thêm phần giải thích
    quesCorrect: string; // Đáp án đúng
    quesName: string;
    _id: string;
    [key: string]: string;
};

type QuizProps = {
    quesList: Question[]; // Danh sách các câu hỏi
    onQuizComplete: (isPassed: boolean) => void;
};

const Quiz = ({ quesList, onQuizComplete }: QuizProps) => {
    const [currentQuestion, setCurrentQuestion] = useState(0); // Theo dõi câu hỏi hiện tại
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // Lưu lựa chọn của người dùng cho tất cả các câu hỏi
    const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái khi đã submit
    const [correctCount, setCorrectCount] = useState(0); // Đếm số câu đúng
    const totalQuestions = quesList.length;

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleAnswer = (answer: string) => {
        // Lưu lại đáp án đã chọn cho câu hỏi hiện tại
        const updatedAnswers = [...selectedAnswers];
        updatedAnswers[currentQuestion] = answer;
        setSelectedAnswers(updatedAnswers);
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        let count = 0;

        selectedAnswers.forEach((answer, index) => {
            if (answer === quesList[index].quesCorrect) {
                count++;
            }
        });

        setCorrectCount(count);
        const isAllCorrect = count === quesList.length; // Kiểm tra trả lời đúng tất cả
        console.log(isAllCorrect);
        if (isAllCorrect === true) {
            onQuizComplete(isAllCorrect);
        }
    };

    const handleReset = () => {
        // Reset tất cả trạng thái về ban đầu
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setIsSubmitted(false);
        setCorrectCount(0);
    };

    // Hàm kiểm tra kết quả
    const getAnswerClass = (questionIndex: number, answerKey: string) => {
        const selectedAnswer = selectedAnswers[questionIndex];
        const correctAnswer = quesList[questionIndex].quesCorrect;

        if (isSubmitted) {
            if (selectedAnswer === correctAnswer && answerKey === correctAnswer) {
                return 'correct'; // Tô màu xanh chỉ đáp án đúng
            } else if (selectedAnswer === answerKey) {
                return 'incorrect'; // Tô màu đỏ nếu đáp án sai
            } else if (answerKey === correctAnswer) {
                return 'correct'; // Tô màu xanh đáp án đúng nếu người dùng chọn sai
            }
        }
        return selectedAnswer === answerKey ? 'selected' : '';
    };

    return (
        <div className="quiz-container">
            <div className="header">
                <FontAwesomeIcon icon={faBookOpenReader} className="mb-[8px] text-[80px] text-[#555]" />
                <h3 className="font-bold text-[30px]  text-[#555]">
                    HÃY HOÀN THÀNH TẤT CẢ CÁC CÂU HỎI ĐỂ TIẾP TỤC BÀI HỌC!
                </h3>
                <div className="submit">
                    <button onClick={handleSubmit}>NỘP BÀI</button>
                </div>
            </div>
            <div className="question">
                <h3 className="font-bold text-[#555]">
                    CÂU HỎI SỐ {currentQuestion + 1} / {totalQuestions}
                </h3>
                <h3 className="font-bold text-[#555]">{quesList[currentQuestion].quesName}</h3>
            </div>
            <div className="flex justify-between">
                <div className="answers">
                    {['a', 'b', 'c', 'd'].map((key, index) => (
                        <button
                            key={key}
                            className={`answer-button ${getAnswerClass(currentQuestion, key)}`}
                            onClick={() => handleAnswer(key)}
                        >
                            {String.fromCharCode(65 + index)}. {quesList[currentQuestion][key]}
                        </button>
                    ))}
                </div>
                <div className="w-[15%]">
                    <CircularProgressbar
                        value={
                            isSubmitted
                                ? (correctCount / totalQuestions) * 100
                                : (selectedAnswers.length / totalQuestions) * 100
                        }
                        text={
                            isSubmitted
                                ? `${correctCount} / ${totalQuestions}`
                                : `${selectedAnswers.length} / ${totalQuestions}`
                        }
                        styles={{
                            text: {
                                fontSize: '20px', // Tăng kích thước văn bản
                                fill: '#555', // Màu sắc văn bản
                            },
                            path: {
                                stroke: '#2c3e50', // Màu xanh lá khi submit, màu xanh dương khi chọn câu hỏi
                            },
                        }}
                    />
                </div>
            </div>
            {isSubmitted && (
                <div className="result">
                    <p className="font-bold text-[15px]  text-[#555]">
                        Bạn đã đúng {correctCount} / {totalQuestions} câu hỏi.
                    </p>
                    <div className="explanation">
                        {/* Chỉ hiển thị giải thích cho câu hỏi hiện tại */}
                        <p className="font-bold text-[15px]  text-[#555]">
                            Câu hỏi số {currentQuestion + 1}: {quesList[currentQuestion].quesName}
                        </p>
                        <p className="font-bold text-[15px]  text-[#555]">
                            Giải thích: {quesList[currentQuestion].explanation}
                        </p>
                    </div>
                </div>
            )}
            <div className="footer">
                <button className="nav-button" disabled={currentQuestion === 0} onClick={handlePrev}>
                    Trước
                </button>
                <div className="pagination">
                    {Array.from({ length: totalQuestions }).map((_, index) => {
                        const isWrong = isSubmitted && selectedAnswers[index] !== quesList[index].quesCorrect; // Kiểm tra nếu câu trả lời sai
                        return (
                            <button
                                key={index}
                                className={`page-button ${currentQuestion === index ? 'active' : ''} ${
                                    selectedAnswers[index] ? 'answered' : ''
                                } ${isWrong ? 'wrong' : ''}`} // Thêm lớp 'wrong' nếu sai
                                onClick={() => setCurrentQuestion(index)}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                <button className="nav-button" disabled={currentQuestion === totalQuestions - 1} onClick={handleNext}>
                    Sau
                </button>
            </div>

            <div className="reset">
                <button onClick={handleReset}>LÀM LẠI</button> {/* Nút Reset */}
            </div>
        </div>
    );
};

export default Quiz;
