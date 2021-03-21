import {useQuery, gql} from '@apollo/client'
import {useParams, useHistory, Link} from 'react-router-dom'
import QRCode from 'qrcode.react'
import { toast } from 'react-toastify';
import {
  Table
} from "react-bootstrap";

const GET_DETAIL_PO = gql`
  query getPObyId ($id: ID!){
    purchasingOrderById(id: $id) {
      _id,
      vendorName,
      items {
        name,
        quantity
      }
      status
    }
  }

`;

export default function ListPOK(props) {
  const {id} = useParams()
  const {loading, error, data} = useQuery(GET_DETAIL_PO, {variables: {id}})
  console.log(data)

  if (loading) {
    return (
      <h1>Loading...</h1>
    )
  } else if (error) {
    return <h1>Error..</h1>
  }
  console.log(data)


  return (
    <>
      <div>
        <div className="mb-5 row d-flex align-items-center">
          <h1 className="col-md-4">PO Detail</h1>
          <h3 className="col-md-6">ID: {id}</h3>
        </div>
      <Table className="text-center" responsive="md">
        <thead>
          <tr>
            <th>QR Code</th>
            <th>Item</th>
            <th>PO Quantity</th>
            <th>Actual Quantity</th>
          </tr>
        </thead>
        <tbody>
          {
            data && data.purchasingOrderById.items.map(item => {
              return (
                <>
                  <tr>
                    <td className="align-middle">
                      <QRCode value={JSON.stringify({_id: data.purchasingOrderById._id, name: item.name.toLowerCase()})} />
                    </td>
                    <td className="align-middle">{item.name}</td>
                    <td className="align-middle">{item.quantity}</td>
                    <td className="align-middle">{item.currentQuantity ? item.currentQuantity : 0}</td>
                  </tr>
                </>
              )
            })
          }
          
        </tbody>
      </Table>
      </div>
    </>
  )
}