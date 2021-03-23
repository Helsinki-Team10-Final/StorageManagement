import {useQuery, useMutation} from '@apollo/client'
import {useParams} from 'react-router-dom'
import { GET_PO, GET_DETAIL_PO, CREATE_BROADCAST_CHECKER } from "../config/queries";
import QRCode from 'qrcode.react'
import { toast } from 'react-toastify';
import {
  Table
} from "react-bootstrap";
import {useHistory} from 'react-router-dom'

export default function ListPOK(props) {
  const history = useHistory()
  const {id} = useParams()
  const {loading, error, data} = useQuery(GET_DETAIL_PO, {variables: {id}})
  const [createBroadcastChecker, {data: createdBroadcast}] = useMutation(CREATE_BROADCAST_CHECKER)

  const createBroadcast = () => {
    console.log("creating")
    createBroadcastChecker({
      variables: {
        idPO: data.purchasingOrderById._id,
        access_token: localStorage.getItem('access_token')
      }, 
      refetchQueries: [
        {
          query: GET_PO
        }
      ]
    }).catch((err) => {
      console.log(err.graphQLErrors)
    })
    toast.success('📦 PO was successfully broadcasted')
    history.push('/main')
  }

  if (loading) {
    return (
      <h1>Loading...</h1>
    )
  } else if (error) {
    return <h1>Error..</h1>
  }
  // console.log(data.purchasingOrderById)

  return (
    <>
      <div>
        <div className="mb-5 row d-flex align-items-center">
          <h1 className="col-md-4">PO Detail</h1>
          <h3 className="col-md-6">ID: {id}</h3>
        </div>
        <div className="mb-5" style={{height: '70vh', overflowY: 'auto'}}>
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
          {
            data.purchasingOrderById.status === 'process' && 
            <>
              <div className="row">
                  <button onClick={createBroadcast} className="btn btn-primary mx-3">Accept PO</button>
                  <button className="btn btn-primary mx-3">Reject PO</button>
              </div>
            </>
          }
      </div>
    </>
  )
}