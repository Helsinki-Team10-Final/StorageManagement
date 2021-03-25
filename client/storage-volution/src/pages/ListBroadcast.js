import {useQuery, gql} from '@apollo/client'
import {Link, useHistory } from "react-router-dom"
import {GET_BROADCASTS_CHECKER, GET_BROADCASTS_PICKER} from "../config/queries"
import React, { useState, useEffect } from "react";
import { MDBDataTableV5, MDBBtn, MDBBadge, MDBTypography, MDBBox} from "mdbreact";
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
    if (data && type === "checker") {
      console.log(data, "data<<<<<<<<<<<<<<<<")
      const filterData = data.broadcastChecker.broadcasts.map((broadcast) => {
        let obj = {
          broadcastID: broadcast._id,
          vendor: broadcast.purchasingOrder.vendorName,
          created: new Date(broadcast.purchasingOrder.createdAt).toLocaleString().slice(0, 9),
          status: <h5 style={{margin: 0}}><MDBBadge style={{textTransform: "capitalize"}} color={setStatusBadge(broadcast.purchasingOrder.status)}>{broadcast.purchasingOrder.status}</MDBBadge></h5>,
          action: (
            <MDBBtn
              rounded
              color="mdb-color"
              size="sm"
              onClick={() => {
                history.push(`/main/checking/${broadcast._id}`);
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
  if (data && type === "picker") {
    // console.log(data, "data<<<<<<<<<<<<<<<<")
    const filterData = data.broadcastPicker.broadcasts.map((broadcast) => {
      let obj = {
        broadcastID: broadcast._id,
        storeName: broadcast.StoreReq.storeName,
        created: new Date(broadcast.StoreReq.createdAt).toLocaleString().slice(0, 9),
        status: <h5 style={{margin: 0}}><MDBBadge style={{textTransform: "capitalize"}} color={setStatusBadge(broadcast.StoreReq.status)}>{broadcast.StoreReq.status}</MDBBadge></h5>,
        action: <Link to={`/main/picking/${broadcast._id}`}>Pick Request</Link>,
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

  const setStatusBadge = (status) => {
    switch (status) {
      case "checking":
        return "primary"
      case "picking":
        return "secondary"
      default:
        return "light"
    }
  }

  if (loading) {
    return (
      <Loading/>
    )
  } else if (error) {
    return <h1>Error..</h1>
  }

  if (type === "picker") return (
    <>
      <div>
        <div className="mb-5">
          <h2 className="col-md-4">List Broadcast</h2>
        </div>
        {data.broadcastPicker.unfinishedBroadcast && (
          <>
            <MDBTypography blockquote bqColor='danger'>
              <MDBBox tag='p' mb={0} className='bq-title'>
                You Have Unfinished Task
              </MDBBox>
              <p style={{margin: 0}}>
                Please finish your existing task first before picking a new task.
              </p>
            <Link className="btn btn-primary btn" to={`/main/picking/${data.broadcastPicker.unfinishedBroadcast._id}`}>
              Back to previous Task
            </Link>
            </MDBTypography>
          </>
        )}
        <div>
          <MDBDataTableV5
            hover
            entriesOptions={[5, 10, 15]}
            entries={5}
            pagesAmount={4}
            data={datatable2}
            pagingTop
            searchTop
            searchBottom={false}
            striped="dark"
          />
        </div>
      </div>
    </>
  )

  return (
    <>
      <div>
        <div className="mb-5">
          <h2 className="col-md-4">List Broadcast</h2>
        </div>
        <div>
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