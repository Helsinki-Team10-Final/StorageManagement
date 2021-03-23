import {Form, Button, Container} from 'react-bootstrap'
import { GET_BROADCAST_PICKER_BY_ID, SUBMIT_CHECKER } from "../config/queries";
import { useQuery, useMutation, gql } from '@apollo/client'
import {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

export default function Picking(params) {
  const history = useHistory()
  const {id} = useParams()
  const {data, loading, error} = useQuery(GET_BROADCAST_PICKER_BY_ID, {variables: {id, access_token: localStorage.getItem('access_token')}})
  const [listItem, setListItem] = useState([])
  const [storeReq, setStoreReq] = useState({})

  useEffect (() => {
    if (error) {
      toast.error(`❌ Finish your existing task first`)
      history.push('/main')
    }
  }, [error]);
  
  useEffect (() => {
    if (data) {
      const temp = JSON.parse(JSON.stringify(data.broadcastPickerById))
      let items = temp.listItem
      items = items.map((item) => {
        return {
          idItem: item.idItem,
          itemName: item.itemName,
          listPO: item.listPO.map((po) => {
            return {
              idPO: po.idPO,
              quantity: po.quantity,
              picked: false
            }
          })
        }
      })
      // console.log(items)
      setListItem(items)
    }
  }, [data])

  const pickedData = (index, idPO) => {
    // console.log(listItem[index])
    let tempItem = JSON.parse(JSON.stringify(listItem))
    
    tempItem[index].listPO = tempItem[index].listPO.map((item) => {
      // console.log(item.idPO === idPO)
      if (item.idPO === idPO) return {...item, picked: true}
      return item
    })
    // console.log(tempItem)
    setListItem(tempItem)

  }

  if (loading) return <h1>Loading...</h1>
  else if (error) return <h1>Error..</h1>

  return (
    <>
      <h1>Request</h1>
      {JSON.stringify(data)}
      <div>
        <div className="mb-5 row d-flex align-items-center">
          <h1 className="col-md-4">Picking</h1>
          <h3 className="col-md-6">ID: {data.broadcastPickerById.StoreReq._id}</h3>
        </div>
        <Form.Row>
          <Form.Group className="col-md-3" >
            <Form.Label><h5><i className="fa fa-user"/> Store Name</h5></Form.Label>
            <Form.Control style={{textTransform: "capitalize"}} readOnly value={data.broadcastPickerById.StoreReq.storeName} type="text" />
          </Form.Group>
        </Form.Row>
        {
          listItem.map((item, index) => {
            return (
              <>
                <Form.Group key={index} className="col" >
                  <Form.Label className="my-3" style={{textTransform:"capitalize"}}><h5><i className="fa fa-user"/> {item.itemName}</h5></Form.Label>
                  {
                    item.listPO.map((po, idx) => {
                      return (
                        <>
                          <Form.Row key={`${idx}a${index}`}>
                            <Form.Group className="col-md-3" >
                              <Form.Label><h5><i className="fa fa-user"/> PO ID</h5></Form.Label>
                              <Form.Control plaintext value={po.idPO}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-3" >
                              <Form.Label><h5><i className="fa fa-user"/> Quantity</h5></Form.Label>
                              <Form.Control plaintext value={po.quantity} type="number" />
                            </Form.Group>
                            <Form.Group className="col-md-3" >
                              <br />
                              <Button onClick={() => {pickedData(index, po.idPO)}} disabled={po.picked} className="mt-3"><i class="fas fa-qrcode"></i></Button>
                            </Form.Group>
                            
                          </Form.Row>
                        </>
                      )
                    })
                  }
                </Form.Group>
              </>
            )
          })
        }
      </div>

    </>
  )
}