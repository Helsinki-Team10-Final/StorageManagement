import {Form, Button, Container} from 'react-bootstrap'
import { GET_PO, ADD_PO } from "../config/queries";
import { useMutation } from '@apollo/client'
import {useState} from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify';

const dateString = (date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal =  date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  return iso
}

export default function CreatePO(props) {
  const history = useHistory()
  const [handleCreatePO, {data}] = useMutation(ADD_PO);
  const [formData, setFormData] = useState({
    vendorName: '',
    expiredDate: dateString(new Date()),
    items: [{
      name: '',
      quantity: 1
    }]
  })

  const addNewItem = () => {
    setFormData({...formData, items: [...formData.items, { name: '', quantity: 1}]})
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // console.log(formData)
      if (!formData.vendorName) throw ({message: `Vendor's name is required.`})
      await handleCreatePO({variables: {input: formData, access_token: localStorage.getItem('access_token')}, refetchQueries: [{query: GET_PO}]})
      history.push('/main')
    } catch (err) {
      console.log(err)
      toast.error(`❌ ${err.message || err.graphQLErrors[0].extensions.message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  const onChange = (e) => {
    let {name, value} = e.target

    if (name === 'expiredDate') {
      value = `${value}Z`
    }

    let itemsName = name.split('_')
    if (itemsName[0] === 'Name') {
      let tempArray = [...formData.items]
      tempArray[+itemsName[1]] = {...tempArray[+itemsName[1]], name: value}
      setFormData({...formData, items: [...tempArray]})
      return
    } else if (itemsName[0] === 'Qty') {
      if (value == '-' || value == '0') value = 1 
      // if (value < 1) value = 1 
      let tempArray = [...formData.items]
      tempArray[+itemsName[1]] = {...tempArray[+itemsName[1]], quantity: +value}
      setFormData({...formData, items: [...tempArray]})
      return
    }

    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <>
      <h1 className="mb-5">Create PO</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Form.Group className="col-md-8" >
            <Form.Label><h5><i className="fa fa-user"/> Vendor's Name</h5></Form.Label>
            <Form.Control onChange={onChange} name="vendorName" value={formData.vendorName} type="text" placeholder="Enter Vendor's Name" />
          </Form.Group>
        </Form.Row>

        <Form.Label><h5><i className="fa fa-box"/> Items</h5></Form.Label>
        <Container className="col" fluid style={{maxHeight: '50vh', overflowY: "auto"}}>
          {
            formData.items.map((item, index) => {
              return (
                <Form.Row key={index}>
                  <Form.Group className="col-md-4">
                    <Form.Label><h5>Name</h5></Form.Label>
                    <Form.Control
                      value={formData.items[index].name}
                      name={`Name_${index}`}
                      onChange={onChange}
                      placeholder="Item Name" 
                    />
                  </Form.Group>
                  <Form.Group className="col-md-4">
                    <Form.Label><h5>Quantity</h5></Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1"
                      value={formData.items[index].quantity}
                      name={`Qty_${index}`}
                      onChange={onChange}
                      placeholder="Item Quantity" 
                    />
                  </Form.Group>
                </Form.Row>
              )
            })
          }
        </Container>

        <Button onClick={addNewItem} className="mb-4" variant="primary">
          Add new item
        </Button>

        <Form.Row>
          <Form.Group className="col-md-8" >
            <Form.Label><h5><i className="fa fa-calendar"/> Expired Date</h5></Form.Label>
            <Form.Control type="datetime-local" name="expiredDate" onChange={onChange} value={formData.expiredDate.slice(0,19)}/>
          </Form.Group>
        </Form.Row>
        
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  )
}