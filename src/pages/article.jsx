import React from 'react';
import { convertStringToHTML } from '../utils.js';

// ArticleHeader component
const ArticleHeader = ({ title, author, date }) => (
    <header style={styles.header}>
        <h1>{title}</h1>
        {author ? (
            <p style={styles.meta}>
                <strong>{author}</strong> | <em>{date}</em>
            </p>
        ) : null}
    </header>
);

// ArticleContent component
const ArticleContent = ({ content }) => (
    <section style={styles.content}>
        {convertStringToHTML(content)}
    </section>
);

// Main ArticlePage component
export const ArticlePage = ({ data }) => {
    return (
        <div style={styles.page}>
            <ArticleHeader title={data.title} author={data.author} date={data.date} />
            <ArticleContent content={data.content} />
        </div>
    )
};

// Styles
const styles = {
    page: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    meta: {
        color: '#666',
        fontSize: '14px',
        marginTop: '5px',
    },
    content: {
        lineHeight: '1.6',
        fontSize: '18px',
    },
};
