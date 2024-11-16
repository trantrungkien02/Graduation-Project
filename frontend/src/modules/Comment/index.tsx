import React from 'react';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';

const CommentForm = () => {
    const data = [
        {
            userId: '64e1c8b845a7b45b8dcdfe32',
            comId: 'c1', // comId cho comment
            lessonId: '64e1c8b845a7b45b8dcdfe33',
            fullName: 'Alice Johnson',
            text: 'This lesson was really helpful!',
            avatarUrl: 'https://example.com/avatar1.jpg',
            timestamp: '2024-11-08T09:45:00.000Z',
            replies: [
                {
                    userId: '64e1c8b845a7b45b8dcdfe34',
                    comId: 'r1', // comId cho reply
                    fullName: 'Bob Smith',
                    text: 'I agree, Alice! I learned a lot too.',
                    avatarUrl: 'https://example.com/avatar2.jpg',
                    timestamp: '2024-11-08T10:00:00.000Z',
                },
                {
                    userId: '64e1c8b845a7b45b8dcdfe35',
                    comId: 'r2',
                    fullName: 'Charlie Brown',
                    text: 'Thanks for sharing your thoughts!',
                    avatarUrl: 'https://example.com/avatar3.jpg',
                    timestamp: '2024-11-08T10:15:00.000Z',
                },
            ],
        },
        {
            userId: '64e1c8b845a7b45b8dcdfe36',
            comId: 'c2',
            lessonId: '64e1c8b845a7b45b8dcdfe33',
            fullName: 'David Wilson',
            text: 'Can someone explain the last part?',
            avatarUrl: 'https://example.com/avatar4.jpg',
            timestamp: '2024-11-08T09:50:00.000Z',
            replies: [
                {
                    userId: '64e1c8b845a7b45b8dcdfe37',
                    comId: 'r3',
                    fullName: 'Eve Adams',
                    text: 'Sure, David! The key is in understanding the formula.',
                    avatarUrl: 'https://example.com/avatar5.jpg',
                    timestamp: '2024-11-08T10:05:00.000Z',
                },
                {
                    userId: '64e1c8b845a7b45b8dcdfe38',
                    comId: 'r4',
                    fullName: 'Frank Miller',
                    text: 'Check the lecture notes as well.',
                    avatarUrl: 'https://example.com/avatar6.jpg',
                    timestamp: '2024-11-08T10:20:00.000Z',
                },
            ],
        },
        {
            userId: '64e1c8b845a7b45b8dcdfe39',
            comId: 'c3',
            lessonId: '64e1c8b845a7b45b8dcdfe33',
            fullName: 'Grace Lee',
            text: 'I found an alternative solution to the problem.',
            avatarUrl: 'https://example.com/avatar7.jpg',
            timestamp: '2024-11-08T09:55:00.000Z',
            replies: [
                {
                    userId: '64e1c8b845a7b45b8dcdfe40',
                    comId: 'r5',
                    fullName: 'Hannah White',
                    text: 'Could you share it with us?',
                    avatarUrl: 'https://example.com/avatar8.jpg',
                    timestamp: '2024-11-08T10:10:00.000Z',
                },
                {
                    userId: '64e1c8b845a7b45b8dcdfe41',
                    comId: 'r6',
                    fullName: 'Isaac Clarke',
                    text: "I'm interested too!",
                    avatarUrl: 'https://example.com/avatar9.jpg',
                    timestamp: '2024-11-08T10:25:00.000Z',
                },
            ],
        },
        {
            userId: '64e1c8b845a7b45b8dcdfe42',
            comId: 'c4',
            lessonId: '64e1c8b845a7b45b8dcdfe33',
            fullName: 'James Bond',
            text: 'This was too easy for me.',
            avatarUrl: 'https://example.com/avatar10.jpg',
            timestamp: '2024-11-08T09:55:00.000Z',
            replies: [
                {
                    userId: '64e1c8b845a7b45b8dcdfe43',
                    comId: 'r7',
                    fullName: 'Kim Lee',
                    text: "It's great you're finding it easy!",
                    avatarUrl: 'https://example.com/avatar11.jpg',
                    timestamp: '2024-11-08T10:30:00.000Z',
                },
                {
                    userId: '64e1c8b845a7b45b8dcdfe44',
                    comId: 'r8',
                    fullName: 'Laura King',
                    text: 'I could use some tips!',
                    avatarUrl: 'https://example.com/avatar12.jpg',
                    timestamp: '2024-11-08T10:35:00.000Z',
                },
            ],
        },
        {
            userId: '64e1c8b845a7b45b8dcdfe45',
            comId: 'c5',
            lessonId: '64e1c8b845a7b45b8dcdfe33',
            fullName: 'Michael Scott',
            text: "Can't wait to try this out in real life!",
            avatarUrl: 'https://example.com/avatar13.jpg',
            timestamp: '2024-11-08T09:59:00.000Z',
            replies: [
                {
                    userId: '64e1c8b845a7b45b8dcdfe46',
                    comId: 'r9',
                    fullName: 'Nina Black',
                    text: 'Same here, Michael!',
                    avatarUrl: 'https://example.com/avatar14.jpg',
                    timestamp: '2024-11-08T10:40:00.000Z',
                },
                {
                    userId: '64e1c8b845a7b45b8dcdfe47',
                    comId: 'r10',
                    fullName: 'Oliver Queen',
                    text: 'Make sure to follow safety guidelines!',
                    avatarUrl: 'https://example.com/avatar15.jpg',
                    timestamp: '2024-11-08T10:50:00.000Z',
                },
            ],
        },
    ];

    return (
        <CommentSection
            currentUser={{
                currentUserId: '01a',
                currentUserImg: 'https://ui-avatars.com/api/name=Riya&background=random',
                currentUserProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
                currentUserFullName: 'Riya Negi',
            }}
            hrStyle={{ border: '0.5px solid #ff0072' }}
            commentData={data}
            currentData={(data: any) => {
                console.log('current data', data);
            }}
            logIn={{
                onLogin: () => alert('Call login function '),
                signUpLink: 'http://localhost:3001/',
            }}
            customImg="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F13%2F2015%2F04%2F05%2Ffeatured.jpg&q=60"
            inputStyle={{ border: '1px solid rgb(208 208 208)' }}
            formStyle={{ backgroundColor: 'white' }}
            submitBtnStyle={{
                border: '1px solid black',
                backgroundColor: 'black',
                padding: '7px 15px',
            }}
            cancelBtnStyle={{
                border: '1px solid gray',
                backgroundColor: 'gray',
                color: 'white',
                padding: '7px 15px',
            }}
            advancedInput={true}
            replyInputStyle={{ borderBottom: '1px solid black', color: 'black' }}
        />
    );
};

export default CommentForm;
