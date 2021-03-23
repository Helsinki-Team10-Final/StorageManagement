import {useQuery} from '@apollo/client'
import { GET_REQUESTS } from "../config/queries";
import Loading from "../components/Loading";
import { Table } from "react-bootstrap";
import {Link } from "react-router-dom"

export default function ListPOK(props) {
  const { data, loading, error } = useQuery(GET_REQUESTS);

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
        {/* {JSON.stringify(data)} */}
      <Table className="text-center" responsive="md">
        <thead>
          <tr>
            <th>ID</th>
            <th>Store</th>
            <th>Created</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.requests.map((el) => {
            return (
              <tr key={el._id}>
                <td>{el._id}</td>
                <td style={{textTransform:"capitalize"}}>{el.storeName}</td>
                <td>{new Date(el.createdAt).toLocaleString().slice(0,9)}</td>
                <td style={{textTransform:"capitalize"}}>{el.status}</td>
                <td>
                  <Link to={`/main/request/${el._id}`}>Detail</Link>
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