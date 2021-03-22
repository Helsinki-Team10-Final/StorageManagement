import {useQuery, gql} from '@apollo/client'

const GET_ALL_PO = gql`
  query getPO{
    purchasingOrders {
      _id,
      vendorName,
      items {
        name,
        quantity,
        currentQuantity
      }
      status
    }
  }
`;

export default function ListPOK(props) {
  const {loading, error, data} = useQuery(GET_ALL_PO)

  if (loading) {
    return (
      <h1>Loading...</h1>
    )
  } else if (error) {
    return <h1>Error..</h1>
  }
  console.log(data)


  return (
    <>
      <h1 className="mb-3">List Broadcast</h1>
      {JSON.stringify(data)}
    </>
  )
}