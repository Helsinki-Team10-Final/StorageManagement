import {useQuery, gql} from '@apollo/client'
import { GET_PO } from "../config/queries";
import Loading from "../components/Loading";
import { Table } from "react-bootstrap";
import {useHistory } from "react-router-dom"
 import React, { useState, useEffect } from "react";
import { MDBDataTableV5, MDBBtn, MDBBadge } from 'mdbreact';

export default function ListPOK(props) {
  const history = useHistory()
  const { data, loading, error } = useQuery(GET_PO);
  const [dataPO, setDataPO] = useState([]);
  
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
        label: "Vendor",
        field: "vendor",
        width: 270,
      },
      {
        label: "Created",
        field: "created",
        sort: "desc",
        width: 200,
      },
      {
        label: "Status",
        field: "status",
        sort: "disabled",
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
      const filterData = data.purchasingOrders.map((po) => {
        let obj = {
          id: po._id,
          vendor: po.vendorName,
          created: new Date(po.createdAt).toLocaleString(),
          status: <h5 style={{margin: 0}}><MDBBadge style={{textTransform: "capitalize"}} color={setStatusBadge(po.status)}>{po.status}</MDBBadge></h5>,
          action: <MDBBtn
            rounded
            color="mdb-color"
            size="sm"
            onClick={() => {
              history.push(`/main/${po._id}`);
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
        return "info"
      case "checking":
        return "secondary"
      case "clear":
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
    return <h1>Error..</h1>;
  }

  return (
    <>
      <div>
        <div className="mb-5">
          <h1 className="col-md-4">Purchasing Orders</h1>
        </div>
        <MDBDataTableV5
          order={["created", "desc"]}
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