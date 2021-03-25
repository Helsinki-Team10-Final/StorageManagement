import {Form, Button, Container} from 'react-bootstrap'
import { GET_BROADCAST_CHECKER_BY_ID, SUBMIT_CHECKER } from "../config/queries";
import { useQuery, useMutation, gql } from '@apollo/client'
import {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { MDBRow, MDBInput, MDBBtn } from 'mdbreact';


export default function CreatePO(props) {
  const history = useHistory()
  const {id} = useParams()
  const {data, loading, error} = useQuery(GET_BROADCAST_CHECKER_BY_ID, {variables: {idBroadcast: id, access_token: localStorage.getItem('access_token')}})
  const [submitCheck, {data: responseCheck}] = useMutation(SUBMIT_CHECKER)
  const [itemsData, setItemsData] = useState([])

  useEffect (() => {
    if (error) {
      console.log(error.graphQLErrors)
      toast.error(`❌ ${error.graphQLErrors[0].extensions.message}`)
      history.push('/main')
    }
  }, [error]);

  useEffect (() => {
    if (data) {
      const temp = JSON.parse(JSON.stringify(data.broadcastCheckerById.purchasingOrder))
      let items = temp.items
      items = items.map((item) => {
        return {
          name: item.name,
          quantity: item.quantity,
          currentQuantity: 0
        }
      })
      console.log(items)
      setItemsData(items)
    }
  }, [data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log({
      input: itemsData,
      access_token: localStorage.getItem('access_token'),
      idPO: data.broadcastCheckerById.purchasingOrder._id,
      idBroadcast: id
    })
    await submitCheck({variables: {
      input: itemsData,
      access_token: localStorage.getItem('access_token'),
      idPO: data.broadcastCheckerById.purchasingOrder._id,
      idBroadcast: id
    }})
    toast.success(`✅ Check Submited`)
    history.push('/main')
    // console.log(itemsData)
  }

  const onChange = ({target}) => {
    let {value, name} = target
    let temp = [...itemsData]
    temp[+name] = {...temp[+name], currentQuantity: +value}
    setItemsData (temp)
  }

  if (loading) return <h1>Loading...</h1>
  else if (error) return <h1>Error..</h1>

  return (
    <>
      {/* {JSON.stringify(data.broadcastCheckerById)} */}
      <div>
        <div className="mb-5 container-fluid d-flex justify-content-between align-items-center">
          <h2 className="col-md-8">Checking PO</h2>
          <h4 className="col-md-4">ID: {data.broadcastCheckerById.purchasingOrder._id}</h4>
          
        </div>
        <div>
          <div className="mb-5">
          <Form.Label className="mb-3"><h2><i className="fa fa-boxes"/> Items</h2></Form.Label>
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group className="col" >
                  <Form.Label><h5><i className="fa fa-box"/> PO Items</h5></Form.Label>
                </Form.Group>
                <Form.Group className="col" >
                  <Form.Label><h5><i className="fa fa-box"/> PO Quantity (Box)</h5></Form.Label>
                </Form.Group>
                <Form.Group className="col" >
                  <Form.Label><h5><i className="fa fa-box"/> Recieved Quantity (Box)</h5></Form.Label>
                </Form.Group>
              </Form.Row>
              {
                itemsData.length > 0 &&
                data.broadcastCheckerById.purchasingOrder.items.map((item, index) => {
                   return (<Form.Row key={index} className="d-flex align-items-center">
                    <Form.Group className="col" >
                      <Form.Label className="ml-4" style={{textTransform: "capitalize"}}><h5>{item.name}</h5></Form.Label>
                    </Form.Group>
                    <Form.Group className="col" >
                      <Form.Label className="ml-4"><h5>{item.quantity}</h5></Form.Label>
                    </Form.Group>
                    <Form.Group className="col" >
                        <MDBInput 
                        className="col"
                        label="Recieved Quantity"
                        icon="box"
                        value={itemsData[index].currentQuantity}
                        min="0" 
                        max={`${item.quantity}`}
                        name={`${index}`}
                        onChange={onChange}

                      />
                      {/* <Form.Control onChange={onChange} name={`${index}`} value={itemsData[index].currentQuantity} type="number" min="0" max={`${item.quantity}`} placeholder="Recieved Quantity" /> */}
                    </Form.Group>
                  </Form.Row>)

                })
              }
              <button className="btn btn-primary" type="submit">Submit Task</button>
            </Form>
          </div>
        </div>

      </div>
    </>
  )
}