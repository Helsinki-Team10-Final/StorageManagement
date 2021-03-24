import {useQuery, gql} from '@apollo/client'
import { Table } from "react-bootstrap";
import {Link, useHistory } from "react-router-dom"
import {GET_BROADCASTS_CHECKER, GET_BROADCASTS_PICKER} from "../config/queries"
import React, { useState, useEffect } from "react";
import { MDBDataTableV5, MDBBtn } from "mdbreact";
import Loading from '../components/Loading';

export default function ListPOK({type}) {
  const history = useHistory()
  const {loading, error, data, refetch } = useQuery(type === 'checker' ? GET_BROADCASTS_CHECKER : GET_BROADCASTS_PICKER, { variables: {access_token: localStorage.getItem('access_token')}})
  
  const [datatable, setDatatable] = React.useState({
    columns: [
      {
        label: "Broadcast ID",
        field: "broadcastID",
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
    if (data && type === "checker") {
      console.log(data, "data<<<<<<<<<<<<<<<<")
      const filterData = data.broadcastChecker.broadcasts.map((po) => {
        let obj = {
          broadcastID: po._id,
          vendor: po.purchasingOrder.vendorName,
          created: new Date(po.purchasingOrder.createdAt).toLocaleString().slice(0, 9),
          status: po.purchasingOrder.status,
          action: (
            <MDBBtn
              rounded
              color="mdb-color"
              size="sm"
              onClick={() => {
                history.push(`/main/checking/${po._id}`);
              }}
            >
              Check PO
            </MDBBtn>
          ),
        };
        return obj;
      });
      console.log(filterData, "filter");
      setDatatable({ ...datatable, rows: [...filterData] });
    }
  }, [data]);

  const [datatable2, setDatatable2] = React.useState({
    columns: [
      {
        label: "Broadcast ID",
        field: "broadcastID",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "ID",
        },
      },
      {
        label: "Store Name",
        field: "storeName",
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
  if (data && type === "picker") {
    // console.log(data, "data<<<<<<<<<<<<<<<<")
    const filterData = data.broadcastPicker.broadcasts.map((po) => {
      let obj = {
        broadcastID: po._id,
        storeName: po.StoreReq.storeName,
        created: new Date(po.StoreReq.createdAt).toLocaleString().slice(0, 9),
        status: po.StoreReq.status,
        action: <Link to={`/main/picking/${po._id}`}>Pick Request</Link>,
      };
      return obj;
    });
    console.log(filterData, "filter");
    setDatatable2({ ...datatable2, rows: [...filterData] });
  }
}, [data]);

  useEffect(() => {
    refetch()
  }, [])

  if (loading) {
    return (
      <Loading/>
    )
  } else if (error) {
    return <h1>Error..</h1>
  }

    // <>
    //   <h1 className="mb-3">List Broadcast</h1>
    //   {JSON.stringify(data.broadcastChecker)}
    // </>

  if (type === "picker") return (
    <>
      <div>
        <div className="mb-5">
          <h1 className="col-md-4">List Broadcast</h1>
        </div>
        <div style={{ height: "73vh", overflowY: "auto" }}>
          {data && JSON.stringify(data.broadcastPicker.broadcasts[0])}
          <MDBDataTableV5 hover entriesOptions={[10, 15, 20]} entries={10} pagesAmount={4} data={datatable2} />;
          {/* <Table className="text-center" responsive="md">
          <thead>
            <tr>
              <th>Boadcast ID</th>
              <th>Store Name</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {data.broadcastPicker.broadcasts.map((el) => {
              return (
                <tr key={el._id}>
                  <td>{el._id}</td>
                  <td style={{textTransform:"capitalize"}}>{el.StoreReq.storeName}</td>
                  <td>{new Date(el.StoreReq.createdAt).toLocaleString().slice(0,9)}</td>
                  <td style={{textTransform:"capitalize"}}>{el.StoreReq.status}</td>
                  <td>
                    <Link to={`/main/picking/${el._id}`}>Pick Request</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table> */}
        </div>
        {data.broadcastPicker.unfinishedBroadcast && (
          <>
            <Link className="btn btn-primary" to={`/main/picking/${data.broadcastPicker.unfinishedBroadcast._id}`}>
              Back to previous Task
            </Link>
          </>
        )}
      </div>
    </>
  )

  return (
    <>
      <div>
        <div className="mb-5">
          <h1 className="col-md-4">List Broadcast</h1>
        </div>
        <div style={{ height: "73vh", overflowY: "auto" }}>
          <MDBDataTableV5 hover entriesOptions={[10, 15, 20]} entries={10} pagesAmount={4} data={datatable} />;
          {/* <Table className="text-center" responsive="md">
          <thead>
            <tr>
              <th>Boadcast ID</th>
              <th>Vendor</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {data.broadcastChecker.broadcasts.map((el) => {
              return (
                <tr key={el._id}>
                  <td>{el._id}</td>
                  <td>{el.purchasingOrder.vendorName}</td>
                  <td>{new Date(el.purchasingOrder.createdAt).toLocaleString().slice(0,9)}</td>
                  <td style={{textTransform:"capitalize"}}>{el.purchasingOrder.status}</td>
                  <td>
                    <Link to={`/main/checking/${el._id}`}>Check PO</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table> */}
        </div>
        {data.broadcastChecker.unfinishedBroadcast && (
          <>
            <Link className="btn btn-primary" to={`/main/checking/${data.broadcastChecker.unfinishedBroadcast._id}`}>
              Back to previous check
            </Link>
          </>
        )}
      </div>
    </>
  );
}