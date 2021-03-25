import { useHistory, useParams } from 'react-router-dom'
import {Form, Button, Container} from 'react-bootstrap'
import { GET_REQUEST_WITH_PO, SUBMIT_BROADCAST_REQUEST, GET_REQUESTS } from "../config/queries"
import { useQuery, useMutation, gql } from '@apollo/client'
import {useState, useEffect, useRef, createRef} from 'react'
import { toast } from 'react-toastify';
import { MDBContainer, MDBInput } from "mdbreact";

export default function CreateRequestBroadcast (props) {
  const history = useHistory()
  const {id} = useParams()
  const {data, loading, error} = useQuery(GET_REQUEST_WITH_PO, {variables: {id, access_token: localStorage.getItem('access_token')}})
  const [itemsPO, setItemsPO] = useState([])
  const [itemsPOTemp, setIiemsPOTemp] = useState([])
  const [formInput, setFormInput] = useState([])
  const elementsRef = useRef(itemsPOTemp.map(() => createRef()))
  const [submitBroadcast, {data: broadcastResult}] = useMutation(SUBMIT_BROADCAST_REQUEST)

  useEffect (() => {
    if (data) {
      setItemsPO(JSON.parse(JSON.stringify(data.requestsWithPO.dropdown)))
      setIiemsPOTemp(JSON.parse(JSON.stringify(data.requestsWithPO.dropdown)))
      setFormInput(data.requestsWithPO.dropdown.map((item)=>{
        return {idItem: item.idItem, itemName: item.name, listPO: []}
      }))
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

  const handleSelectPOId = (e) => {
    const {value, name} = e.target

    let filtered = itemsPOTemp.filter((item) => {
      if (item.name === name) {
        return item
      }
    })
    let POData = filtered[0].PO.find((item) => {
      if (item._id === value) {
        return item.current_quantity
      }
    })
    let copyOFTemp = JSON.parse(JSON.stringify(itemsPOTemp))
    copyOFTemp.map((item) =>{
      if (item.name === name) {
        item.selected = {...POData}
      }
      return item
    })

    console.log(copyOFTemp)
    setIiemsPOTemp(copyOFTemp)

  }

  const submitRowQuantity = (e, index) => {
    e.preventDefault()
    const quantity = document.getElementById(`quantity_${index}`).value

    const format = {
      idPO: itemsPOTemp[index].selected._id,
      quantity: +quantity
    }

    const copyOfFormInput = JSON.parse(JSON.stringify(formInput))
    copyOfFormInput[index].listPO = [...copyOfFormInput[index].listPO, format]
    setFormInput(copyOfFormInput)
    document.getElementById(`dropdown_${index}`).value = ""
    document.getElementById(`quantity_${index}`).value = ""
    reduceDropdown(index, format.idPO)
  }

  const reduceDropdown = (index, picked) => {
    let copyOFTemp = JSON.parse(JSON.stringify(itemsPOTemp))
    let filterPO = copyOFTemp[index].PO.filter( (po) => {
      return po._id !== picked
    })
    copyOFTemp[index].PO = [...filterPO]
    delete copyOFTemp[index].selected
    setIiemsPOTemp(copyOFTemp)
    
  }

  const countAddedPO = (index) => {
    let count = 0
    formInput[index].listPO.map((po) => {
      count += po.quantity
    })
    return count
  }

  const handleSubmitBroadcast = async () => {
    try {
      let flag = false
      // console.log(formInput)
      formInput.map((item) => {
        if (item.listPO.length > 0) flag = true
      })
      if (!flag) {
        toast.error("❌ Request hasn't been handled yet")
        return
      }
  
      console.log({itemsToPick: formInput,idStoreReq: id, access_token: localStorage.getItem('access_token')})
      await submitBroadcast({variables: {itemsToPick: formInput,idStoreReq: id, access_token: localStorage.getItem('access_token')}, refetchQueries: [{query: GET_REQUESTS}]})
      history.push('/main/request')
    } catch (err) {
      toast.error(`❌ ${err.message || err.graphQLErrors[0].extensions.message}`, {
      });
    }
  }

  return (
    <>
      <div>
        <div className="mb-5 row d-flex align-items-center">
          <div className="col-md-8">
            <h4>Store: {data.requestsWithPO.request.storeName}</h4>
            <h4>ID: {id}</h4>
          </div>
          <h2 className="col-md-4">Broadcast Request</h2>
        </div>
        <div>
          {/* {JSON.stringify(data)} */}
          {/* {JSON.stringify(formInput)} */}
            <Form.Label><h4><i className="fa fa-boxes"/> Items</h4></Form.Label>
              {
                data.requestsWithPO.request.items.map((item, index) => {
                  return (
                    <>
                      <Form.Group key={index} className="col" >
                        <Form.Label className="my-3" style={{textTransform:"capitalize"}}><h5><i className="fa fa-box"/> {item.itemName} - {item.quantityRequest} Box</h5></Form.Label>
                        {
                          formInput[index] &&
                          formInput[index].listPO.map((po, idx) => {
                            return (
                              <>
                                <Form.Row key={`${idx}a${index}`}>
                                  <Form.Group className="col-md-3" >
                                    <Form.Label><h5><i className="fa fa-user"/> PO ID</h5></Form.Label>
                                    <Form.Control readOnly value={po.idPO}>
                                      </Form.Control>
                                  </Form.Group>
                                  <Form.Group className="col-md-3" >
                                    <Form.Label><h5><i className="fa fa-user"/> Quantity (Box)</h5></Form.Label>
                                    <Form.Control readOnly value={po.quantity} type="number" />
                                  </Form.Group>
                                  <Form.Group className="col-md-3" >
                                  </Form.Group>
                                  
                                </Form.Row>
                              </>
                            )
                          })
                        }
                        
                      { itemsPOTemp[index] && 
                        <Form onSubmit={(e) => {submitRowQuantity(e, index)}}>
                        <Form.Row>
                          <Form.Group className="col-md-3" >
                            <Form.Label><h5><i className="fa fa-user"/> PO ID</h5></Form.Label>
                            <Form.Control onChange={handleSelectPOId} defaultValue="" id={`dropdown_${index}`} name={item.itemName} as="select">
                            <option value="" disabled >Select PO ID</option>
                              {
                                itemsPOTemp.map((dropdown) =>{
                                  
                                  if (item.itemName === dropdown.name) {
                                    return dropdown.PO.map(dropdownItem => {
                                      if (countAddedPO(index) < item.quantityRequest) {
                                        return <option key={dropdownItem._id} value={dropdownItem._id} >{dropdownItem._id}</option>
                                      }
                                    })
                                  }
                                })
                              }
                              
                              </Form.Control>
                          </Form.Group>
                          <div className="col-md-3">
                            <MDBInput 
                              className="" 
                              label="PO Quantity (box)" 
                              icon="box" 
                              hint="PO Quantity" 
                              disabled
                              value={itemsPOTemp[index].selected ? itemsPOTemp[index].selected.current_quantity : "-"}
                              type="number" 
                            />
                          </div>
                          
                          {/* <Form.Group className="col-md-3" >
                            <Form.Label><h5><i className="fa fa-user"/> PO Quantity</h5></Form.Label>

                            <Form.Control readOnly value={itemsPOTemp[index].selected ? itemsPOTemp[index].selected.current_quantity : "-"} type="number" />
                          </Form.Group> */}
                          <div className="col-md-3">
                            <MDBInput 
                              className="" 
                              label="PO Quantity (box)" 
                              icon="box" 
                              hint="PO Quantity" 
                              disabled={itemsPOTemp[index].selected ? false : true}
                              min="0" 
                              max={itemsPOTemp[index].selected ? (item.quantityRequest - countAddedPO(index) < itemsPOTemp[index].current_quantity ? itemsPOTemp[index].current_quantity : item.quantityRequest - countAddedPO(index) ) : item.quantityRequest - countAddedPO(index) } 
                              id={`quantity_${index}`}
                              type="number" 
                            />
                          </div>
                          {/* <Form.Group className="col-md-3" >
                            <Form.Label><h5><i className="fa fa-user"/> Quantity</h5></Form.Label>
                            <Form.Control disabled={itemsPOTemp[index].selected ? false : true} ref={elementsRef.current[index]} min="0" max={itemsPOTemp[index].selected ? (item.quantityRequest - countAddedPO(index) < itemsPOTemp[index].current_quantity ? itemsPOTemp[index].current_quantity : item.quantityRequest - countAddedPO(index) ) : item.quantityRequest - countAddedPO(index) } id={`quantity_${index}`} type="number" />
                          </Form.Group> */}
                          <Form.Group className="col-md-3" >
                            <br/>
                            <Button disabled={itemsPOTemp[index].selected ? false : true} type="submit" className="mt-2">+</Button>
                          </Form.Group>
                        </Form.Row>
                        </Form>
                      }
                      </Form.Group>
                    </>
                  )
                })
              }
              <Button onClick={handleSubmitBroadcast} className="mt-4">Submit Broadcast</Button>
              
        </div>
      </div>
    </>
  )
}