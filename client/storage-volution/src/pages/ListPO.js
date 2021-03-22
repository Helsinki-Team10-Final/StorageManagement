import { useQuery } from "@apollo/client"
import { GET_PO } from "../config/queries"
import Loading from "../components/Loading";
import { Table } from "react-bootstrap";

function ListPO() {
  const {data, loading, error} = useQuery(GET_PO)

if (loading) {
  return <Loading/>
}

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vendor</th>
            <th>Created</th>
            <th>Status</th>
            <th>Buyer's Name</th>
            <th>Action</th>
          </tr>
        </thead>
            
        <tbody>
          {data.purchasingOrders.map((el) => {
            return (
            <tr>
              <td key={el._id}>{el._id}</td>
              <td>{el.vendorName}</td>
              <td>tanggal</td>
              <td>{el.status}</td>
              <td>pak rozak</td>
              <td>detail</td>
            </tr>
          )})}
        </tbody>
      </Table>
    </>
  );
}

export default ListPO