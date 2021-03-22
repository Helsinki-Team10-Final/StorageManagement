import {useQuery, gql} from '@apollo/client'
import { GET_PO } from "../config/queries";
import Loading from "../components/Loading";
import { Table } from "react-bootstrap";
import {Link } from "react-router-dom"

export default function ListPOK(props) {
  const { data, loading, error } = useQuery(GET_PO);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <h1>Error..</h1>
  }


  return (
    <>
    <div>
        <div className="mb-5">
          <h1 className="col-md-4">List PO</h1>
        </div>
      <Table className="text-center" responsive="md">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vendor</th>
            <th>Created</th>
            <th>Status</th>
            <th>Buyer's Name</th>
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
                <td>pak rozak</td>
                <td>
                  <Link to={`/main/${el._id}`}>Detail</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
    </>
  );
}