import { useState } from 'react';
import './index.scss'; // Import file CSS thường

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
};

const Quiz = ({ quesList }: QuizProps) => {
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
        setIsSubmitted(true); // Đánh dấu đã submit
        let count = 0;
        // Đếm số câu đúng
        selectedAnswers.forEach((answer, index) => {
            if (answer === quesList[index].quesCorrect) {
                count++;
            }
        });
        setCorrectCount(count); // Cập nhật số câu đúng
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
                <p>Time remaining</p>
                <p>14:52</p>
            </div>
            <div className="question">
                <h3>
                    Question {currentQuestion + 1} of {totalQuestions}
                </h3>
                <p>{quesList[currentQuestion].quesName}</p>
            </div>
            <div className="answers">
                {['a', 'b', 'c', 'd'].map((key) => (
                    <button
                        key={key}
                        className={`answer-button ${getAnswerClass(currentQuestion, key)}`}
                        onClick={() => handleAnswer(key)}
                    >
                        {quesList[currentQuestion][key]}
                    </button>
                ))}
            </div>
            <div className="footer">
                <button className="nav-button" disabled={currentQuestion === 0} onClick={handlePrev}>
                    Prev
                </button>
                <div className="pagination">
                    {Array.from({ length: totalQuestions }).map((_, index) => (
                        <button
                            key={index}
                            className={`page-button ${currentQuestion === index ? 'active' : ''} ${selectedAnswers[index] ? 'answered' : ''}`}
                            onClick={() => setCurrentQuestion(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button className="nav-button" disabled={currentQuestion === totalQuestions - 1} onClick={handleNext}>
                    Next
                </button>
            </div>
            <div className="submit">
                <button onClick={handleSubmit}>SUBMIT</button>
            </div>
            {isSubmitted && (
                <div className="result">
                    <p>
                        You got {correctCount} out of {totalQuestions} correct.
                    </p>
                    <div className="explanation">
                        {/* Chỉ hiển thị giải thích cho câu hỏi hiện tại */}
                        <p className="question-name">{quesList[currentQuestion].quesName}</p>
                        <p className="explanation">Explanation: {quesList[currentQuestion].explanation}</p>
                    </div>
                </div>
            )}
            <div className="reset">
                <button onClick={handleReset}>RESET</button> {/* Nút Reset */}
            </div>
        </div>
    );
};

export default Quiz;
