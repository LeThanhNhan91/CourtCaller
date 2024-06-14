import { memo, useState } from "react";
import newImg from "assets/users/images/featured/news.jpg";
import "./style.scss"

const NewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const news = [
    {
      heading: "News 1",
      information: "brief information 1",
      img: newImg,
    },
    {
      heading: "News 2",
      information: "brief information 2",
      img: newImg,
    },
    {
      heading: "News 3",
      information: "brief information 3",
      img: newImg,
    },
    {
      heading: "News 4",
      information: "brief information 4",
      img: newImg,
    },
    {
      heading: "News 5",
      information: "brief information 5",
      img: newImg,
    },
    {
      heading: "News 6",
      information: "brief information 6",
      img: newImg,
    },
    {
      heading: "News 7",
      information: "brief information 7",
      img: newImg,
    },
    {
      heading: "News 8",
      information: "brief information 8",
      img: newImg,
    },
    {
      heading: "News 9",
      information: "brief information 9",
      img: newImg,
    }
  ];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const displayNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
      <div className="view_news">
      <h1>News Page</h1>
        <div className="row news_container">
          {displayNews.map((news, index) => (
            <div className="news_details col-lg-3 col-md-4 col-sm-6" key={index}>
              <img src={news.img} alt="News Image" />
              <h1>{news.heading}</h1>
              <p>{news.information}</p>
              <button>View</button>
            </div>
          ))}
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default memo(NewsPage);
