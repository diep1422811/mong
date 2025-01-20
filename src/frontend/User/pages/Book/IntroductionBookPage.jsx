import React from "react";
import Title from "../../components/Title/Title";
import Divider from "../../components/Divider/Divider";
import BookDetails from "../../components/BookDetails/BookDetails";
import Tabs from "../../components/Tabs/Tabs";
import Content from "../../components/Content/Content";
import Header from "../../components/Header";

const IntroductionBookPage = () => {
    return (
        <>
            <Header />
            <Title />
            <Divider />
            <BookDetails />
            <Tabs />
            <Divider />
            <Content />
        </>
    );
};

export default IntroductionBookPage;
