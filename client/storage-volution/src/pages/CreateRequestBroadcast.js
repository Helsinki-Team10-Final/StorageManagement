import { useHistory, useParams } from 'react-router-dom'
import {Form, Button, Container} from 'react-bootstrap'
import { GET_REQUEST_WITH_PO } from "../config/queries"
import { useQuery, useMutation, gql } from '@apollo/client'
import {useState, useEffect} from 'react'

export default function CreateRequestBroadcast (props) {
  const history = useHistory()
  const {id} = useParams()
  const {data, loading, error} = useQuery(GET_REQUEST_WITH_PO, {variables: {id, access_token: localStorage.getItem('access_token')}})
  const [itemsPO, setItemsPO] = useState({})
  const [itemsPOTemp, setIiemsPOTemp] = useState({})

  useEffect (() => {
    if (data) {
      data.requestsWithPO.dropdown.map((item) => {
        console.log(item)
      })
    }
  }, [data])
  
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
          <Form>
            <Form.Row>
              <Form.Group className="col-md-3" >
                <Form.Label><h5><i className="fa fa-user"/> Store Name</h5></Form.Label>
                <Form.Control readOnly value={data.requestsWithPO.request.storeName} type="text" />
              </Form.Group>
            </Form.Row>
            <Form.Label><h5><i className="fa fa-user"/> Items</h5></Form.Label>
              {
                data.requestsWithPO.request.items.map((item) => {
                  return (
                    <>
                      <Form.Group className="col" >
                        <Form.Label className="my-3"><h5><i className="fa fa-user"/> {item.itemName} - {item.quantityRequest} Box</h5></Form.Label>
                        <Form.Row>
                          <Form.Group className="col-md-3" >
                            <Form.Label><h5><i className="fa fa-user"/> PO ID</h5></Form.Label>
                            <Form.Control as="select">
                              <option value="Test">Test</option>
                              </Form.Control>
                          </Form.Group>
                          <Form.Group className="col-md-3" >
                            <Form.Label><h5><i className="fa fa-user"/> PO Quantity</h5></Form.Label>
                            <Form.Control readOnly value="10"type="number" />
                          </Form.Group>
                          <Form.Group className="col-md-3" >
                            <Form.Label><h5><i className="fa fa-user"/> Quantity</h5></Form.Label>
                            <Form.Control type="number" />
                          </Form.Group>
                          <Form.Group className="col-md-3" >
                            <br/>
                            <Button className="mt-3">+</Button>
                          </Form.Group>
                        </Form.Row>
                      </Form.Group>
                    </>
                  )
                })
              }
              

          </Form>
        </div>
      </div>
    </>
  )
}