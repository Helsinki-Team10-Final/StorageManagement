import {Form, Button, Modal, Container} from 'react-bootstrap'
import { GET_BROADCAST_PICKER_BY_ID, SUBMIT_PICKER } from "../config/queries";
import { useQuery, useMutation, gql } from '@apollo/client'
import {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import QrReader from 'react-qr-reader'
import { MDBContainer, MDBInput } from "mdbreact";

export default function Picking(params) {
  const history = useHistory()
  const {id} = useParams()
  const {data, loading, error} = useQuery(GET_BROADCAST_PICKER_BY_ID, {variables: {id, access_token: localStorage.getItem('access_token')}})
  const [submitPick, {data: responsePick}] = useMutation(SUBMIT_PICKER)
  const [listItem, setListItem] = useState([])
  const [storeReq, setStoreReq] = useState({})
  const [show, setShow] = useState(false);
  const [dataToScan, setDataToScan] = useState({
    value: {},
    qrData: {}
  })

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect (() => {
    if (error) {
      console.log(error.graphQLErrors)
      toast.error(`❌ ${error.graphQLErrors[0].extensions.message}`)
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

  const handleClickQR = (index, idPO, itemName) => {
    setDataToScan({
      value: {index, idPO, itemName},
      qrData: {
        _id: idPO,
        name: itemName
      }
    })
    handleShow()
  }

  // const onScanned = (e) => {
  //   if (e) {
  //     let decoded = JSON.parse(e)
  //     if (decoded) {
  //       const {_id, name} = dataToScan.qrData
  //       if (decoded._id === _id && decoded.name === name) {
  //         handleClose()
  //         const {index, idPO} = dataToScan.value
  //         pickedData (index, idPO)
  //       } else {
  //         console.log(decoded)
  //       }
  //     }
  //   }
  // }
  const onScanned = (e) => {
    if (e) {
      let decoded = JSON.parse(e)
      if (decoded) {
        const {_id, name} = dataToScan.qrData
        if (decoded._id && decoded.name) {
          handleClose()
          const {index, idPO} = dataToScan.value
          pickedData (index, idPO)
        } else {
          console.log(decoded)
        }
      }
    }
  }

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

  const checkTasks = async () => {
    try {
      let flag = false
      listItem.map((item) => {
        item.listPO.map((po) => {
          if (!po.picked) flag = true
        })
      })
      if (flag) {
        toast.error(`❌ Please pick all items first before submitting task`)
        return
      } 
      let temp = JSON.parse(JSON.stringify(data.broadcastPickerById))
      
      
      temp.listItem = temp.listItem.map((item) => {
        return {
          idItem: item.idItem,
          itemName: item.itemName,
          listPO: item.listPO.map((po) => {
            return {
              idPO: po.idPO,
              quantity: po.quantity
            }
          })
        }
      })
      // console.log(temp.listItem)

      const input = {
        idBroadcast: data.broadcastPickerById._id,
        role: data.broadcastPickerById.role,
        listItem: temp.listItem
      }
      console.log(
        {
          input,
          access_token: localStorage.getItem('access_token'),
          idStoreReq: data.broadcastPickerById.StoreReq._id,
        }
      )
      await submitPick({variables: {
        input,
        access_token: localStorage.getItem('access_token'),
        idStoreReq: data.broadcastPickerById.StoreReq._id,
      }})
      toast.success(`✅ Check Submited`)
      history.push('/main')
    } catch (err) {
      console.log(err.graphQLErrors)
    }
    
  }

  if (loading) return <h1>Loading...</h1>
  else if (error) return <h1>Error..</h1>

  return (
    <>
      {/* {JSON.stringify(data)} */}
      <div>
        <div className="mb-5 container-fluid d-flex justify-content-between align-items-center">
          <h2 className="col-md-8">Picking Request</h2>
          <div className="col-md-4">
            <h4>Store: {data.broadcastPickerById.StoreReq.storeName}</h4>
            <h4>ID: {id}</h4>
          </div>
          
        </div>
        <Form.Label><h3><i className="fa fa-boxes"/> Items</h3></Form.Label>
        {
          listItem.map((item, index) => {
            return (
              <>
                <Form.Group key={index} className="col" >
                  <Form.Label className="my-3" style={{textTransform:"capitalize"}}><h4><i className="fa fa-clipboard"/> {item.itemName}</h4></Form.Label>
                  {
                    item.listPO.map((po, idx) => {
                      return (
                        <>
                          <Form.Row key={`${idx}a${index}`}>
                            <div className="col-md-3">
                              <MDBInput 
                                className="" 
                                label="PO ID" 
                                icon="warehouse"
                                disabled
                                value={po.idPO}
                              />
                            </div>
                            <div className="col-md-3">
                              <MDBInput 
                                className="" 
                                label="Quantity (Box)" 
                                icon="box"
                                disabled
                                value={po.quantity}
                              />
                            </div>
                        
                            <Form.Group className="col-md-3" >
                              <br />
                              <Button onClick={() => {handleClickQR(index, po.idPO, item.itemName)}} disabled={po.picked} className="mt-3"><i class="fas fa-qrcode"></i></Button>
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
        <Button onClick={checkTasks} className="mt-4">Submit Task</Button>
      </div>
      
      <Modal centered show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Scan Item QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QrReader
            delay={400}
            onError={(e) => { console.log(e)}}
            onScan={onScanned}
            style={{ width: '100%' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}