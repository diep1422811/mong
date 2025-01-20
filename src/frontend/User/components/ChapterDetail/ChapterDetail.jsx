import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ChapterDetail.css';

const ChapterDetail = ({ chapters }) => {
  const { chapterId } = useParams();
  const chapter = chapters.find((chap) => chap.id === parseInt(chapterId));
  const [showChapterList, setShowChapterList] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(chapter?.comments || []);
  const [views, setViews] = useState(chapter?.views || 0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [reply, setReply] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  
  const MAX_COMMENT_LENGTH = 150;
  const COMMENTS_PER_PAGE = 5;

  const [visibleComments, setVisibleComments] = useState(COMMENTS_PER_PAGE);
  const [isCollapsed, setIsCollapsed] = useState(false); // Trạng thái thu gọn

  useEffect(() => {
    setViews((prev) => prev + 1);
  }, []);

  const handleCommentToggle = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now(),
      content: comment,
      author: 'User',
      timestamp: new Date().toLocaleString(),
      replies: [],
    };
    setComments([newComment, ...comments]); // Thêm bình luận mới vào đầu danh sách
    setComment('');
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    const updatedComments = comments.map((comm) =>
      comm.id === replyTo
        ? {
            ...comm,
            replies: [
              ...comm.replies,
              { content: reply, author: 'User', timestamp: new Date().toLocaleString() },
            ],
          }
        : comm
    );
    setComments(updatedComments);
    setReply('');
    setReplyTo(null);
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter((comm) => comm.id !== id));
  };

  const handleDeleteReply = (commentId, replyIndex) => {
    const updatedComments = comments.map((comm) =>
      comm.id === commentId
        ? { ...comm, replies: comm.replies.filter((_, index) => index !== replyIndex) }
        : comm
    );
    setComments(updatedComments);
  };

  const handleEditComment = (id, newContent) => {
    const updatedComments = comments.map((comm) =>
      comm.id === id ? { ...comm, content: newContent } : comm
    );
    setComments(updatedComments);
  };

  const loadMoreComments = () => {
    setVisibleComments(visibleComments + COMMENTS_PER_PAGE);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getNextChapterId = () => {
    const currentIndex = chapters.findIndex((chap) => chap.id === parseInt(chapterId));
    return currentIndex < chapters.length - 1 ? chapters[currentIndex + 1].id : null;
  };

  const getPrevChapterId = () => {
    const currentIndex = chapters.findIndex((chap) => chap.id === parseInt(chapterId));
    return currentIndex > 0 ? chapters[currentIndex - 1].id : null;
  };

  if (!chapter) {
    return <p className="not-found">Chapter not found.</p>;
  }

  return (
    <div className="chapter-detail-wrapper">
      <h1 className="chapter-title">{chapter.title}</h1>

      {/* Phần thông tin chương */}
      <div className="chapter-info">
        <span><i className="icon eye"></i> {views} lượt xem</span>
        <span><i className="icon comments"></i> {comments.length} bình luận</span>
      </div>

      {/* Nút điều hướng phía trên */}
      <div className="navigation-buttons top">
        {getPrevChapterId() && (
          <Link to={`/chapter/${getPrevChapterId()}`} className="nav-button">
            Chương Trước
          </Link>
        )}
        <div className="ui compact selection dropdown">
          <i className="list alternate icon"></i> {/* Biểu tượng danh sách chương */}
          <div className="menu">
            {chapters.map((chap) => (
              <div className="item" key={chap.id}>
                <Link to={`/chapter/${chap.id}`} onClick={() => setShowChapterList(false)}>
                  {chap.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
        {getNextChapterId() && (
          <Link to={`/chapter/${getNextChapterId()}`} className="nav-button">
            Chương Sau
          </Link>
        )}
      </div>

      {/* Nội dung chương */}
      <div className="chapter-content">
        <p>{chapter.content}</p>
      </div>

      {/* Nút điều hướng phía dưới */}
      <div className="navigation-buttons">
        {getPrevChapterId() && (
          <Link to={`/chapter/${getPrevChapterId()}`} className="nav-button">
            Chương Trước
          </Link>
        )}
        <div className="ui compact selection dropdown">
          <i className="list alternate icon"></i> {/* Biểu tượng danh sách chương */}
          <div className="menu">
            {chapters.map((chap) => (
              <div className="item" key={chap.id}>
                <Link to={`/chapter/${chap.id}`} onClick={() => setShowChapterList(false)}>
                  {chap.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
        {getNextChapterId() && (
          <Link to={`/chapter/${getNextChapterId()}`} className="nav-button">
            Chương Sau
          </Link>
        )}
      </div>

      {/* Phần bình luận */}
      <div className="comments-section">
        <div className="comment-header" onClick={handleCommentToggle}>
          <span className="comment-icon">💬</span> Bình luận
        </div>

        {isCommentOpen && (
          <div className="ui threaded comments">
            

            {/* Form để nhập bình luận */}
            <form className="ui reply form" onSubmit={handleCommentSubmit}>
              <div className="field">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Thêm bình luận..."
                  rows="3"
                />
              </div>
              <button type="submit" className="ui blue submit button">
                Gửi bình luận
              </button>
            </form>

            {/* Bình luận mới nhất hiển thị trước */}
            {comments.slice(0, visibleComments).map((comm) => (
              <div key={comm.id} className="comment">
                
                <div className="content">
                  <a className="author">{comm.author}</a>
                  <div className="metadata">
                    <span className="date">{comm.timestamp}</span>
                  </div>
                  <div className="text">
                    {comm.content.length > MAX_COMMENT_LENGTH ? (
                      <>
                        {comm.expanded
                          ? comm.content // Hiển thị toàn bộ nội dung nếu bình luận đã được mở rộng
                          : comm.content.slice(0, MAX_COMMENT_LENGTH) + '...'}
                        <a
                          onClick={() => setComments(comments.map(c => c.id === comm.id ? {...c, expanded: !c.expanded} : c))}
                          className="expand-link"
                        >
                          {comm.expanded ? 'Thu gọn' : 'Xem thêm'}
                        </a>
                      </>
                    ) : (
                      comm.content
                    )}
                  </div>
                  <div className="actions">
                    <a className="edit" onClick={() => handleEditComment(comm.id, prompt('Chỉnh sửa bình luận', comm.content))}>Chỉnh sửa</a>
                    <a className="delete" onClick={() => handleDeleteComment(comm.id)}>Xóa</a>
                    <a className="reply" onClick={() => setReplyTo(comm.id)}>Trả lời</a>
                  </div>

                  {comm.replies && comm.replies.length > 0 && (
                    <div className="comments">
                      {comm.replies.map((reply, idx) => (
                        <div key={idx} className="comment">
                        
                          <div className="content">
                            <a className="author">{reply.author}</a>
                            <div className="metadata">
                              <span className="date">{reply.timestamp}</span>
                            </div>
                            <div className="text">{reply.content}</div>
                            <div className="actions">
                              <a className="delete" onClick={() => handleDeleteReply(comm.id, idx)}>Xóa</a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Nút tải thêm bình luận */}
            {comments.length > visibleComments && (
              <button onClick={loadMoreComments} className="load-more-btn">
                Xem thêm bình luận
              </button>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterDetail;
