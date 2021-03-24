import {useQuery, gql} from '@apollo/client'
import { GET_PO } from "../config/queries";
import Loading from "../components/Loading";
import { Table } from "react-bootstrap";
import {Link } from "react-router-dom"
 import React, { useState, useEffect } from "react";
import { MDBDataTableV5 } from 'mdbreact';

export default function ListPOK(props) {
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
        width: 100,
      },
      {
        label: "",
        field: "action",
        sort: "disabled",
        width: 150,
      },
    ],
    rows: []
  });

  useEffect(() => {
    if (data) {
      // console.log(data, "data<<<<<<<<<<<<<<<<")
      const filterData = data.purchasingOrders.map((po) => {
        let obj = {
          id: po._id,
          vendor: po.vendorName,
          created: new Date(po.createdAt).toLocaleString(),
          status: po.status,
          action: <Link to={`/main/${po._id}`}>Detail</Link>,
        };
        return obj;
      });
      console.log(filterData, "filter");
      setDatatable({ ...datatable, rows: [...filterData] });
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <h1>Error..</h1>;
  }

  return (
    <>
      <div>
        <div className="mb-5">
          <h1 className="col-md-4">List PO</h1>
        </div>
        {/* <MDBDataTableV5 hover entriesOptions={[10, 15, 20]} entries={10} pagesAmount={4} data={datatable} striped />; */}
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
        {/* <Table className="text-center" responsive="md">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vendor</th>
            <th>Created</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.purchasingOrders.map((el) => {
            return (
              <tr key={el._id}>
                <td>{el._id}</td>
                <td>{el.vendorName}</td>
                <td>{new Date(el.createdAt).toLocaleString().slice(0,9)}</td>
                <td style={{textTransform:"capitalize"}}>{el.status}</td>
                <td>
                  <Link to={`/main/${el._id}`}>Detail</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table> */}
      </div>
    </>
  );
}