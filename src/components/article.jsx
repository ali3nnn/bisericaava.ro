import React from 'react';

// Sample article data
const article = {
    title: "Apartență și crez",
    author: "",
    date: "September 20, 2024",
    content: `
  Biserica Ava este parte a Cultului Creștin Baptist din România.

  Baptiști reprezintă în tradiția creștină o ramură a Reformei Protestante din Europa, din secolele XV- XVI. Prima Biserică Baptistă a luat ființă în anul 1609 în Amsterdam (Olanda). Numele le-a fost impus, inițial ca o poreclă, și făcea referire la practica botezului la o vârstă matură. Prețul plătit de primii creștini baptiști a fost unul greu, mulți fiind uciși, întemnițați sau alungați din comunitatea lor. În prezent, religia baptistă constituie una din cele mai răspândite confesiuni creștine protestante din lume, având biserici în peste 200 țări și un număr de peste  120 000 de membrii.

    În practică religioasă, creștinii baptiști se remarcă prin reîntoarcerea la ceea ce înțeleg prin „simplitatea bisericii din veacul apostolic” și prin importanța pe care o oferă Bibliei în doctrină, închinare și viața de zi cu zi.

    Ei afirmă principiile Reformei:
„Sola Scriptura - Numai Scriptura”
„Sola Fidae - Numai Credința”
„Sola Gratia - Numai Harul”
„Soli Deo Gloria - Numai lui Dumnezeu i se cuvine slava”

Credem că există un Singur Dumnezeu, viu, adevărat și sfânt, existând etern în Sfânta Treime: Tatăl, Fiul și Duhul Sfânt. 

Credem că pământul și viața există pentru că Dumnezeu le-a creat, îi aparțin în întregime și de aceea trebuie să le prețuim și să le îngrijim.  

Credem că toate ființele umane au demnitate pentru că au fost create după chipul și asemănarea lui Dumnezeu, și au valoare dincolo de capacitatea noastră de măsurare, pur și simplu pentru că Dumnezeu și-a pus Chipul în ele.  

Credem că această lume are parte de dureri și suferință pentru că ființele umane au căzut în păcat, s-au înstrăinat de Dumnezeu, unii de alții, și de creație. 

Credem că Dumnezeu nu va îngădui ca păcatul și suferința să aibă ultimul cuvânt, ci, El lucrează la răscumpărarea și restaurarea Creației Sale, atât a omului, cât și a naturii. 

Credem că Dumnezeu s-a exprimat pe Sine, în mod unic, în Fiul Său, Isus Hristos, care a fost conceput în mod miraculos, născut dintr-o fecioară, a trăit o viață de ascultare, a suferit de mâna omului, a murit pe cruce și a înviat a treia zi, de dragul nostru. Isus a fost în întregime om și în întregime Dumnezeu, El este Stăpânul, Învățătorul și Mântuitorul nostru, iar acum domnește veșnic alături de Tatăl Ceresc.

 Credem că Mântuirea este în întregime lucrarea harului lui Dumnezeu, primită prin pocăință și credință. Astfel, fiecare persoană poate fi făcută o făptură nouă în Hristos, prin Duhul Sfânt, pentru ca mai apoi, să crească continuu în cunoștința de Dumnezeu și în sfințenie. 

Credem că Isus Hristos ne învață o cale demnă de a fi urmată, fiind o mărturie frumoasă în societate și când ne strângem laolaltă. Credem că Duhul Sfânt ne este dat ca să ne apropie de Dumnezeu și să ne transforme după chipul Domnului Isus. 

Credem că Biserica este comunitatea prin care Dumnezeu dorește să-și reverse iubirea, vindecarea și să se descopere omenirii, comunitatea care invită pe oricine este gata să-L urmeze pe Isus Hristos, în gândire și fapte. 

Credem și nădăjduim că Isus Hristos se va reîntoarce pe pământ, că iubirea și dreptatea vor triumfa la Judecata de Apoi și că Dumnezeu va îndrepta și înnoi toate lucrurile.
  `,
};

// ArticleHeader component
const ArticleHeader = ({ title, author, date }) => (
    <header style={styles.header}>
        <h1>{title}</h1>
        {author ? <p style={styles.meta}>
            <strong>{author}</strong> | <em>{date}</em>
        </p> : "" }
    </header>
);

// ArticleContent component
const ArticleContent = ({ content }) => (
    <section style={styles.content}>
        {content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
        ))}
    </section>
);

// Main ArticlePage component
export const ArticlePage = () => (
    <div style={styles.page}>
        <ArticleHeader title={article.title} author={article.author} date={article.date} />
        <ArticleContent content={article.content} />
    </div>
);

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
