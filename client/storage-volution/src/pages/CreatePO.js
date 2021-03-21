import {Form, Button, Container} from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker';
import {useState} from 'react'

const dateString = (date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal =  date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  return iso
}

export default function CreatePO(props) {
  const [formData, setFormData] = useState({
    vendorName: '',
    expiredDate: dateString(new Date()),
    items: [{
      name: '',
      quantity: 1
    }]
  })
  console.log(formData)

  const addNewItem = () => {
    setFormData({...formData, items: [...formData.items, { name: '', quantity: 1}]})
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
      <Form>
        <Form.Row>
          <Form.Group className="col-md-5" >
            <Form.Label><h5><i className="fa fa-user"/> Vendor's Name</h5></Form.Label>
            <Form.Control onChange={onChange} name="vendorName" value={formData.vendorName} type="text" placeholder="Enter Vendor's Name" />
          </Form.Group>
        </Form.Row>

        <Form.Label className="mb-3"><h5>Items</h5></Form.Label>
        <Container fluid style={{maxHeight: '50vh', overflowY: "auto"}}>
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

        <Button onClick={addNewItem} className="mb-3" variant="primary">
          Add new item
        </Button>

        <Form.Group >
          <Form.Label>Expired Date</Form.Label>
          {/* <Form.Control type="datetime-local" name="expiredDate" onChange={onChange} value={dateString(formData.expiredDate.toLocaleString("id-ID")).slice(0,19)}/> */}
          <Form.Control type="datetime-local" name="expiredDate" onChange={onChange} value={formData.expiredDate.slice(0,19)}/>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  )
}