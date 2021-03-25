import {useQuery, useMutation} from '@apollo/client'
import {useParams, Link} from 'react-router-dom'
import { GET_REQUEST_DETAIL } from "../config/queries";
import { toast } from 'react-toastify';
import {
  Table
} from "react-bootstrap";
import Loading from '../components/Loading';
 import React, { useState, useEffect } from "react";
import { MDBDataTableV5 } from "mdbreact";

export default function ListPOK(props) {
  const role = localStorage.getItem("role")
  const {id} = useParams()
  const {loading, error, data} = useQuery(GET_REQUEST_DETAIL, {variables: {id}})

const [datatable, setDatatable] = React.useState({
  columns: [
    {
      label: "Item",
      field: "item",
      width: 150,
      attributes: {
        "aria-controls": "DataTable",
        "aria-label": "ID",
      },
    },
    {
      label: "Request Quantity (Box)",
      field: "requestQuantity",
      width: 270,
    },
    {
      label: "Storage Quantity (Box)",
      field: "storageQuantity",
      sort: "desc",
      width: 200,
    },
  ],
  rows: [],
});

useEffect(() => {
  if (data) {
    // console.log(data, "data<<<<<<<<<<<<<<<<")
    const filterData = data.requestById.items.map((item) => {
      let obj = {
        item: item.itemName[0].toUpperCase() + item.itemName.slice(1),
        requestQuantity: item.quantityRequest,
        storageQuantity: item.storageQuantity,
      };
      return obj;
    });
    console.log(filterData, "filter");
    setDatatable({ ...datatable, rows: [...filterData] });
  }
}, [data]);
  
  console.log(data, "<<<<<<<<<<<<<<<<<<<<<<< data")
  if (loading) {
    return (
      <Loading/>
      )
    } else if (error) {
      console.log(error.graphQLErrors)
      return <h1>Error..</h1>
    }
    // console.log(data.purchasingOrderById)
  console.log(data.requestById.status)

  return (
    <>
      <div>
        <div className="mb-5 row d-flex align-items-center">
          <h1 className="col-md-4">Request Detail</h1>
          <h3 className="col-md-6">ID: {id}</h3>
        </div>
        <div>
          {/* {JSON.stringify(data)} */}
          <MDBDataTableV5
            hover
            entriesOptions={[5, 20, 25]}
            entries={5}
            pagesAmount={4}
            data={datatable}
            pagingTop
            searchTop
            searchBottom={false}
            striped="dark"
          />
        </div>
        {data.requestById.status === "process" && role === "warehouseadmin" && (
          <>
            <div className="row">
              <Link to={`/main/request/createBroadcast/${id}`} className="btn btn-primary mx-3">
                Accept Request
              </Link>
              <button className="btn btn-primary mx-3">Reject Request</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}