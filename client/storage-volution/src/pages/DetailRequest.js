import {useQuery, useMutation} from '@apollo/client'
import {useParams, Link} from 'react-router-dom'
import { GET_REQUEST_DETAIL } from "../config/queries";
import { toast } from 'react-toastify';
import {
  Table
} from "react-bootstrap";

export default function ListPOK(props) {
  const role = localStorage.getItem("role")
  const {id} = useParams()
  const {loading, error, data} = useQuery(GET_REQUEST_DETAIL, {variables: {id}})

  if (loading) {
    return (
      <h1>Loading...</h1>
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
        <div className="mb-5" style={{height: '70vh', overflowY: 'auto'}}>
          {/* {JSON.stringify(data)} */}
          <Table className="text-center" responsive="md">
            <thead>
              <tr>
                <th>Item</th>
                <th>Request Quantity</th>
                <th>Storage Quantity</th>
              </tr>
            </thead>
            <tbody>
              {
                data && data.requestById.items.map(item => {
                  return (
                    <>
                      <tr>
                        <td className="align-middle" style={{textTransform:"capitalize"}}>{item.itemName}</td>
                        <td className="align-middle">{item.quantityRequest}</td>
                        <td className="align-middle">{item.storageQuantity}</td>
                      </tr>
                    </>
                  )
                })
              }
              
            </tbody>
          </Table>
        </div>
          {
            data.requestById.status === 'process' && role === "warehouseadmin" && 
            <>
              <div className="row">
                  <Link to={`/main/request/createBroadcast/${id}`} className="btn btn-primary mx-3">Accept Request</Link>
                  <button className="btn btn-primary mx-3">Reject Request</button>
              </div>
            </>
          }
      </div>
    </>
  )
}