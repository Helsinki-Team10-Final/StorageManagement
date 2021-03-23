import {useQuery, gql} from '@apollo/client'
import { Table } from "react-bootstrap";
import {Link } from "react-router-dom"
import {GET_BROADCASTS_CHECKER, GET_BROADCASTS_PICKER} from "../config/queries"
import {useEffect} from 'react'


export default function ListPOK({type}) {
  const {loading, error, data, refetch } = useQuery(type === 'checker' ? GET_BROADCASTS_CHECKER : GET_BROADCASTS_PICKER, { variables: {access_token: localStorage.getItem('access_token')}})

  useEffect(() => {
    refetch()
  }, [])

  if (loading) {
    return (
      <h1>Loading...</h1>
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
      <div style={{height: '73vh', overflowY: 'auto'}}>
        {/* { data && JSON.stringify(data.broadcastPicker.broadcasts[0])} */}
        <Table className="text-center" responsive="md">
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
                <tr key={el.StoreReq._id}>
                  <td>{el.StoreReq._id}</td>
                  <td>{el.StoreReq.storeName}</td>
                  <td>{new Date(el.StoreReq.createdAt).toLocaleString().slice(0,9)}</td>
                  <td style={{textTransform:"capitalize"}}>{el.StoreReq.status}</td>
                  <td>
                    <Link to={`/main/picking/${el._id}`}>Check PO</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      {/* {
        data.broadcastChecker.unfinishedBroadcast && (
          <>
            <Link className="btn btn-primary" to={`/main/checking/${data.broadcastChecker.unfinishedBroadcast._id}`}>Back to previous check</Link>
          </>
        )
      } */}
    </div>
    </>
  )

  return (
    <>
    <div>
      <div className="mb-5">
        <h1 className="col-md-4">List Broadcast</h1>
      </div>
      <div style={{height: '73vh', overflowY: 'auto'}}>
        <Table className="text-center" responsive="md">
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
        </Table>
      </div>
      {
        data.broadcastChecker.unfinishedBroadcast && (
          <>
            <Link className="btn btn-primary" to={`/main/checking/${data.broadcastChecker.unfinishedBroadcast._id}`}>Back to previous check</Link>
          </>
        )
      }
    </div>
    </>
  )
}