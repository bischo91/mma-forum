import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { PropTypes } from "prop-types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Box,
  Button,
} from "@mui/material/";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";

const descendingComparator = (a, b, orderBy) => {
  // console.log(a[orderBy].toLowerCase());
  if (b[orderBy]?.toLowerCase() < a[orderBy]?.toLowerCase()) {
    return -1;
  }
  if (b[orderBy]?.toLowerCase() > a[orderBy]?.toLowerCase()) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  {
    id: "title",
    numeric: false,
    label: "Title",
  },
  {
    id: "authorName",
    numeric: false,
    label: "Author",
  },
  {
    id: "timestamp",
    numeric: true,
    label: "Time",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function ViewPostList({ category }) {
  const [contentList, setContentList] = useState([]);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const navigate = useNavigate();
  const collectionRef = collection(db, "forum-" + category);

  const uid = auth.currentUser ? auth.currentUser.uid : "";

  const getContent = async () => {
    const data = await getDocs(collectionRef);
    setContentList(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        authorName: doc.data().author.name,
      }))
    );
  };

  const deleteContent = async (id) => {
    const contentDoc = doc(db, "forum-" + category, id);
    await deleteDoc(contentDoc);
    getContent();
  };

  useEffect(() => {
    getContent();
  }, [category]);

  const handleRequestSort = (event, property) => {
    console.log(property);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    console.log("test");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contentList.length) : 0;

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={"small"}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 contentList.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(contentList, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => {
                          handleClick(event, row.title);
                        }}
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          style={{ height: "2rem" }}
                        >
                          <Link to={`/${category}/${row.id}`}>{row.title}</Link>
                          {uid === row.author.id && (
                            <IconButton>
                              <DeleteIcon
                                onClick={() => deleteContent(row.id)}
                                style={{ fontSize: 15 }}
                              />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell align="left" padding="none">
                          {row.author.name}
                        </TableCell>
                        <TableCell align="right" padding="none">
                          {row.timestamp}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 33 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={contentList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Button
            variant="contained"
            onClick={() => {
              navigate(`/${category}/createpost`);
            }}
          >
            Post
          </Button>
        </Paper>
      </Box>
    </div>
  );
}

// state={{ forumType: "forum-general", from: "general" }}
