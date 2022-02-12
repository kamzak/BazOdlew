import React from "react";
import classes from "./Pagination.module.css";

const Pagination = ({ recPerPage, totalRecs, paginate, currentPage }) => {
  const recNumbers = [];

  for (let i = 1; i <= Math.ceil(totalRecs / recPerPage); i++) {
    recNumbers.push(i);
  }

  return (
    <nav className={`${classes.pagin} d-flex`}>
      <ul className="pagination mx-auto">
        <li
          className={currentPage === 1 ? "page-item active" : "page-item"}
          key="first"
        >
          <a
            className="page-link"
            style={{ cursor: "pointer", borderRight: "1px solid #126E82" }}
            onClick={() => paginate(1)}
          >
            Pierwsza
          </a>
        </li>
        {recNumbers.map((number) => (
          <li
            key={number}
            className={
              currentPage === number ? "page-item active" : "page-item"
            }
          >
            <a
              onClick={() => paginate(number)}
              className="page-link"
              style={{
                cursor: "pointer",
                borderRight: "1px solid #126E82",
                borderLeft: "1px solid #126E82",
              }}
            >
              {number}
            </a>
          </li>
        ))}
        <li
          className={
            currentPage === Math.ceil(totalRecs / recPerPage)
              ? "page-item active"
              : "page-item"
          }
          key="last"
        >
          <a
            className="page-link"
            style={{ cursor: "pointer", borderLeft: "1px solid #126E82" }}
            onClick={() => paginate(Math.ceil(totalRecs / recPerPage))}
          >
            Ostatnia
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
