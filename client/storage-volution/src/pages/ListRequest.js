import {useQuery} from '@apollo/client'
import { GET_REQUESTS } from "../config/queries";
import Loading from "../components/Loading";
import { Table } from "react-bootstrap";
import {useHistory } from "react-router-dom"
import React, { useState, useEffect } from "react";
import { MDBDataTableV5, MDBBtn, MDBBadge } from 'mdbreact';
import _ from 'lodash'

export default function ListPOK(props) {
  const history = useHistory()
  const { data, loading, error } = useQuery(GET_REQUESTS);

  const [datatable, setDatatable] = React.useState({
    columns: [
      {
        label: "ID",
        field: "id",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "ID",
        },
      },
      {
        label: "Store",
        field: "store",
        width: 270,
      },
      {
        label: "Created",
        field: "created",
        sort: "asc",
        width: 200,
      },
      {
        label: "Status",
        field: "status",
        width: 100,
      },
      {
        label: "",
        field: "action",
        sort: "disabled",
        width: 150,
      },
    ],
    rows: [],
  });

  useEffect(() => {
    if (data) {
      // console.log(data, "data<<<<<<<<<<<<<<<<")
      const filterData = data.requests.map((request) => {
        let obj = {
          id: request._id,
          store: _.capitalize(request.storeName),
          created: new Date(request.createdAt).toLocaleString(),
          status: <h5 style={{margin: 0}}><MDBBadge style={{textTransform: "capitalize"}} color={setStatusBadge(request.status)}>{request.status}</MDBBadge></h5>,
          action: <MDBBtn
            rounded
            color="mdb-color"
            size="sm"
            onClick={() => {
              history.push(`/main/request/${request._id}`);
            }}
          >
            Detail
          </MDBBtn>,
        };
        return obj;
      });
      console.log(filterData, "filter");
      setDatatable({ ...datatable, rows: [...filterData] });
    }
  }, [data]);

  const setStatusBadge = (status) => {
    switch (status) {
      case "process":
        return "default"
      case "picking":
        return "primary"
      case "picked":
        return "success"
      case "rejected":
        return "danger"
      default:
        return "light"
    }
  }

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <h1>Error..</h1>
  }


  return (
    <>
      <div>
        <div className="mb-5">
          <h1 className="col-md-4">List Request</h1>
        </div>
        <MDBDataTableV5
          hover
          entriesOptions={[5, 10, 15]}
          entries={5}
          pagesAmount={4}
          data={datatable}
          pagingTop
          searchTop
          searchBottom={false}
          striped="dark"
        />
      </div>
    </>
  );
}