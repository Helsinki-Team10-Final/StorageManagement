import {Form, Button, Container} from 'react-bootstrap'
import { GET_BROADCAST_CHECKER_BY_ID, SUBMIT_CHECKER } from "../config/queries";
import { useQuery, useMutation, gql } from '@apollo/client'
import {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';


export default function CreatePO(props) {
  const history = useHistory()
  const {id} = useParams()
  const {data, loading, error} = useQuery(GET_BROADCAST_CHECKER_BY_ID, {variables: {idBroadcast: id, access_token: localStorage.getItem('access_token')}})
  const [submitCheck, {data: responseCheck}] = useMutation(SUBMIT_CHECKER)
  const [itemsData, setItemsData] = useState([])

  useEffect (() => {
    if (error) {
      toast.error(`❌ Finish your existing task first`)
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
    try {
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
    } catch (err) {
      console.log(err.graphQLErrors)
    }
  }

  const onChange = ({target}) => {
    let {value, name} = target
    let temp = [...itemsData]
    temp[+name] = {...temp[+name], currentQuantity: +value}
    setItemsData (temp)
  }

  if (loading) return <h1>Loading...</h1>

  return (
    <>
      <div>
        <div className="mb-5 row d-flex align-items-center">
          <h1 className="col-md-4">Checking PO</h1>
          <h3 className="col-md-6">ID: {id}</h3>
        </div>
        <div>
          <div className="mb-5">
            <h1 className="col-md-4 mb-4">Items</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group className="col" >
                  <Form.Label><h5><i className="fa fa-user"/> PO Items</h5></Form.Label>
                </Form.Group>
                <Form.Group className="col" >
                  <Form.Label><h5><i className="fa fa-user"/> PO Quantity</h5></Form.Label>
                </Form.Group>
                <Form.Group className="col" >
                  <Form.Label><h5><i className="fa fa-user"/> Recieved Quantity</h5></Form.Label>
                </Form.Group>
              </Form.Row>
              {
                itemsData.length > 0 &&
                data.broadcastCheckerById.purchasingOrder.items.map((item, index) => {
                   return (<Form.Row key={index}>
                    <Form.Group className="col" >
                      <Form.Label className="ml-4"><h5>{item.name}</h5></Form.Label>
                    </Form.Group>
                    <Form.Group className="col" >
                      <Form.Label className="ml-4"><h5>{item.quantity}</h5></Form.Label>
                    </Form.Group>
                    <Form.Group className="col" >
                      <Form.Control onChange={onChange} name={`${index}`} value={itemsData[index].currentQuantity} type="number" min="0" max={`${item.quantity}`} placeholder="Recieved Quantity" />
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