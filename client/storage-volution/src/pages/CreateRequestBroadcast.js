import { useHistory, useParams } from 'react-router-dom'
import {Form, Button, Container} from 'react-bootstrap'
import { GET_REQUEST_WITH_PO } from "../config/queries"
import { useQuery, useMutation, gql } from '@apollo/client'

export default function CreateRequestBroadcast (props) {
  const history = useHistory()
  const {id} = useParams()
  const {data, loading, error} = useQuery(GET_REQUEST_WITH_PO, {variables: {id, access_token: localStorage.getItem('access_token')}})

  if (loading) {
    return (
      <h1>Loading...</h1>
    )
  } else if (error) {
    console.log(error.graphQLErrors)
    return <h1>Error..</h1>
  }

  return (
    <>
      <div>
        <div className="mb-5 row d-flex align-items-center">
          <h1 className="col-md-4">Broadcast Request</h1>
          <h3 className="col-md-6">ID: {id}</h3>
        </div>
        <div>
          {JSON.stringify(data)}
        </div>
      </div>
    </>
  )
}