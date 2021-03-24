import { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";
import Loading from "../components/Loading.js"
import { SUBMIT_REQUEST, GET_REQUESTS } from "../config/queries";

const GET_ITEM = gql`
 query storeAndItemForCreateReq{
  items{
    _id
    name
    quantity
  }
  stores{
    _id
    name
  }
}
`;

export default function RequestStore(props) {
  const [submitRequest, { data: responseRequest }] = useMutation(SUBMIT_REQUEST);
  const { data, loading, error } = useQuery(GET_ITEM);
  const [item, setItem] = useState({});
  const [store, setStore] = useState({});
  const [listItem, setListItem] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (data) setItemsData([...data.items]);
  }, [data]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!item) return
    const newData = itemsData.filter((el) => {
      return (el._id !== item)
    })
    setItemsData(newData)
    console.log(newData, "newData")

    const itemData = data.items.filter((el) => {
      if (el._id == item) return el;
    });
    // console.log(itemData, "item data");
    //  console.log(data.items);
    
    setListItem([...listItem, { itemId: itemData[0]._id, itemName: itemData[0].name, quantityRequest: 0 }]);
    setItem("")
    document.getElementById("selectItem").value = "";

  }

 function handleChangeStore({target}){
    // console.log(target, "target.value");
   
  const itemData = data.stores.filter((el) => {
      if (el._id == target.value) return el;
    });
    setStore({...itemData[0]});
 }

const onChange = ({ target }) => {
  let { value, name } = target;
  let temp = [...listItem];
  temp[+name] = { ...temp[+name], quantityRequest: +value };
  setListItem(temp);
};

  const handleSubmit2 = async (e) =>{
    try {
      e.preventDefault();
      if (!store.name) {
      }
      const input = {
        storeId: store._id,
        storeName: store.name,
        items: listItem,
      };
      console.log({
        input,
        access_token: localStorage.getItem("access_token"),
      });
      await submitRequest({
        variables: {
          input,
          access_token: localStorage.getItem("access_token"),
        }, refetchQueries: [{query: GET_REQUESTS}]
      });
      toast.success(`✅ Check Submited`);
      history.push("/main/request");
    } catch (err) {
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

  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <>
      {console.log(data)}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Barang di gudang</Form.Label>
          <Form.Control
            id="selectItem"
            as="select"
            onChange={(e) => {
              console.log(e.target.value, "tergetvalue");
              setItem(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              ---Select Item---
            </option>
            {itemsData.map((el) => (
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
        <Form.Control name="storeName" as="select" onChange={handleChangeStore} defaultValue="">
          <option value="" disabled>
            ---Select Store---
          </option>

          {data.stores.map((el) => (
            <option key={el._id} value={el._id}>
              {el.name}
            </option>
          ))}
        </Form.Control>
        {listItem.map((item, i) => {
          return (
            <Form.Group key={i} controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control name="itemName" type="text" placeholder="item" value={item.itemName} disabled />
              <Form.Label>Quantity</Form.Label>
              <Form.Control name={`${i}`} type="number" placeholder="quantity" min="0" value={item.quantityRequest} onChange={onChange} />
            </Form.Group>
          );
        })}
        <br />
        <Button type="submit"> Submit </Button>
      </Form>
    </>
  );
}
