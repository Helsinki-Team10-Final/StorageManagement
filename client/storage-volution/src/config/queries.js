import { gql } from '@apollo/client'

export const ADD_PO = gql`
  mutation createPO ($input: CreatePurchasingOrderInput, $access_token: String!){
    createPurchasingOrder(input: $input, access_token: $access_token) {
      vendorName,
      status,
      items {
        name
        quantity
      }
      createdAt,
      updatedAt,
      expiredDate
    }
  }

`;

export const GET_PO =gql`
query getPO{
  purchasingOrders {
    _id,
    vendorName,
    items {
      name,
      quantity,
      currentQuantity
    }
    status,
    createdAt
  }
}
`;

export const GET_DETAIL_PO = gql`
  query getPObyId($id: ID!){
    purchasingOrderById(id: $id){
      _id
      vendorName
      items{
        name
        quantity
        currentQuantity
      }
      status
      createdAt
      updatedAt
      expiredDate
    }
  }

`;

export const CREATE_BROADCAST_CHECKER = gql`
  mutation createBroadCastAdminForChecker($idPO: ID!, $access_token: String!){
    createBroadcastChecker(idPurchasingOrder: $idPO, access_token: $access_token) {
      _id
      purchasingOrder{
        _id
        vendorName
        items{
          name
                quantity
                currentQuantity
        }
        status
        createdAt
        updatedAt
        expiredDate
      }
        role
        checkerId
    }
  }
`;

export const GET_BROADCASTS_CHECKER = gql`
  query broadcastForCheckers($access_token: String!){
  broadcastChecker(access_token: $access_token) {
    broadcasts {
      _id
      purchasingOrder {
        _id
        vendorName
        items{
          name
          quantity
          currentQuantity
        }
        status
        createdAt
        updatedAt
        expiredDate
      }
      role
      checkerId
    }
      unfinishedBroadcast {
        _id
        purchasingOrder {
          _id
          vendorName
          items {
            name
            quantity
            currentQuantity
          }
          status
          createdAt
          updatedAt
          expiredDate
        }
        role
        checkerId
      }
    }
  }

`;

export const GET_BROADCAST_CHECKER_BY_ID = gql`
  query broadcastCheckerById($idBroadcast: ID!, $access_token: String!) {
    broadcastCheckerById(id: $idBroadcast ,access_token: $access_token) {
      _id
      purchasingOrder {
        _id
        status,
        items {
          name,
          quantity,
          currentQuantity
        }
      },
      role,
      checkerId
    }
  }
`;

<<<<<<< HEAD
export const GET_PO = gql`
  query getPO {
    purchasingOrders {
      _id
      vendorName
      items {
        name
        quantity
        currentQuantity
      }
      status
      createdAt
      expiredDate
    }
=======
export const SUBMIT_CHECKER = gql`
  mutation checkerClickDone ($input: [ItemInputUpdate]!, $access_token: String!, $idPO: String!, $idBroadcast: String!) {
    checkerUpdateItem(items: $input, access_token: $access_token, idPO: $idPO, idBroadCast: $idBroadcast)
>>>>>>> e3fa405bad147a09649eff9f074adfb5d498e767
  }
`;