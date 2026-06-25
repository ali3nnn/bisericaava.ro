import React from 'react';
import { convertStringToHTML } from '../utils.js';

// ArticleHeader component
const ArticleHeader = ({ title, author, date }) => (
    <header>
        <h1>{title}</h1>
        {author ? (
            <p className="meta">
                <strong>{author}</strong> | <em>{date}</em>
            </p>
        ) : null}
    </header>
);

// ArticleContent component
const ArticleContent = ({ content }) => (
    <section>
        {convertStringToHTML(content)}
    </section>
);

// Main ArticlePage component
export const ArticlePage = ({ data }) => {
    return (
        <article className="article" data-reveal>
            <ArticleHeader title={data.title} author={data.author} date={data.date} />
            <ArticleContent content={data.content} />
        </article>
    )
};
