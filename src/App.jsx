import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import User Pages
// import HomePage from "./frontend/User/pages/HomePage";
// import SearchResultPage from "./frontend/User/pages/SearchResultPage";
// import HuongDanPage from "./frontend/User/pages/Rules/HuongDanPage";
// import QuyDinhPage from "./frontend/User/pages/Rules/QuyDinhPage";
// import LienHePage from "./frontend/User/pages/Rules/LienHePage";
// import ViewProfilePage from "./frontend/User/pages/Profile/ProfilePage";
// import MyStoriesPage from "./frontend/User/pages/MyStories/MyStoriesPage";
// import CategoryTTPage from "./frontend/User/pages/Category/CategoryTTPage";
// import CategoryVNPage from "./frontend/User/pages/Category/CategoryVNPage";
// import NovelGenresPage from "./frontend/User/pages/Genres/NovelGenresPage";
// import CategoryNNPage from "./frontend/User/pages/Category/CategoryNNPage";
// import NNGenresPage from "./frontend/User/pages/Genres/NNGenresPage";
// import VNGenresPage from "./frontend/User/pages/Genres/VNGenresPage";
// import PostStoryPage from "./frontend/User/pages/Story/PostStoryPage";
// import AddChapterPage from "./frontend/User/pages/Story/AddChapterPage";
// import UpdateStoryPage from "./frontend/User/pages/Story/UpdateStoryPage";
// import EditChapterPage from "./frontend/User/pages/Story/EditChapterPage";
// import ReviewPage from "./frontend/User/pages/ReviewPage/ReviewPage";
// import ReviewHome from "./frontend/User/pages/ReviewPage/ReviewHome";
// import ChapterList from "./frontend/User/components/ChapterList/ChapterList";
// import ChapterDetail from "./frontend/User/components/ChapterDetail/ChapterDetail";
// import IntroductionPage from "./frontend/User/pages/Book/IntroductionBookPage";
// import TableOfContentsPage from "./frontend/User/pages/Book/TableOfContentsPage";
import HomePage from "./frontend/User/pages/HomePage";
import SearchResultPage from "./frontend/User/pages/SearchResultPage";
import HuongDanPage from "./frontend/User/pages/Rules/HuongDanPage";
import QuyDinhPage from "./frontend/User/pages/Rules/QuyDinhPage";
import LienHePage from "./frontend/User/pages/Rules/LienHePage";
import ViewProfilePage from "./frontend/User/pages/Profile/ProfilePage";
import MyStoriesPage from "./frontend/User/pages/MyStories/MyStoriesPage";
import CategoryTTPage from "./frontend/User/pages/Category/CategoryTTPage";
import CategoryVNPage from "./frontend/User/pages/Category/CategoryVNPage";
import NovelGenresPage from "./frontend/User/pages/Genres/NovelGenres";
import CategoryNNPage from "./frontend/User/pages/Category/CategoryNNPage";
import NNGenresPage from "./frontend/User/pages/Genres/NNGenres";
import VNGenresPage from "./frontend/User/pages/Genres/VNGenres";
import AddChapterPage from "./frontend/User/pages/Story/AddChapterPage";
import UpdateStoryPage from "./frontend/User/pages/Story/UpdateStoryPage";
import EditChapterPage from "./frontend/User/pages/Story/EditChapterPage";
import ReviewHome from "./frontend/User/pages/ReviewPage/ReviewHome";
import ChapterList from "./frontend/User/components/ChapterList/ChapterList";
import ChapterDetail from "./frontend/User/components/ChapterDetail/ChapterDetail";
import IntroductionPage from "./frontend/User/pages/Book/IntroductionBookPage";
import TableOfContentsPage from "./frontend/User/pages/Book/TableOfContentsPage";
// Import Admin Pages
import Layout from "./frontend/Admin/components/Layout/Layout";
import AdminManagement from "./frontend/Admin/pages/AdminManagement/AdminManagement";
import Dashboard from "./frontend/Admin/pages/Dashboard/Dashboard";
import Login from "./frontend/Admin/pages/Login/Login";
import Register from "./frontend/Admin/pages/Login/Register";
import OTP from "./frontend/Admin/pages/Login/OTP";
import Reset from "./frontend/Admin/pages/Login/Reset";
import Report from "./frontend/Admin/pages/Report/Report";
// import Comments from "./frontend/Admin/pages/Comments/Comments";
import Banner from "./frontend/Admin/pages/Settings/Banner";
import Service from "./frontend/Admin/pages/Settings/Service";
import Settings from "./frontend/Admin/pages/Settings/Settings";
import StoriesManagement from "./frontend/Admin/pages/Stories/StoriesManagement";
import UsersManagement from "./frontend/Admin/pages/Users/UsersManagement";

