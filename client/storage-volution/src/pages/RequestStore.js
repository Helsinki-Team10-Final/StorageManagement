import { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";
import Loading from "../components/Loading.js"
import { storeKeyNameFromField } from "@apollo/client/utilities";

const GET_ITEM = gql`
  query findItems {
    items {
      _id
      name
      quantity
    }
  }
`;


export default function RequestStore(props) {
  const { data, loading, error } = useQuery(GET_ITEM);
  const [item, setItem] = useState({});
  const [listItem, setListItem] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    const itemData = data.items.filter((el) => {
      if (el._id == item) return el;
    });
    console.log(itemData, "item data");
    //  console.log(data.items);
    setListItem([...listItem, { name: itemData[0].name, quantity: 0 }]);
  }

const onChangeQuantity = ({ target }) => {
  let { value, name } = target;
  let temp = [...listItem];
  temp[+name] = { ...temp[+name], quantity: +value };
  setListItem(temp);
};

  function handleSubmit2(e) {
    e.preventDefault();

  }

  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <>
    {console.log(data.items)}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Example select</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => {
              setItem(e.target.value);
            }}
          >
            {data.items.map((el) => (
              <option key={el._id} value={el._id}>
                {el.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button type="submit"> Add </Button>
      </Form>
      <hr />
      <Form onSubmit={handleSubmit2}>
        <Form.Label>Nama Toko</Form.Label>
        <Form.Control name="store" type="text" placeholder="Store" />
        {listItem.map((item, i) => {
          return (
            <Form.Group key={i} controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" type="text" placeholder="item" value={item.name} />
              <Form.Label>Quantity</Form.Label>
              <Form.Control name={`${i}`} type="number" placeholder="quantity" min="0" value={item.quantity} onChange={onChangeQuantity} />
            </Form.Group>
          );
        })}
        <Button type="submit"> Submit </Button>
      </Form>
    </>
  );
}
