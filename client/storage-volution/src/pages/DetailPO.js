import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_PO, GET_DETAIL_PO, CREATE_BROADCAST_CHECKER } from "../config/queries";
import QRCode from "qrcode.react";
import { toast } from "react-toastify";
import { Button, Table } from "react-bootstrap";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function ListPOK(props) {
  const history = useHistory();
  const role = localStorage.getItem("role");
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_DETAIL_PO, { variables: { id } });
  const [createBroadcastChecker, { data: createdBroadcast }] = useMutation(CREATE_BROADCAST_CHECKER);

  const createBroadcast = () => {
    console.log("creating");
    createBroadcastChecker({
      variables: {
        idPO: data.purchasingOrderById._id,
        access_token: localStorage.getItem("access_token"),
      },
      refetchQueries: [
        {
          query: GET_PO,
        },
      ],
    }).catch((err) => {
      console.log(err.graphQLErrors);
    });
    toast.success("📦 PO was successfully broadcasted");
    history.push("/main");
  };

  function toHistory() {
    history.push(`/main/history/${id}`)
  }

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (error) {
    return <h1>Error..</h1>;
  }
  // console.log(data.purchasingOrderById)

  return (
    <>
      <div>
        <div className="mb-5 row d-flex align-items-center">
          <h2 className="col-md-4">Purchasing Order Detail</h2>
          <h5 className="col-md-6">ID: {id}</h5>
        <Button onClick={toHistory}>History</Button>
        </div>
        <div className="mb-5" style={{ height: "67vh", overflowY: "auto" }}>
          <MDBTable className="text-center" responsive="md">
            <MDBTableHead>
              <tr>
                <th style={{ fontWeight: 600 }}>QR Code</th>
                <th style={{ fontWeight: 600 }}>Item</th>
                <th style={{ fontWeight: 600 }}>PO Quantity</th>
                <th style={{ fontWeight: 600 }}>Actual Quantity</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {data &&
                data.purchasingOrderById.items.map((item) => {
                  return (
                    <>
                      <tr>
                        <td style={{ fontWeight: 400 }} className="align-middle">
                          <QRCode value={JSON.stringify({ _id: data.purchasingOrderById._id, name: item.name.toLowerCase() })} />
                        </td>
                        <td style={{ fontWeight: 400, textTransform: "capitalize" }} className="align-middle">
                          {item.name}
                        </td>
                        <td style={{ fontWeight: 400, textTransform: "capitalize" }} className="align-middle">
                          {item.quantity}
                        </td>
                        <td style={{ fontWeight: 400, textTransform: "capitalize" }} className="align-middle">
                          {item.currentQuantity ? item.currentQuantity : 0}
                        </td>
                      </tr>
                    </>
                  );
                })}
            </MDBTableBody>
          </MDBTable>
        </div>
        {data.purchasingOrderById.status === "process" && role === "warehouseadmin" && (
          <>
            <div className="row">
              <button onClick={createBroadcast} className="btn btn-primary mx-3">
                Accept PO
              </button>
              <button className="btn btn-primary mx-3">Reject PO</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
