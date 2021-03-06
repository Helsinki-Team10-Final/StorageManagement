import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { PO_HISTORY } from "../config/queries";
 import React, { useState, useEffect } from "react";
 import { MDBDataTableV5, MDBBadge } from "mdbreact";
import Loading from "../components/Loading";
import { Button } from "react-bootstrap";

export default function History () {
  const { id } = useParams();
  const { loading, error, data } = useQuery(PO_HISTORY, { variables: { input: id } });

  const [datatable, setDatatable] = React.useState({
    columns: [
      {
        label: "ID User",
        field: "idUser",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "ID",
        },
      },
      {
        label: "PIC",
        field: "pic",
        width: 270,
      },
      {
        label: "Role",
        field: "role",
        width: 200,
      },
      {
        label: "Status",
        field: "status",
        sort: "desc",
        width: 200,
      },
      {
        label: "Date",
        field: "date",
        width: 100,
      },
    ],
    rows: [],
  });

  useEffect(() => {
    if (data) {
      // console.log(data, "data<<<<<<<<<<<<<<<<")
      const filterData = data.poHistoriesByPoId.map((history) => {
        let obj = {
          idUser: history.user._id,
          pic: history.user.name,
          role: history.user.role,
          status: <h5 style={{margin: 0}}><MDBBadge style={{textTransform: "capitalize"}} color={setStatusBadge(history.status)}>{history.status}</MDBBadge></h5>,
          date: new Date(history.createdAt).toLocaleString(),
        };
        return obj;
      });
      console.log(filterData, "filter");
      setDatatable({ ...datatable, rows: [...filterData] });
    }
  }, [data]);

  const printTable = (id) => {
    var tmp = document.createDocumentFragment(),
      source = document.getElementById(id).cloneNode(true);
    while (document.body.firstChild) {
      tmp.appendChild(document.body.firstChild);
    }

    document.body.appendChild(source);

    window.print();

    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    document.body.appendChild(tmp);
  };

const setStatusBadge = (status) => {
  switch (status) {
    case "process":
      return "info";
    case "checking":
      return "secondary";
    case "clear":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "light";
  }
};

if (loading) {
  return <Loading />;
} else if (error) {
  return <h1>Error..</h1>;
}
  return (
    <>
      <div id="print">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h5>Name: {data.poHistoriesByPoId[0].vendorName}</h5>
            <h5>ID: {id}</h5>
          </div>
          <h2>History</h2>
        </div>
        <hr/>
        <MDBDataTableV5
        
          hover
          entriesOptions={[5, 20, 25]}
          entries={5}
          pagesAmount={4}
          data={datatable}
          pagingTop
          searchTop
          searchBottom={false}
          striped
        />
      </div>
        <Button onClick={() => printTable("print")}>Print</Button>
    </>
  );
}