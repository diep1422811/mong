import React from "react";
import Title from "../../components/Title/Title";
import Divider from "../../components/Divider/Divider";
import BookDetails from "../../components/BookDetails/BookDetails";
import Tabs from "../../components/Tabs/Tabs";
import ChapterList from "../../components/ChapterList/ChapterList";
import SimilarBooks from "../../components/SimilarBooks/SimilarBooks";
import Header from "../../components/Header";


const TableOfContentsPage = ({ chapters, onChapterClick }) => {
    return (
        <>
            <Header/>
            <Title />
            <Divider />
            <BookDetails />
            <Tabs />
            <Divider />
            <ChapterList chapters={chapters} onChapterClick={onChapterClick} />
            <SimilarBooks />
        </>
    );
};

export default TableOfContentsPage;