// CSS
import "./App.css";

function App() {
  const chapters = [
    {
      id: 1, title: "Chương 01: A", date: "Ngày 1-1-2025", views: 2392,
      content: "Đây là nội dung của Chương 1"
    },
    { id: 2, title: "Chương 02: A", date: "Ngày 1-1-2025", views: 2392, content: "Đảo mộng mơ là một lát cắt đời sống của những đứa trẻ lên 10 giàu trí tưởng tượng như tất cả mọi đứa trẻ. Chúng mơ mộng, tưởng tượng, và tự làm “hiện thực hóa” những khao khát của mình.\n\nCâu chuyện bắt đầu từ một đống cát, và được diễn ra theo nhân vật tôi – cu Tin. Có một hòn đảo hoang, trên đảo có Chúa đảo, phu nhân Chúa đảo, và một chàng Thứ… Bảy. Hàng ngày, vợ chồng Chúa đảo và Thứ Đảo mộng mơ là một lát cắt đời sống của những đứa trẻ lên 10 giàu trí tưởng tượng như tất cả mọi đứa trẻ. Chúng mơ mộng, tưởng tượng, và tự làm “hiện thực hóa” những khao khát của mình.\n\nCâu chuyện bắt đầu từ một đống cát, và được diễn ra theo nhân vật tôi – cu Tin. Có một hòn đảo hoang, trên đảo có Chúa đảo, phu nhân Chúa đảo, và một chàng Thứ… Bảy. Hàng ngày, vợ chồng Chúa đảo và Thứ Bảy vẫn phải đi học, nhưng sau giờ học là một thế giới khác, của đảo, của biển có cá mập, và rừng có thú dữ. Thế giới đó hấp dẫn, đầy quyến rũ, có tranh cãi, có cai trị, có yêu thương, có ẩu đả, và cả…những nụ hôn!\n\nTuổi thơ trong Đảo mộng mơ như trong những tác phẩm khác của Nguyễn Nhật Ánh: trong veo và ngọt ngào. Với cuốn sách này, hẳn bạn sẽ muốn bé lại bằng cu Tin để được cười, được khóc, được làm Chúa đảo thích đọc sách và biết đánh lại lưu manh, bắt giam kẻ cắp. Và từ đó hiểu rằng, đối với trẻ con, nhu cầu được tôn trọng đôi khi lớn hơn gấp bội so với nhu cầu được yêu thương.\n\nNgay từ khi ra mắt, Đảo mộng mơ đã nhanh chóng nhận được sự quan tâm, yêu thích của đông đảo bạn đọc, là cuốn sách bán chạy nhất tại Hội sách Tp. Hồ Chí Minh năm 2010. Kỷ niệm 10 năm xuất bản lần đầu, Đông A tái bản Đảo mộng mơ với diện mạo mới, đồng thời bổ sung Đôi lời của tác giả. Sách có bìa cứng, ruột in trên giấy Ford IK định lượng 140 gsm, tặng kèm 4 postcard và 1 bookmark.Bảy vẫn phải đi học, nhưng sau giờ học là một thế giới khác, của đảo, của biển có cá mập, và rừng có thú dữ. Thế giới đó hấp dẫn, đầy quyến rũ, có tranh cãi, có cai trị, có yêu thương, có ẩu đả, và cả…những nụ hôn!\n\nTuổi thơ trong Đảo mộng mơ như trong những tác phẩm khác của Nguyễn Nhật Ánh: trong veo và ngọt ngào.Với cuốn sách này, hẳn bạn sẽ muốn bé lại bằng cu Tin để được cười, được khóc, được làm Chúa đảo thích đọc sách và biết đánh lại lưu manh, bắt giam kẻ cắp. Và từ đó hiểu rằng, đối với trẻ con, nhu cầu được tôn trọng đôi khi lớn hơn gấp bội so với nhu cầu được yêu thương.\n\nNgay từ khi ra mắt, Đảo mộng mơ đã nhanh chóng nhận được sự quan tâm, yêu thích của đông đảo bạn đọc, là cuốn sách bán chạy nhất tại Hội sách Tp. Hồ Chí Minh năm 2010. Kỷ niệm 10 năm xuất bản lần đầu, Đông A tái bản Đảo mộng mơ với diện mạo mới, đồng thời bổ sung Đôi lời của tác giả. Sách có bìa cứng, ruột in trên giấy Ford IK định lượng 140 gsm, tặng kèm 4 postcard và 1 bookmark." },
    { id: 3, title: "Chương 03: A", date: "Ngày 1-1-2025", views: 2392, content: "Đây là nội dung của Chương 3" },
    { id: 4, title: "Chương 04: A", date: "Ngày 1-1-2025", views: 2392, content: "Đây là nội dung của Chương 4" },
    { id: 5, title: "Chương 05: A", date: "Ngày 1-1-2025", views: 2392, content: "Đây là nội dung của Chương 5" },

  ];

  const ChapterClick = (chapter) => {
    console.log(`Clicked chapter: ${chapter.title}`);
  };
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/search-results" element={<SearchResultPage />} />
          <Route path="/guide" element={<HuongDanPage />} />
          <Route path="/quydinh" element={<QuyDinhPage />} />
          <Route path="/contact" element={<LienHePage />} />
          <Route path="/viewProfile" element={<ViewProfilePage />} />
          <Route path="/myStories" element={<MyStoriesPage />} />
          
          {/* Category Routes */}
          <Route path="/vanhocVN" element={<CategoryVNPage />} />
          <Route path="/vanhocNN" element={<CategoryNNPage />} />
          <Route path="/novel" element={<CategoryTTPage />} />

          {/* Genre Routes */}
          <Route path="/novel/:tag" element={<NovelGenresPage />} />
          <Route path="/vanhocVn/:tag" element={<VNGenresPage />} />
          <Route path="/vanhocnn/:tag" element={<NNGenresPage />} />


          {/* Story Routes */}
          <Route path="/addChapter" element={<AddChapterPage />} />
          <Route path="/editStory/:storyId" element={<UpdateStoryPage />} />
          <Route path="/editChapter" element={<EditChapterPage />} />
          <Route path="/review" element={<ReviewHome />} />
          <Route path="/review/:storyId" element={<ReviewHome />} />

          {/* Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/otp" element={<OTP />} />

          {/* Book Routes */}
          <Route path="/gioi-thieu/:bookId" element={<IntroductionPage />} />
          <Route
  path="/muc-luc/:bookId"
  element={<TableOfContentsPage chapters={chapters} onChapterClick={ChapterClick} />}
/>

          <Route path="/chapters/:bookId" element={<ChapterList chapters={chapters} />} />
          <Route path="/chapter/:bookId/:chapterId" element={<ChapterDetail chapters={chapters} />} />
          <Route path="/stories/:storyId" element={<IntroductionPage />} />
          {/* Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/otp" element={<OTP />} />


          {/* Admin Routes */}
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/report" element={<Report />} />
            {/* <Route path="/admin/comments" element={<Comments />} /> */}
            <Route path="/admin/stories" element={<StoriesManagement />} />
            <Route path="/admin/users" element={<UsersManagement />} />

            <Route path="/admin/settings/banner" element={<Banner />} />
            <Route path="/admin/settings/service" element={<Service />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/management" element={<AdminManagement />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
